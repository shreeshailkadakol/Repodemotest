/**
 * Component Registry
 * What:
 *   Central registry mapping data-qa attributes (found on rendered pages)
 *   to their corresponding Page Object spec files and metadata.
 * Why:
 *   Drives the page-validate.ts and componentTestRunner.ts orchestration
 *   so identification of components on a page automatically picks the
 *   correct spec file to execute.
 */

export interface ComponentDefinition {
  dataQa: string;
  componentName: string;
  specFile: string;
  testTags: string[];
}

export const COMPONENT_REGISTRY: ComponentDefinition[] = [
  {
    dataQa: 'Header',
    componentName: 'HeaderComponent',
    specFile: 'tests/specs/header.spec.ts',
    testTags: ['@Header', '@Functional'],
  },
  {
    dataQa: 'homepage-hero',
    componentName: 'HomepageHeroComponent',
    specFile: 'tests/specs/homepageHero.spec.ts',
    testTags: ['@HomepageHero', '@Functional'],
  },
  {
    dataQa: 'teaser-group',
    componentName: 'TeaserGroupComponent',
    specFile: 'tests/specs/teaserGroupComponent.spec.ts',
    testTags: ['@TeaserGroup', '@Functional'],
  },
  {
    dataQa: 'teaser-grid',
    componentName: 'TeaserGridComponent',
    specFile: 'tests/specs/teaserGrid.spec.ts',
    testTags: ['@TeaserGrid', '@Functional'],
  },
  {
    dataQa: 'individual-teaser',
    componentName: 'IndividualTeaserComponent',
    specFile: 'tests/specs/individualTeaserComponent.spec.ts',
    testTags: ['@IndividualTeaser', '@Functional'],
  },
  {
    dataQa: 'banner-component',
    componentName: 'BannerComponent',
    specFile: 'tests/specs/bannerSVariant.spec.ts',
    testTags: ['@Banner', '@Functional'],
  },
  {
    dataQa: 'footer-block',
    componentName: 'FooterBlocksOfLinks',
    specFile: 'tests/specs/footerBlocksOfLinks.spec.ts',
    testTags: ['@FooterBlocks', '@Functional'],
  },
  {
    dataQa: 'footer-copyright',
    componentName: 'Footer',
    specFile: 'tests/specs/footer.spec.ts',
    testTags: ['@Footer', '@Functional'],
  },
  {
    dataQa: 'breadcrumb',
    componentName: 'BreadcrumbComponent',
    specFile: 'tests/specs/breadcrumb-complete.spec.ts',
    testTags: ['@Breadcrumb', '@Functional'],
  },
  {
    dataQa: 'news-list',
    componentName: 'NewsListComponent',
    specFile: 'tests/specs/newsListComponent.spec.ts',
    testTags: ['@NewsList', '@Functional'],
  },
  {
    dataQa: 'social-media-links',
    componentName: 'SocialMediaComponent',
    specFile: 'tests/specs/socialMediaComponent.spec.ts',
    testTags: ['@SocialMedia', '@Functional'],
  },
  {
    dataQa: 'related-content-item',
    componentName: 'RelatedContentComponent',
    specFile: 'tests/specs/relatedContent.spec.ts',
    testTags: ['@RelatedContent', '@Functional'],
  },
  {
    dataQa: 'document-title',
    componentName: 'DocumentDownloadComponent',
    specFile: 'tests/specs/documentDownload.spec.ts',
    testTags: ['@DocumentDownload', '@Functional'],
  },
  {
    dataQa: 'key-figures-group',
    componentName: 'KeyFiguresGroupComponent',
    specFile: 'tests/specs/keyFiguresGroupComponent.spec.ts',
    testTags: ['@KeyFigures', '@Functional'],
  },
  {
    dataQa: 'quote-component',
    componentName: 'QuoteComponent',
    specFile: 'tests/specs/quoteComponent.spec.ts',
    testTags: ['@Quote', '@Functional'],
  },
  {
    dataQa: 'video-component',
    componentName: 'VideoComponent',
    specFile: 'tests/specs/videoComponent.spec.ts',
    testTags: ['@Video', '@Functional'],
  },
  {
    dataQa: 'accordion-component',
    componentName: 'AccordionComponent',
    specFile: 'tests/specs/accordionComponent.spec.ts',
    testTags: ['@Accordion', '@Functional'],
  },
  {
    dataQa: 'stage-image-section',
    componentName: 'StageComponent',
    specFile: 'tests/specs/stageComponent.spec.ts',
    testTags: ['@Stage', '@Functional'],
  },
  {
    dataQa: 'consent-gated-content',
    componentName: 'ConsentGatedContentComponent',
    specFile: 'tests/specs/consent-gated-content.spec.ts',
    testTags: ['@ConsentGated', '@Functional'],
  },
  {
    dataQa: 'event-stage',
    componentName: 'EventStageComponent',
    specFile: 'tests/specs/eventStageAndDetails.spec.ts',
    testTags: ['@EventStage', '@Functional'],
  },
  {
    dataQa: 'event-details',
    componentName: 'EventDetailsComponent',
    specFile: 'tests/specs/eventStageAndDetails.spec.ts',
    testTags: ['@EventDetails', '@Functional'],
  },
];

const REGISTRY_BY_DATA_QA: Map<string, ComponentDefinition> = new Map(
  COMPONENT_REGISTRY.map((c) => [c.dataQa, c])
);

export function getComponentByDataQa(dataQa: string): ComponentDefinition | undefined {
  return REGISTRY_BY_DATA_QA.get(dataQa);
}

export function isRegisteredComponent(dataQa: string): boolean {
  return REGISTRY_BY_DATA_QA.has(dataQa);
}

export function getAllRegisteredDataQa(): string[] {
  return Array.from(REGISTRY_BY_DATA_QA.keys());
}
