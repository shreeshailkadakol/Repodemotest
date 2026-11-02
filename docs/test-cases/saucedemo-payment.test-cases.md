# Sauce Demo Checkout Payment - Test Cases

**Component:** Payment  
**Test URL:** https://sauce-demo.myshopify.com/collections/all (cart seeded, then `/cart` -> `/checkouts/...`)  
**Automated spec:** `tests/specs/paymentComponent.spec.ts`  
**Page object:** `components/paymentComponent.ts` (extends `CartCheckoutComponent`)  
**DOM inspection:** November 2, 2026

## Live DOM Findings

| Element | Observed selector |
|---|---|
| Contact email | `input[name="email"]` |
| Delivery fields | `select[name="countryCode"]`, `input[name="firstName"]`, `lastName`, `address1` (`#shipping-address1`), `city`, `postalCode` (ignore the hidden `#autofill_*` duplicates) |
| Shipping method | Single flat rate (£10.00), auto-applied: no radio. Pay now total changes £55.00 -> £65.00 |
| Payment heading / gateway | `h2#payment` "Pay with credit card", `button[aria-label="Test Payment Gateway"]` |
| Card fields | PCI iframes `iframe[id^="card-fields-{number,expiry,verification_value,name}"]` (`checkout.pci.shopifyinc.com`), inputs `#number`, `#expiry`, `#verification_value`, `#name` |
| Pay now | `button#checkout-pay-button` (text "Pay now £55.00") |

The store uses Shopify's **Test Payment Gateway** (Bogus): card number `1` approves, `2` is declined, `3` raises a gateway error. Card inputs are in iframes, so they use `frameLocator` instead of SmartLocator (SmartLocator searches the page only); every other element uses SmartLocator.

## Automated Test Cases

| ID | Title | Tags |
|---|---|---|
| TC-P01 | Checkout shows the credit card payment section (heading, gateway, 4 card fields) | @Functional @Smoke |
| TC-P02 | Pay now button shows the £55.00 order total | @Functional |
| TC-P03 | Card number, name, expiry and security code can be entered | @Functional |
| TC-P04 | Paying with no details is blocked and stays on checkout | @Functional @Negative |
| TC-P05 | Valid card (`1`) completes payment and shows the order confirmation | @Functional @Smoke |
| TC-P06 | Declined card (`2`) shows an error and does not complete the order | @Functional @Negative |

## Known Findings

- **TC-P05 places a real (test-gateway) order** on the shared public Sauce Demo store each run, using `qa.automation@example.com`. Check with the store owner before running it in CI or at volume.
- The test store is external; price or shipping-rate changes would break the £55.00 / £65.00 assertions.
- Reaching checkout takes ~50s (cart seeding retries, Shopify-hosted page), so the spec sets a 180s timeout.
- Card number `3` (gateway exception) is not covered.
- The payment error locator uses `role="alert"` / `error-for-*`; verify it on a Shopify checkout update.
