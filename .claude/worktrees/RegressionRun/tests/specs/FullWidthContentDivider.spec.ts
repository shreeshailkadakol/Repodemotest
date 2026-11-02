import { test } from '@playwright/test';
import { FullWidthContentDivider } from '../../components/FullWidthContentDivider';
import { envUtils } from '../../helpers/utils/envUtils';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

let fullWidthContentDivider: FullWidthContentDivider;
let fullWidthURL: string;

test.describe('FullWidthContentDivider Component Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('FullWidthContentDivider');
  });

  test.beforeEach(async ({ page, browser, context }) => {
    fullWidthContentDivider = new FullWidthContentDivider(page, browser, context);
    const baseURL = envUtils.getBaseUrl();
    fullWidthURL = await fullWidthContentDivider.getComponentUrl(
      'FullWidthContentDividerComponent',
      baseURL
    );

    // Navigate to the component URL with authentication
    await fullWidthContentDivider.navigateWithAuthentication(fullWidthURL);

    // Accept cookies banner after authentication
    await fullWidthContentDivider.acceptCookiesBanner();
  });

  test.describe('Functional Tests', () => {
    test('TC-FWC01: Verify both fullwidth variations exist @Functional @UKProd @Smoke', async () => {
      // Validate both variations exist and check container class differences
      await fullWidthContentDivider.validateBothVariationsExist();
    });
  });
});
