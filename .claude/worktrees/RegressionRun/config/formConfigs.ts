/**
 * Component Mapper - Form Configuration
 * What:
 *   Defines typed environment and field configurations for region-specific
 *   contact form submission tests.
 * Why:
 *   Created to run form validation in a data-driven way across markets without
 *   hardcoding field selectors and values in each test file.
 */

/**
 * Environment Configuration
 */
export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  formPaths: {
    [region: string]: string;
  };
}

/**
 * Available Environments
 */
export const FORM_ENVIRONMENTS: Record<string, EnvironmentConfig> = {
  staging: {
    name: 'Staging',
    baseUrl: 'https://bayer-beyond-staging-uk.vercel.app',
    formPaths: {
      AU: '/contactus',
      NZ: '/contactus',
      TR: '/contactusturkey'
    }
  },
  production: {
    name: 'Production',
    baseUrl: 'https://bayer-beyond-prod',
    formPaths: {
      AU: '-au.vercel.app/en-au/contact-au',
      NZ: '-nz.vercel.app/en-nz/contact',
      TR: '-tr.vercel.app/tr-tr/bize-ulasin'
    }
  },
  qa: {
    name: 'QA',
    baseUrl: 'https://bayer-beyond-qa-uk.vercel.app',
    formPaths: {
      AU: '/contactus',
      NZ: '/contactus',
      TR: '/contactusturkey'
    }
  }
};

/**
 * Get current environment configuration
 */
export function getCurrentEnvironment(): EnvironmentConfig {
  const envName = process.env.FORM_ENV || process.env.TEST_ENV || 'staging';
  const env = FORM_ENVIRONMENTS[envName.toLowerCase()];
  
  if (!env) {
    console.warn(`Unknown environment: ${envName}. Using staging.`);
    return FORM_ENVIRONMENTS.staging;
  }
  
  return env;
}

/**
 * Build form URL based on region and environment
 */
export function buildFormUrl(region: string): string {
  const env = getCurrentEnvironment();
  const path = env.formPaths[region.toUpperCase()];
  
  if (!path) {
    throw new Error(`No form path defined for region: ${region} in ${env.name} environment`);
  }
  
  // Handle production URLs that have region-specific subdomains
  if (env.name === 'Production') {
    return `${env.baseUrl}${path}`;
  }
  
  return `${env.baseUrl}${path}`;
}

export interface FormFieldConfig {
  selector?: string;
  role?: string;
  label?: string | RegExp;
  testId?: string;
  placeholder?: string;
  value: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'radio' | 'checkbox' | 'textarea';
  required?: boolean;
}

export interface FormConfig {
  region: string;
  url: string;
  formName: string;
  fields: {
    [key: string]: FormFieldConfig;
  };
  submitButton: {
    selector?: string;
    role?: string;
    text?: string | RegExp;
    testId?: string;
  };
  successValidation: {
    type: 'message' | 'url' | 'element';
    selector?: string;
    text?: string | RegExp;
    urlPattern?: string;
    timeout?: number;
  };
  optionalFields?: string[];
  preSubmitWait?: number;
  postSubmitWait?: number;
}

/**
 * Australia Contact Form Configuration
 * Based on production form structure inspection (bayer-beyond-prod-au.vercel.app)
 */
export const AU_CONTACT_FORM: FormConfig = {
  region: 'AU',
  url: buildFormUrl('AU'),
  formName: 'Australia Contact Form',
  fields: {
    title: {
      selector: '[role="radiogroup"] input[type="radio"][value="Mr"]',
      role: 'radio',
      label: /Mr/i,
      value: 'Mr',
      type: 'radio',
      required: true
    },
    FirstName: {
      selector: 'input[name="FirstName"]',
      role: 'textbox',
      label: 'First Name',
      value: 'John',
      type: 'text',
      required: true
    },
    LastName: {
      selector: 'input[name="LastName"]',
      role: 'textbox',
      label: 'Surname',
      value: 'Doe',
      type: 'text',
      required: true
    },
    Phone: {
      selector: 'input[name="Phone"]',
      role: 'textbox',
      label: 'Phone',
      value: '+61400123456',
      type: 'tel',
      required: false
    },
    Email: {
      selector: 'input[name="Email"]',
      role: 'textbox',
      label: 'Email',
      value: 'john.doe@test.com',
      type: 'email',
      required: true
    },
    Country: {
      selector: 'input[name="Country"][role="combobox"]',
      role: 'combobox',
      label: 'Country',
      value: 'Australia',
      type: 'text',
      required: false
    },
    Topic: {
      selector: 'input[name="Topic"]',
      role: 'combobox',
      label: 'Topic',
      value: 'Other',
      type: 'text',
      required: true
    },
    Comments: {
      selector: 'textarea[name="Comments"]',
      role: 'textbox',
      label: 'Message',
      value: 'This is a test message for automated form validation.',
      type: 'textarea',
      required: true
    },
    TnC: {
      selector: 'input[type="checkbox"][name="TnC"]',
      role: 'checkbox',
      label: 'I have read the above Collection Notice',
      value: 'true',
      type: 'checkbox',
      required: true
    }
  },
  submitButton: {
    selector: 'button[aria-label="Submits the form"]',
    role: 'button',
    text: /send/i
  },
  successValidation: {
    type: 'message',
    selector: '[data-qa="success-message"], .success-message, .thank-you',
    text: /thank you|success|received/i,
    timeout: 10000
  },
  optionalFields: ['Phone', 'Country'],
  preSubmitWait: 1000,
  postSubmitWait: 3000
};

/**
 * New Zealand Contact Form Configuration
 */
