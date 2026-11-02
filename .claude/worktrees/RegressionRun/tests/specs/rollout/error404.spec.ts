import { test } from '@playwright/test';
import { Error404Page } from '../../../components/error404Page';
import { micrositeUrls } from '../../../config/micrositeUrls';

/**
 * Cross-site 404 page validation (language-agnostic).
 *
 * For each microsite in config/micrositeUrls.ts, navigates to a guaranteed-404
 * URL and validates the 404 page structure:
 *   - HTTP 404
 *   - header Bayer logo -> site home
 *   - language selector not accessible (absent or disabled); location selector present & enabled
 *   - body image + descriptive text
 *   - body links: Home (site landing), Search (/search), Bayer Worldwide (bayer.com), News (structural)
 *   - footer exists
 *   - pill navigation present
 *
 * All assertions are soft, so every site in the run is reported even if one fails.
 */
test.describe('404 Page Validation - Microsites', () => {
  for (const site of micrositeUrls) {
    // eslint-disable-next-line playwright/expect-expect
    test(`@NotFound 404 page :: ${site.country} (${site.locale})`, async ({
      page,
      browser,
      context,
    }) => {
      test.setTimeout(90 * 1000);
      const errorPage = new Error404Page(page, browser, context);
      await errorPage.validateNotFoundPage(site.baseUrl);
    });
  }
});
