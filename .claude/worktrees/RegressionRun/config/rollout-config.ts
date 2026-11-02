/**
 * Rollout Configuration
 * Multi-site and multi-language configuration for Sitecore migration rollout validation
 */

export interface RolloutSite {
  name: string;
  baseUrl: string;
  /**
   * The TEST_ENV value that maps to this site (e.g. 'prod_kultur').
   * When TEST_ENV matches a site's `env`, only that site is validated.
   */
  env?: string;
  languages: LanguageConfig[];
  enabledValidations?: {
    navigation?: boolean;
    logo?: boolean;
    gtm?: boolean;
    indexing?: boolean;
    seo?: boolean;
    consent?: boolean;
  };
}

export interface LanguageConfig {
  code: string; // e.g., 'es-es', 'en-gb'
  name: string; // e.g., 'Spanish (Spain)', 'English (UK)'
  path: string; // e.g., '/es-es', '/en-gb'
}

export interface GTMConfig {
  containerId: string; // e.g., 'GTM-XXXXXXX'
  scriptUrl?: string;
  dataLayerName?: string;
}

export interface SEOConfig {
  requireTitle: boolean;
  requireDescription: boolean;
  requireCanonical: boolean;
  requireHreflang: boolean;
  requireOgTags: boolean;
  minTitleLength?: number;
  maxTitleLength?: number;
  minDescriptionLength?: number;
  maxDescriptionLength?: number;
}

export interface IndexingConfig {
  checkRobotsTxt: boolean;
  checkSitemap: boolean;
  checkMetaRobots: boolean;
  checkCanonical: boolean;
  allowedIndexDirectives: string[]; // e.g., ['index', 'noindex', 'follow', 'nofollow']
}

export interface ConsentConfig {
  scriptUrl?: string;
  bannerSelector: string;
  acceptButtonSelector: string;
  rejectButtonSelector?: string;
  manageButtonSelector?: string;
  cookieName?: string;
}

/**
 * Main Rollout Configuration
 */
