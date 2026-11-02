// envUtils.ts

export class envUtils {
  // String constant to avoid duplication (SonarQube S1192)
  private static readonly ENV_VAR_REQUIRED_MSG = 'environment variable is required';

  static readonly baseUrls = {
    dev: 'https://ef-comms-rjkjhx9x2-bayer-stakeholder-and-employee-journey.vercel.app/',
    qa: 'https://bayer-beyond-qa-uk.vercel.app/en/',
    stg: 'https://bayer-beyond-staging-uk.vercel.app/',
    prod: 'https://www.bayer.co.uk/en-gb/',
    prod_vercel: 'https://bayer-beyond-prod-uk.vercel.app/',
    prod_in: 'https://www.bayer.in/',
    prod_kultur: 'https://bayer-beyond-prod-kultur.vercel.app/en/',
    prod_kultur_de: 'https://bayer-beyond-prod-kultur.vercel.app/de-de/',
    prod_au: 'https://www.bayer.com.au/',
    prod_japan: 'https://bayer-beyond-prod-japan.vercel.app/ja-jp/',
    prod_japan_pharma: 'https://bayer-beyond-prod-pharma-japan.vercel.app/ja-jp/',
    prod_pallas: 'https://www.pallas-versicherung.de/',
    'pre-prod': 'https://bayer-beyond-pre-prod-uk.vercel.app/en/',
  } as const;

  /**
   * Market locale/language segment per environment.
   *
   * Components that live on the localized homepage (e.g. NewsList, Search,
   * AnalyticsValidation) must use the market's locale in the URL. Instead of
   * hardcoding `/en-gb` in componentURL.ts, those entries use the `{locale}`
   * token which is resolved here per market. The URL builder also collapses a
   * duplicated locale segment when the base URL already includes it
   * (e.g. Kultur base `.../en/`).
   */
  static readonly localePaths = {
    dev: 'en-gb',
    qa: 'en',
    stg: 'en-gb',
    prod: 'en-gb',
    prod_vercel: 'en-gb',
    prod_in: 'en-in',
    prod_kultur: 'en',
    prod_kultur_de: 'de-de',
    prod_au: 'en-au',
    prod_japan: 'ja-jp',
    prod_japan_pharma: 'ja-jp',
    prod_pallas: 'de-de',

    'pre-prod': 'en',
  } as const;

  static getBaseUrl(): string {
    // Cross-site override: when SITE_BASE_URL is set (e.g. by a per-component
    // cross-site spec or a manual `SITE_BASE_URL=... playwright test` run), it
    // takes precedence over TEST_ENV so the existing component specs can be
    // pointed at any microsite unchanged.
    const override = process.env.SITE_BASE_URL?.trim();
    if (override) {
      return override.replace(/\/+$/, '');
    }

    const envFromCLI = process.env.TEST_ENV ?? 'qa';

    if (!(envFromCLI in envUtils.baseUrls)) {
      throw new Error(
        `Invalid TEST_ENV value: '${envFromCLI}'. Must be one of: ${Object.keys(envUtils.baseUrls).join(', ')}`
      );
    }

    const env = envFromCLI as keyof typeof envUtils.baseUrls;
    return envUtils.baseUrls[env];
  }

  /**
   * Extracts the locale/language segment from a base URL, if present.
   *
   * Looks at the first path segment and returns it when it matches a locale
   * shape (e.g. `en`, `en-gb`, `de-de`, `pt-br`, `ja-jp`). This makes locale
   * handling holistic: any market whose base URL already carries the locale
   * (e.g. `.../de-de/`) is resolved automatically without a hardcoded mapping.
   * Returns null when the URL has no locale segment (e.g. `https://www.bayer.in/`).
   */
  static getLocaleFromUrl(url: string): string | null {
    try {
      const { pathname } = new URL(url);
      const firstSegment = pathname.split('/').find(Boolean);
      if (firstSegment && /^[a-z]{2}(-[a-z0-9]{2,})?$/i.test(firstSegment)) {
        return firstSegment.toLowerCase();
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Returns the market locale/language segment for the current TEST_ENV.
   *
   * Resolution order (holistic, URL-first):
   *   1. Locale parsed from the env's base URL (e.g. `.../de-de/` → 'de-de').
   *   2. Explicit `localePaths` mapping (covers markets whose base URL has no
   *      locale segment, e.g. India `https://www.bayer.in/` → 'en-in').
   *   3. 'en-gb' as a final fallback.
   *
   * This means onboarding a new market usually only requires adding its base
   * URL to `baseUrls` — the locale is captured straight from that URL.
   */
  static getLocalePath(): string {
    // Cross-site override: derive the locale from SITE_BASE_URL when set, so
    // locale-aware locators (e.g. internal-link matching) target the microsite's
    // own locale instead of the TEST_ENV default.
    const override = process.env.SITE_BASE_URL?.trim();
    if (override) {
      const fromOverride = envUtils.getLocaleFromUrl(override);
      if (fromOverride) return fromOverride;
    }

    const env = process.env.TEST_ENV ?? 'qa';
    const baseUrl = (envUtils.baseUrls as Record<string, string>)[env];
    const fromUrl = baseUrl ? envUtils.getLocaleFromUrl(baseUrl) : null;
    return fromUrl ?? (envUtils.localePaths as Record<string, string>)[env] ?? 'en-gb';
  }

  /**
   * Get Figma API token
   */
  static getFigmaToken(): string {
    const token = process.env.FIGMA_TOKEN;
    if (!token) {
      throw new Error(`FIGMA_TOKEN ${envUtils.ENV_VAR_REQUIRED_MSG}`);
    }
    return token;
  }

  /**
   * Get Figma file ID
   */
  static getFigmaFileId(): string {
    const fileId = process.env.FIGMA_FILE_ID;
    if (!fileId) {
      throw new Error(`FIGMA_FILE_ID ${envUtils.ENV_VAR_REQUIRED_MSG}`);
    }
    return fileId;
  }

  /**
   * Get Figma node ID for specific element
   *
   */
  static getFigmaNodeId(envVarName: string): string {
    const nodeId = process.env[envVarName];
    if (!nodeId) {
      throw new Error(`${envVarName} ${envUtils.ENV_VAR_REQUIRED_MSG}`);
    }
    return nodeId;
  }

  /**
   * Get test environment
   */
  static getTestEnv(): string {
    return process.env.TEST_ENV || 'qa';
  }
}
