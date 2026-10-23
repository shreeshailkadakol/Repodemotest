/**
 * Component Registry
 * Maps data-qa attributes (found in DOM) to actual test component files
 * This is the single source of truth for component identification
 */

export interface ComponentDefinition {
  dataQa: string;                    // data-qa attribute in DOM
  componentName: string;              // Component class name
  specFile: string;                   // Test spec file path
  testTags: string[];                 // Test tags for filtering
  description?: string;               // Optional description
}

/**
 * Registry of all automated components
 * Add new components here when they are automated
 */
export const COMPONENT_REGISTRY: ComponentDefinition[] = [
  // Header & Navigation
  {
    dataQa: 'Header',
    componentName: 'HeaderComponent',
    specFile: 'tests/specs/header.spec.ts',
    testTags: ['@Header', '@Functional'],
    description: 'Site header with navigation'
  },
  
  // Footer
  {
    dataQa: 'footer',
    componentName: 'FooterComponent',
    specFile: 'tests/specs/footer.spec.ts',
    testTags: ['@Footer', '@Functional'],
    description: 'Site footer'
  },
  {
    dataQa: 'footer-block',
    componentName: 'FooterBlocksOfLinks',
    specFile: 'tests/specs/footerBlocksOfLinks.spec.ts',
    testTags: ['@FooterBlocks', '@Functional'],
    description: 'Footer blocks with links'
  },
  
  // Homepage Components
  {
    dataQa: 'homepage-hero',
    componentName: 'HomepageHeroComponent',
    specFile: 'tests/specs/homepageHero.spec.ts',
    testTags: ['@HomepageHero', '@Functional'],
    description: 'Homepage hero section'
  },
  
  // Banner Variants
  {
    dataQa: 'banner-component',
    componentName: 'BannerComponent',
    specFile: 'tests/specs/bannerSVariant.spec.ts',
    testTags: ['@Banner', '@Functional'],
    description: 'Banner component (all variants)'
  },
  
  // Teaser Components
  {
    dataQa: 'teaser-grid',
    componentName: 'TeaserGridComponent',
    specFile: 'tests/specs/teaserGrid.spec.ts',
    testTags: ['@TeaserGrid', '@Functional'],
    description: 'Teaser grid layout'
  },
  {
    dataQa: 'teaser-group',
    componentName: 'TeaserGroupComponent',
    specFile: 'tests/specs/teaserGroupComponent.spec.ts',
    testTags: ['@TeaserGroup', '@Functional'],
    description: 'Teaser group component'
  },
  {
    dataQa: 'individual-teaser',
    componentName: 'IndividualTeaserComponent',
    specFile: 'tests/specs/individualTeaserComponent.spec.ts',
    testTags: ['@IndividualTeaser', '@Functional'],
    description: 'Individual teaser card'
  },
  {
    dataQa: 'giant-teaser-component',
    componentName: 'GiantTeaserComponent',
    specFile: 'tests/specs/giantTeaser.spec.ts',
    testTags: ['@GiantTeaser', '@Functional'],
    description: 'Giant teaser component'
  },
  
  // Stage Components
  {
    dataQa: 'stage-component',
    componentName: 'StageComponent',
    specFile: 'tests/specs/stageComponent.spec.ts',
    testTags: ['@Stage', '@Functional'],
    description: 'Stage component'
  },
  {
    dataQa: 'stage-fullscreen',
    componentName: 'StageFullScreenComponent',
    specFile: 'tests/specs/stageFullScreen.spec.ts',
    testTags: ['@StageFullScreen', '@Functional'],
    description: 'Full screen stage'
  },
  {
    dataQa: 'stage-fullwidth',
    componentName: 'StageFullWidthComponent',
    specFile: 'tests/specs/stageFullWidth.spec.ts',
    testTags: ['@StageFullWidth', '@Functional'],
    description: 'Full width stage'
  },
  {
    dataQa: 'stage-jumbotron',
    componentName: 'StageJumbotronComponent',
    specFile: 'tests/specs/stageJumbotron.spec.ts',
    testTags: ['@StageJumbotron', '@Functional'],
    description: 'Jumbotron stage'
  },
  
  // Text & Image Components
  {
    dataQa: 'text-image-block',
    componentName: 'TextWithImageComponent',
    specFile: 'tests/specs/textWithImageDefault.spec.ts',
    testTags: ['@TextWithImage', '@Functional'],
    description: 'Text with image block'
  },
  
  // Media Components
  {
    dataQa: 'video-component',
    componentName: 'VideoComponent',
    specFile: 'tests/specs/videoComponent.spec.ts',
    testTags: ['@Video', '@Functional'],
    description: 'Video component'
  },
  {
    dataQa: 'media-gallery',
    componentName: 'MediaGalleryComponent',
    specFile: 'tests/specs/mediaGallery.spec.ts',
    testTags: ['@MediaGallery', '@Functional'],
    description: 'Media gallery'
  },
  
  // Quote & Carousel
  {
    dataQa: 'quote-component',
    componentName: 'QuoteComponent',
    specFile: 'tests/specs/quoteComponent.spec.ts',
    testTags: ['@Quote', '@Functional'],
    description: 'Quote component'
  },
  {
    dataQa: 'quote-carousel',
    componentName: 'QuoteCarouselComponent',
    specFile: 'tests/specs/quote-carousel.component.spec.ts',
    testTags: ['@QuoteCarousel', '@Functional'],
    description: 'Quote carousel'
  },
  
  // Info & Key Figures
  {
    dataQa: 'info-box',
    componentName: 'InfoBoxComponent',
    specFile: 'tests/specs/infoBoxComponent.spec.ts',
    testTags: ['@InfoBox', '@Functional'],
    description: 'Info box component'
  },
  {
    dataQa: 'individual-key-figure',
    componentName: 'IndividualKeyFigureComponent',
    specFile: 'tests/specs/individualKeyFigureComponent.spec.ts',
    testTags: ['@KeyFigure', '@Functional'],
    description: 'Individual key figure'
  },
  
  // Job Search Components
  {
    dataQa: 'job-search-banner',
    componentName: 'JobSearchBannerComponent',
    specFile: 'tests/specs/JobSearchBanner.spec.ts',
    testTags: ['@JobSearchBanner', '@Functional'],
    description: 'Job search banner'
  },
  {
    dataQa: 'job-search-sidebar',
    componentName: 'JobSearchSideBarComponent',
    specFile: 'tests/specs/jobSearchSideBar.spec.ts',
    testTags: ['@JobSearchSidebar', '@Functional'],
    description: 'Job search sidebar'
  },
  {
    dataQa: 'job-search-stage',
    componentName: 'JobSearchStageComponent',
    specFile: 'tests/specs/jobSearchStage.spec.ts',
    testTags: ['@JobSearchStage', '@Functional'],
    description: 'Job search stage'
  },
  
  // Link Components
  {
    dataQa: 'link-collection',
    componentName: 'LinkCollectionComponent',
    specFile: 'tests/specs/linkCollection.spec.ts',
    testTags: ['@LinkCollection', '@Functional'],
    description: 'Link collection'
  },
  {
    dataQa: 'download-links',
    componentName: 'DownloadLinksComponent',
    specFile: 'tests/specs/downloadLinksComponent.spec.ts',
    testTags: ['@DownloadLinks', '@Functional'],
    description: 'Download links'
  },
  {
    dataQa: 'dropdown-links',
    componentName: 'DropdownLinksComponent',
    specFile: 'tests/specs/dropdownLinksComponent.spec.ts',
    testTags: ['@DropdownLinks', '@Functional'],
    description: 'Dropdown links'
  },
  
  // Disclaimer & Divider
  {
    dataQa: 'page-disclaimer',
    componentName: 'PageDisclaimerComponent',
    specFile: 'tests/specs/page-disclaimer.spec.ts',
    testTags: ['@PageDisclaimer', '@Functional'],
    description: 'Page disclaimer'
  },
  {
    dataQa: 'link-disclaimer',
    componentName: 'LinkDisclaimerComponent',
    specFile: 'tests/specs/linkDisclaimerComponent.spec.ts',
    testTags: ['@LinkDisclaimer', '@Functional'],
    description: 'Link disclaimer'
  },
  {
    dataQa: 'fullwidth-content-divider',
    componentName: 'FullWidthContentDivider',
    specFile: 'tests/specs/FullWidthContentDivider.spec.ts',
    testTags: ['@Divider', '@Functional'],
    description: 'Full width content divider'
  },
  
  // Other Components
  {
    dataQa: 'accordion',
    componentName: 'AccordionComponent',
    specFile: 'tests/specs/accordionComponent.spec.ts',
    testTags: ['@Accordion', '@Functional'],
    description: 'Accordion component'
  },
  {
    dataQa: 'breadcrumb',
    componentName: 'BreadcrumbComponent',
    specFile: 'tests/specs/breadcrumbComponent.spec.ts',
    testTags: ['@Breadcrumb', '@Functional'],
    description: 'Breadcrumb navigation'
  },
  {
    dataQa: 'social-media',
    componentName: 'SocialMediaComponent',
    specFile: 'tests/specs/SocialMedia.spec.ts',
    testTags: ['@SocialMedia', '@Functional'],
    description: 'Social media links'
  },
  {
    dataQa: 'share-price',
    componentName: 'SharePriceComponent',
    specFile: 'tests/specs/sharePrice.spec.ts',
    testTags: ['@SharePrice', '@Functional'],
    description: 'Share price component'
  },
  {
    dataQa: 'profile-card',
    componentName: 'ProfileCardComponent',
    specFile: 'tests/specs/profileCard.spec.ts',
    testTags: ['@ProfileCard', '@Functional'],
    description: 'Profile card'
  },
  {
    dataQa: 'product-group',
    componentName: 'ProductGroupComponent',
    specFile: 'tests/specs/productGroup.spec.ts',
    testTags: ['@ProductGroup', '@Functional'],
    description: 'Product group'
  },
  {
    dataQa: 'news-list',
    componentName: 'NewsListComponent',
    specFile: 'tests/specs/newsListComponent.spec.ts',
    testTags: ['@NewsList', '@Functional'],
    description: 'News list component'
  },
];

/**
 * Get component definition by data-qa attribute
 */
export function getComponentByDataQa(dataQa: string): ComponentDefinition | undefined {
  return COMPONENT_REGISTRY.find(comp => comp.dataQa === dataQa);
}

/**
 * Check if a data-qa attribute is a registered component
 */
export function isRegisteredComponent(dataQa: string): boolean {
  return COMPONENT_REGISTRY.some(comp => comp.dataQa === dataQa);
}

/**
 * Get all registered component data-qa attributes
 */
export function getAllComponentDataQas(): string[] {
  return COMPONENT_REGISTRY.map(comp => comp.dataQa);
}
