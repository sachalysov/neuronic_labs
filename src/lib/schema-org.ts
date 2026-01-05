/**
 * Модуль для управления Schema.org разметкой
 */

export interface OrganizationSchema {
  name: string;
  legalName?: string;
  alternateName?: string;
  description: string;
  url: string;
  logo?: string;
  foundingDate?: string;
  taxID?: string;
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
    availableLanguage?: string[];
    areaServed?: string;
    hoursAvailable?: {
      dayOfWeek?: string[];
      opens?: string;
      closes?: string;
    };
  };
  sameAs?: string[];
  areaServed?: {
    type: string;
    name: string;
  };
  address?: {
    addressCountry?: string;
    addressRegion?: string;
  };
  offers?: {
    priceCurrency?: string;
    lowPrice?: string;
    highPrice?: string;
    offerCount?: string;
  };
  aggregateRating?: {
    ratingValue?: string;
    reviewCount?: string;
    bestRating?: string;
    worstRating?: string;
  };
}

export interface ServiceSchema {
  serviceType?: string;
  name: string;
  description: string;
  provider?: {
    name: string;
    taxID?: string;
  };
  areaServed?: Array<{
    type: string;
    name: string;
  }>;
  hasOfferCatalog?: {
    name: string;
    itemListElement?: Array<{
      itemOffered: {
        name: string;
        description: string;
      };
      price: string;
      priceCurrency: string;
    }>;
  };
}

/**
 * Генерирует Schema.org разметку для организации
 */
export function generateOrganizationSchema(data: OrganizationSchema): object {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    description: data.description,
    url: data.url,
  };

  if (data.legalName) schema.legalName = data.legalName;
  if (data.alternateName) schema.alternateName = data.alternateName;
  if (data.logo) schema.logo = data.logo;
  if (data.foundingDate) schema.foundingDate = data.foundingDate;
  if (data.taxID) schema.taxID = data.taxID;

  if (data.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      ...data.contactPoint,
    };
    if (data.contactPoint.hoursAvailable) {
      schema.contactPoint.hoursAvailable = {
        '@type': 'OpeningHoursSpecification',
        ...data.contactPoint.hoursAvailable,
      };
    }
  }

  if (data.sameAs) schema.sameAs = data.sameAs;

  if (data.areaServed) {
    schema.areaServed = {
      '@type': data.areaServed.type,
      name: data.areaServed.name,
    };
  }

  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      ...data.address,
    };
  }

  if (data.offers) {
    schema.offers = {
      '@type': 'AggregateOffer',
      ...data.offers,
    };
  }

  if (data.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ...data.aggregateRating,
    };
  }

  return schema;
}

/**
 * Генерирует Schema.org разметку для услуги
 */
export function generateServiceSchema(data: ServiceSchema): object {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    description: data.description,
  };

  if (data.serviceType) schema.serviceType = data.serviceType;

  if (data.provider) {
    schema.provider = {
      '@type': 'Organization',
      name: data.provider.name,
    };
    if (data.provider.taxID) {
      schema.provider.taxID = data.provider.taxID;
    }
  }

  if (data.areaServed) {
    schema.areaServed = data.areaServed.map(area => ({
      '@type': area.type,
      name: area.name,
    }));
  }

  if (data.hasOfferCatalog) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: data.hasOfferCatalog.name,
    };
    if (data.hasOfferCatalog.itemListElement) {
      schema.hasOfferCatalog.itemListElement = data.hasOfferCatalog.itemListElement.map(item => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.itemOffered.name,
          description: item.itemOffered.description,
        },
        price: item.price,
        priceCurrency: item.priceCurrency,
      }));
    }
  }

  return schema;
}

/**
 * Добавляет Schema.org разметку в head документа
 */
export function addSchemaToHead(schema: object, id?: string): void {
  const scriptId = id || `schema-org-${Date.now()}`;
  
  // Удаляем существующий скрипт с таким же id, если есть
  const existingScript = document.getElementById(scriptId);
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = scriptId;
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

/**
 * Полная настройка Schema.org разметки для сайта
 */
export function setupSchemaOrg(
  organizationData: OrganizationSchema,
  serviceData?: ServiceSchema
): void {
  const orgSchema = generateOrganizationSchema(organizationData);
  addSchemaToHead(orgSchema, 'schema-org-organization');

  if (serviceData) {
    const serviceSchema = generateServiceSchema(serviceData);
    addSchemaToHead(serviceSchema, 'schema-org-service');
  }
}

