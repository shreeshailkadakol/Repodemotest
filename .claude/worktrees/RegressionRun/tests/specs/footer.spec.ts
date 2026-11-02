import { test } from '@playwright/test';
import { Footer } from '../../components/footer';
import { envUtils } from '../../helpers/utils/envUtils';
import { BasePage } from '../../helpers/utils/basePage';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

let basePage: BasePage;
let footer: Footer;
let footerURL: string;

test.describe('Footer Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('footer');
  });

  test.beforeEach(async ({ page, browser, context }) => {
    footer = new Footer(page, browser, context);
    const baseURL = envUtils.getBaseUrl();
    footerURL = await footer.getComponentUrl('FooterComponent', baseURL);

    // Navigate to the Footer component URL with authentication
    await footer.navigateWithAuthentication(footerURL);

    // Accept cookies banner after authentication
    await footer.acceptCookiesBanner();
  });

  test('@tag: Verify footer copyright @Smoke @UKSmoke', async () => {
    // Scroll to footer
    await footer.scrollToFooter();

    // Verify copyright text and symbol
    await footer.validateCopyright();
  });
});
