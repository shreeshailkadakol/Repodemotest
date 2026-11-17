import { test } from '@playwright/test';
import { OptimizelyLoginComponent } from '../../components/optimizelyLoginComponent';
import { CmsPageComponent, CmsPageSpec } from '../../components/cmsPageComponent';

// Creates and publishes REAL content: run against a QA/sandbox CMS only.
test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Optimizely CMS page creation @CmsPage', () => {
  let cms: CmsPageComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    const login = new OptimizelyLoginComponent(page, browser, context);
    await login.navigateToComponent();
    const { username, password } = OptimizelyLoginComponent.credentials;
    await login.login(username, password);
    await login.verifyLoggedIn();

    cms = new CmsPageComponent(page, browser, context);
    await cms.navigateToComponent();
    await cms.openEditView();
  });

  // Created pages are RETAINED: nothing is moved to the Trash unless CMS_CLEANUP=delete is set explicitly.
  test.afterEach(async () => {
    if (!cms) return; // beforeEach failed (e.g. CMS unreachable); nothing was created
    const { deleted, leftovers } = await cms.cleanupCreatedPages();
    if (deleted.length) console.log(`CMS cleanup (CMS_CLEANUP=delete): moved to Trash -> ${deleted.join(', ')}`);
    if (leftovers.length) console.log(`CMS page(s) RETAINED in CMS -> ${leftovers.join(', ')}`);
  });

  test('TC-CP01: create Standard Page, add text block, publish and validate @Functional', async () => {
    test.setTimeout(240000);
    const pageName = CmsPageComponent.uniqueName();
    const spec: CmsPageSpec = {
      pageType: 'Standard Page',
      name: pageName,
      fields: [
        { label: 'Teaser text', propertyName: 'teaserText', kind: 'textarea', value: 'QA automation teaser text', rendersOnFrontend: false },
        { label: 'Main body', kind: 'richtext', value: 'QA automation page body text' },
      ],
      components: [
        {
          type: 'Editorial',
          target: 'Large content area',
          name: `${pageName}-block`,
          fields: [
            { label: 'Main body', kind: 'richtext', value: 'QA automation editorial text' },
          ],
        },
      ],
    };
    console.log(`CMS page created by this run: ${pageName}`);

    await cms.createPage(spec.name, spec.pageType);
    await cms.populatePage(spec);
    for (const field of spec.fields) {
      await cms.verifyFieldSaved(field);
    }
    await cms.verifyComponentInArea(spec.components[0]);
    await cms.publish();
    await cms.verifyPublishedInCms();
    await cms.verifyPublishedOnFrontend(spec);
  });

  test('TC-CP02: create Standard Page with Text (Editorial) and Teaser (logo + text) blocks, publish and validate @Functional', async ({ page }) => {
    test.setTimeout(300000);
    const pageName = CmsPageComponent.uniqueName();
    const spec: CmsPageSpec = {
      pageType: 'Standard Page',
      name: pageName,
      fields: [
        { label: 'Main body', kind: 'richtext', value: 'QA automation page body text' },
      ],
      components: [
        {
          type: 'Editorial',
          target: 'Large content area',
          name: `${pageName}-text`,
          fields: [{ label: 'Main body', kind: 'richtext', value: 'QA automation editorial text' }],
        },
        {
          type: 'Teaser',
          target: 'Large content area',
          name: `${pageName}-teaser`,
          fields: [
            { label: 'Heading', propertyName: 'heading', kind: 'text', value: 'QA Teaser Heading' },
            { label: 'Text', propertyName: 'text', kind: 'textarea', value: 'QA automation teaser text' },
            { label: 'Image', kind: 'image', value: 'logotype.png' },
          ],
        },
      ],
    };
    console.log(`CMS page created by this run: ${pageName}`);

    await cms.createPage(spec.name, spec.pageType);
    await cms.populatePage(spec);
    // Requested fixed wait: let the Text and Teaser blocks finish saving/rendering before validation.
    await page.waitForTimeout(3000);
    // Auto-wait for the Teaser image upload/selection to be attached and rendered before validating.
    for (const component of spec.components) {
      await cms.waitForImageUploaded(component);
    }
    for (const field of spec.fields) {
      await cms.verifyFieldSaved(field);
    }
    for (const component of spec.components) {
      await cms.verifyComponentInArea(component);
    }
    await cms.publish();
    await cms.verifyPublishedInCms();
    await cms.verifyPublishedOnFrontend(spec);
  });
});