export const rolloutConfig = {
  // Sites to validate
  sites: [
    {
      name: 'Conosur',
      baseUrl: 'https://bayer-beyond-prod-conosur.vercel.app',
      languages: [
        { code: 'es-es', name: 'Spanish (Spain)', path: '/es-es' },
      ],
      enabledValidations: {
        navigation: true,
        logo: true,
        gtm: true,
        indexing: true,
        seo: true,
        consent: true,
      },
    },
    {
      name: 'Taiwan',
      baseUrl: 'https://www.bayer.com.tw',
      languages: [
        { code: 'zh-tw', name: 'Chinese (Traditional)', path: '/zh-tw' },
      ],
      enabledValidations: {
        navigation: true,
        logo: true,
        gtm: true,
        indexing: true,
        seo: true,
        consent: true,
      },
    },
    {
      name: 'Brasil',
      baseUrl: 'https://bayer-beyond-prod-brasil.vercel.app',
      languages: [
        { code: 'pt-pt', name: 'Portuguese (Portugal)', path: '/pt-pt' },
      ],
      enabledValidations: {
        navigation: true,
        logo: true,
        gtm: true,
        indexing: true,
        seo: true,
        consent: true,
      },
    },
    {
      name: 'Japan',
      baseUrl: 'https://bayer-beyond-prod-japan.vercel.app',
      env: 'prod_japan',
      languages: [
        { code: 'ja-jp', name: 'Japanese', path: '/ja-jp' },
      ],
      enabledValidations: {
        navigation: true,
        logo: true,
        gtm: true,
        indexing: true,
        seo: true,
        consent: true,
      },
    },
    {
      name: 'Japan Pharma',
      baseUrl: 'https://bayer-beyond-prod-pharma-japan.vercel.app',
      env: 'prod_japan_pharma',
      languages: [
        { code: 'ja-jp', name: 'Japanese', path: '/ja-jp' },
      ],
      enabledValidations: {
        navigation: true,
        logo: true,
        gtm: true,
        indexing: true,
        seo: true,
        consent: true,
      },
    },
    {
      name: 'Kultur',
      baseUrl: 'https://bayer-beyond-prod-kultur.vercel.app',
      env: 'prod_kultur',
      languages: [
        { code: 'en', name: 'English', path: '/en' },
      ],
      enabledValidations: {
        navigation: true,
        logo: true,
        gtm: true,
        indexing: true,
        seo: true,
        consent: true,
      },
    },
    {
      name: 'Kultur (German)',
      baseUrl: 'https://bayer-beyond-prod-kultur.vercel.app',
      env: 'prod_kultur_de',
      languages: [
        { code: 'de-de', name: 'German', path: '/de-de' },
      ],
      enabledValidations: {
        navigation: true,
        logo: true,
        gtm: true,
        indexing: true,
        seo: true,
        consent: true,
      },
    },
    {
      name: 'Pallas',
      baseUrl: 'https://www.pallas-versicherung.de',
      env: 'prod_pallas',
      languages: [
        { code: 'de-de', name: 'German', path: '' },
      ],
      enabledValidations: {
        navigation: true,
        logo: true,
        gtm: true,
        indexing: true,
        seo: true,
        consent: true,
      },
    },
    // Add more sites as needed
    // {
    //   name: 'UK',
    //   baseUrl: 'https://www.bayer.co.uk',
    //   languages: [
    //     { code: 'en-gb', name: 'English (UK)', path: '/en-gb' },
    //   ],
    // },
  ] as RolloutSite[],

  // GTM Configuration
  gtm: {
    containerId: 'GTM-55QQGLTK', // Taiwan GTM container ID
    scriptUrl: 'https://www.googletagmanager.com/gtm.js',
    dataLayerName: 'dataLayer',
  } as GTMConfig,

  // SEO Configuration (Based on ADO ticket 297)
  seo: {
    requireTitle: true,
    requireDescription: true,
    requireCanonical: true,
    requireHreflang: true,
    requireOgTags: true,
    minTitleLength: 30,
    maxTitleLength: 60,
    minDescriptionLength: 120,
    maxDescriptionLength: 160,
  } as SEOConfig,

  // Indexing Configuration (Based on ADO ticket 2583)
  indexing: {
    checkRobotsTxt: true,
    checkSitemap: true,
    checkMetaRobots: true,
    checkCanonical: true,
    allowedIndexDirectives: ['index', 'noindex', 'follow', 'nofollow'],
  } as IndexingConfig,

  // Consent Configuration (Based on ADO ticket 256)
  // Using OneTrust consent management platform
  // Using language-independent selectors (OneTrust standard IDs only)
  consent: {
    scriptUrl: 'cdn.cookielaw.org', // OneTrust CDN
    bannerSelector: '#onetrust-banner-sdk',
    // Using OneTrust's standard button IDs - works across all languages
    acceptButtonSelector: '#onetrust-accept-btn-handler',
    rejectButtonSelector: '#onetrust-reject-all-handler',
    manageButtonSelector: '#onetrust-pc-btn-handler',
    cookieName: 'OptanonConsent', // OneTrust cookie name
  } as ConsentConfig,

  // Navigation selectors
  navigation: {
    pillNavSelector: '[data-qa="pill-navigation"], [role="navigation"][aria-label*="pill"]',
    menuNavSelector: '[data-qa="main-navigation"], nav[role="navigation"]',
    footerSelector: 'footer, [data-qa="footer"]',
    linkSelector: 'a[href]',
  },

  // Logo selectors
  logo: {
    selector: '[data-qa="logo"], .logo, img[alt*="Bayer"], banner img[alt*="Bayer"]',
    expectedColor: '#ffffff', // White color
    allowedVariations: ['#fff', 'rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)'],
  },

  // Validation timeouts
  timeouts: {
    navigation: 30000,
    pageLoad: 60000,
    linkCheck: 10000,
  },

  // Link validation
  linkValidation: {
    ignorePatterns: [
      /^mailto:/,
      /^tel:/,
      /^javascript:/,
      /#$/,
    ],
    externalDomains: [
      'facebook.com',
      'twitter.com',
      'linkedin.com',
      'instagram.com',
      'youtube.com',
      'bayer.com', // RSS feed and external Bayer sites
    ],
    maxConcurrentChecks: 5,
  },

  // Report configuration
  reporting: {
    outputDir: './rollout-reports',
    generateHtml: true,
    screenshotOnFailure: true,
    traceOnFailure: true,
  },
};

/**
 * Helper function to get all site-language combinations
 */
export function getAllSiteLanguageCombinations(): Array<{
  site: RolloutSite;
  language: LanguageConfig;
  url: string;
}> {
  const combinations: Array<{
    site: RolloutSite;
    language: LanguageConfig;
    url: string;
  }> = [];

  // When TEST_ENV maps to a specific site, run only that site.
  // This keeps rollout validation scoped to the site passed on the command line
  // (e.g. `cross-env TEST_ENV=prod_kultur`).
  const testEnv = process.env.TEST_ENV;
  const hasMatchingSite = rolloutConfig.sites.some((site) => site.env === testEnv);
  const sitesToRun = hasMatchingSite
    ? rolloutConfig.sites.filter((site) => site.env === testEnv)
    : rolloutConfig.sites;

  sitesToRun.forEach((site) => {
    site.languages.forEach((language) => {
      combinations.push({
        site,
        language,
        url: `${site.baseUrl}${language.path}`,
      });
    });
  });

  return combinations;
}

/**
 * Helper function to check if validation is enabled for a site
 */
export function isValidationEnabled(
  site: RolloutSite,
  validationType: keyof NonNullable<RolloutSite['enabledValidations']>
): boolean {
  return site.enabledValidations?.[validationType] ?? true;
}
