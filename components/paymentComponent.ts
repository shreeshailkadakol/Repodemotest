import { Browser, BrowserContext, expect, FrameLocator, Locator, Page } from '@playwright/test';
import { CartCheckoutComponent } from './cartCheckoutComponent';
import { envUtils } from '../helpers/utils/envUtils';

export interface ShippingAddress {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postcode: string;
}

export interface CardDetails {
  number: string;
  expiry: string;
  securityCode: string;
  nameOnCard: string;
}

/**
 * Checkout payment: contact + delivery details, shipping method, credit card entry and Pay now.
 *
 * The store uses Shopify's Test Payment Gateway (Bogus): card number "1" approves, "2" is declined
 * and "3" raises a gateway error. Card inputs live in PCI iframes, which SmartLocator cannot scope,
 * so they are located through frameLocator; every other element uses SmartLocator.
 */
export class PaymentComponent extends CartCheckoutComponent {
  static readonly VALID_CARD: CardDetails = {
    number: '1',
    expiry: '12 / 30',
    securityCode: '123',
    nameOnCard: 'Test Shopper',
  };
  static readonly DECLINED_CARD: CardDetails = { ...PaymentComponent.VALID_CARD, number: '2' };
  static readonly ADDRESS: ShippingAddress = {
    email: 'qa.automation@example.com',
    country: 'United Kingdom',
    firstName: 'Test',
    lastName: 'Shopper',
    address: '1 Test Street',
    city: 'London',
    postcode: 'SW1A 1AA',
  };

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  async navigateToComponent(): Promise<void> {
    const url = await this.getComponentUrl('PaymentComponent', envUtils.getBaseUrl());
    await this.navigateTo(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Seeds the cart, goes through the cart page and lands on the checkout form. */
  async reachCheckout(): Promise<void> {
    await this.seedCartWithGreyJacket();
    await this.openCartPageFromHeader();
    await this.proceedToCheckout();
    await (await this.getCheckoutEmailField()).waitFor({ state: 'visible' });
  }

  // ---------- Contact and delivery ----------

  async fillDeliveryDetails(address: ShippingAddress = PaymentComponent.ADDRESS): Promise<void> {
    await this.fillSmart(
      {
        css: 'input[name="email"]',
        xpath: '//input[@name="email"]',
        label: /^email$/i,
        description: 'Checkout contact email field',
      },
      address.email
    );
    await (
      await this.findSmart({
        css: 'select[name="countryCode"]',
        label: /country\/region/i,
        description: 'Delivery country select',
      })
    ).selectOption({ label: address.country });
    await this.fillSmart(
      {
        css: 'input[name="firstName"]:not([id^="autofill"])',
        placeholder: /first name/i,
        description: 'Delivery first name field',
      },
      address.firstName
    );
    await this.fillSmart(
      {
        css: 'input[name="lastName"]:not([id^="autofill"])',
        placeholder: /^last name/i,
        description: 'Delivery last name field',
      },
      address.lastName
    );
    await this.fillSmart(
      {
        css: 'input#shipping-address1',
        xpath: '//input[@name="address1" and not(starts-with(@id,"autofill"))]',
        placeholder: /^address/i,
        description: 'Delivery address field',
      },
      address.address
    );
    await this.fillSmart(
      {
        css: 'input[name="city"]:not([id^="autofill"])',
        placeholder: /^city/i,
        description: 'Delivery city field',
      },
      address.city
    );
    await this.fillSmart(
      {
        css: 'input[name="postalCode"]:not([id^="autofill"])',
        placeholder: /post(al )?code/i,
        description: 'Delivery postcode field',
      },
      address.postcode
    );
  }

  // ---------- Payment section ----------

  async getPaymentHeading(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'heading', name: /pay with credit card/i },
      css: 'h2#payment',
      xpath: '//h2[@id="payment"]',
      description: 'Payment section heading',
    });
  }

  async getPaymentGatewayLabel(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /test payment gateway/i },
      css: 'button[aria-label="Test Payment Gateway"]',
      xpath: '//button[@aria-label="Test Payment Gateway"]',
      description: 'Test Payment Gateway option',
    });
  }

  private cardField(frameKey: string, inputId: string): Locator {
    const frame: FrameLocator = this.page.frameLocator(`iframe[id^="card-fields-${frameKey}"]`);
    return frame.locator(`input#${inputId}`);
  }

  getCardNumberField(): Locator {
    return this.cardField('number', 'number');
  }

  getCardExpiryField(): Locator {
    return this.cardField('expiry', 'expiry');
  }

  getCardSecurityCodeField(): Locator {
    return this.cardField('verification_value', 'verification_value');
  }

  getCardNameField(): Locator {
    return this.cardField('name', 'name');
  }

  async enterCardDetails(card: CardDetails = PaymentComponent.VALID_CARD): Promise<void> {
    await this.getCardNumberField().fill(card.number);
    await this.getCardNameField().fill(card.nameOnCard);
    await this.getCardExpiryField().fill(card.expiry);
    await this.getCardSecurityCodeField().fill(card.securityCode);
  }

  async getPayNowButton(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /pay now/i },
      css: 'button#checkout-pay-button',
      xpath: '//button[@id="checkout-pay-button"]',
      description: 'Pay now button',
    });
  }

  /** The store has one flat rate with no radio; it is applied once the Pay now total includes it. */
  async waitForShippingApplied(total = '£65.00'): Promise<void> {
    await expect(await this.getPayNowButton()).toContainText(total, { timeout: 30_000 });
  }

  async payNow(): Promise<void> {
    await (await this.getPayNowButton()).click();
  }

  async completePayment(card: CardDetails = PaymentComponent.VALID_CARD): Promise<void> {
    await this.fillDeliveryDetails();
    await this.waitForShippingApplied();
    await this.enterCardDetails(card);
    await this.payNow();
  }

  // ---------- Result ----------

  async getOrderConfirmation(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'heading', name: /thank you/i },
      css: 'h1, h2',
      xpath: '//*[self::h1 or self::h2][contains(.,"Thank you")]',
      text: /thank you/i,
      description: 'Order confirmation heading',
    });
  }

  async getPaymentError(): Promise<Locator> {
    return await this.findSmart({
      css: '[role="alert"], [id^="error-for-"]',
      xpath: '//*[@role="alert" or starts-with(@id,"error-for-")]',
      text: /declined|could not process|payment/i,
      description: 'Payment error message',
    });
  }
}
