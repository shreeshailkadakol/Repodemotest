// envUtils.ts

export class envUtils {
  static readonly baseUrls = {
    //dev: 'https://ef-comms-rjkjhx9x2-bayer-stakeholder-and-employee-journey.vercel.app/',
    qa: 'https://www.saucedemo.com/',
    //stg: 'https://bayer-beyond-staging-uk.vercel.app/',
    //prod: 'https://bayer-beyond-prod-au.vercel.app/en-au/',
    
    
  } as const;

  static getBaseUrl(): string {
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
   * Get Figma API token
   */
  static getFigmaToken(): string {
    const token = process.env.FIGMA_TOKEN;
    if (!token) {
      throw new Error('FIGMA_TOKEN environment variable is required');
    }
    return token;
  }

  /**
   * Get Figma file ID
   */
  static getFigmaFileId(): string {
    const fileId = process.env.FIGMA_FILE_ID;
    if (!fileId) {
      throw new Error('FIGMA_FILE_ID environment variable is required');
    }
    return fileId;
  }

  /**
   * Get Figma node ID for specific element
   */
  static getFigmaNodeId(envVarName: string): string {
    const nodeId = process.env[envVarName];
    if (!nodeId) {
      throw new Error(`${envVarName} environment variable is required`);
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