export const NZ_CONTACT_FORM: FormConfig = {
  region: 'NZ',
  url: buildFormUrl('NZ'),
  formName: 'New Zealand Contact Form',
  fields: {
    title: {
      selector: '[role="radiogroup"] input[type="radio"][value="Mr"]',
      role: 'radio',
      label: /Mr/i,
      value: 'Mr',
      type: 'radio',
      required: true
    },
    FirstName: {
      selector: 'input[name="FirstName"]',
      role: 'textbox',
      label: 'First Name',
      value: 'Jane',
      type: 'text',
      required: true
    },
    LastName: {
      selector: 'input[name="LastName"]',
      role: 'textbox',
      label: 'Surname',
      value: 'Smith',
      type: 'text',
      required: true
    },
    Phone: {
      selector: 'input[name="Phone"]',
      role: 'textbox',
      label: 'Phone',
      value: '+6421234567',
      type: 'tel',
      required: false
    },
    Email: {
      selector: 'input[name="Email"]',
      role: 'textbox',
      label: 'Email',
      value: 'jane.smith@test.com',
      type: 'email',
      required: true
    },
    Country: {
      selector: 'input[name="Country"][role="combobox"]',
      role: 'combobox',
      label: 'Country',
      value: 'New Zealand',
      type: 'text',
      required: false
    },
    Topic: {
      selector: 'input[name="Topic"]',
      role: 'combobox',
      label: 'Topic',
      value: 'Other',
      type: 'text',
      required: true
    },
    Comments: {
      selector: 'textarea[name="Comments"]',
      role: 'textbox',
      label: 'Message',
      value: 'Automated test message for NZ contact form validation.',
      type: 'textarea',
      required: true
    },
    TnC: {
      selector: 'input[type="checkbox"][name="TnC"]',
      role: 'checkbox',
      label: 'I have read the above Collection Notice',
      value: 'true',
      type: 'checkbox',
      required: true
    }
  },
  submitButton: {
    selector: 'button[aria-label="Submits the form"]',
    role: 'button',
    text: /send/i
  },
  successValidation: {
    type: 'message',
    selector: '[data-qa="success-message"], .success-message, .thank-you',
    text: /thank you|success|received/i,
    timeout: 10000
  },
  optionalFields: ['Phone', 'Country'],
  preSubmitWait: 1000,
  postSubmitWait: 3000
};

/**
 * Turkey Contact Form Configuration
 * Based on production form structure inspection (bayer-beyond-prod-tr.vercel.app)
 */
export const TR_CONTACT_FORM: FormConfig = {
  region: 'TR',
  url: buildFormUrl('TR'),
  formName: 'Turkey Contact Form (Bize Ulaşın)',
  fields: {
    healthcareProfessional: {
      selector: '[role="radiogroup"] input[type="radio"][value="Hayır"]',
      role: 'radio',
      label: /Hayır/i,
      value: 'Hayır',
      type: 'radio',
      required: true
    },
    Topic: {
      selector: 'input[name="Topic"]',
      role: 'combobox',
      label: 'Konu',
      value: 'Diğer',
      type: 'text',
      required: true
    },
    FirstName: {
      selector: 'input[name="FirstName"]',
      role: 'textbox',
      label: 'Ad Soyad',
      value: 'Ahmet Yılmaz',
      type: 'text',
      required: true
    },
    Phone: {
      selector: 'input[name="Phone"]',
      role: 'textbox',
      label: 'Cep Telefonu',
      value: '+905551234567',
      type: 'tel',
      required: true
    },
    Email: {
      selector: 'input[name="Email"]',
      role: 'textbox',
      label: 'E-posta',
      value: 'ahmet.yilmaz@test.com',
      type: 'email',
      required: true
    },
    Comments: {
      selector: 'textarea[name="Comments"]',
      role: 'textbox',
      label: 'Açıklama',
      value: 'Bu otomatik test mesajıdır.',
      type: 'textarea',
      required: true
    }
  },
  submitButton: {
    selector: 'button[aria-label="Submits the form"]',
    role: 'button',
    text: /gönder/i
  },
  successValidation: {
    type: 'message',
    selector: '[data-qa="success-message"], .success-message, .teşekkür',
    text: /teşekkür|başarı|gönderildi|success/i,
    timeout: 10000
  },
  optionalFields: [],
  preSubmitWait: 1000,
  postSubmitWait: 3000
};

/**
 * Array of all form configurations for bulk testing
 */
export const ALL_FORM_CONFIGS = [
  AU_CONTACT_FORM,
  NZ_CONTACT_FORM,
  TR_CONTACT_FORM
];

/**
 * Get form config by region
 */
export function getFormConfigByRegion(region: string): FormConfig | undefined {
  const env = getCurrentEnvironment();
  const upperRegion = region.toUpperCase();
  
  // In staging/QA, NZ and AU share the same form URL, so use AU config for NZ
  if ((env.name === 'Staging' || env.name === 'QA') && upperRegion === 'NZ') {
    // Clone AU config but keep NZ region identifier
    const auConfig = ALL_FORM_CONFIGS.find(config => config.region === 'AU');
    if (auConfig) {
      return {
        ...auConfig,
        region: 'NZ',
        url: buildFormUrl('NZ'),
        formName: 'New Zealand Contact Form (using AU form in staging)'
      };
    }
  }
  
  return ALL_FORM_CONFIGS.find(config => config.region.toUpperCase() === upperRegion);
}

/**
 * Get form configs filtered by environment variable
 */
export function getFormConfigsForExecution(): FormConfig[] {
  const targetRegion = process.env.FORM_REGION?.toUpperCase();
  
  if (targetRegion) {
    const config = getFormConfigByRegion(targetRegion);
    return config ? [config] : [];
  }
  
  return ALL_FORM_CONFIGS;
}
