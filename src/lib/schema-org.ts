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
 * Генерирует Schema.org разметку для статьи блога (BlogPosting)
 */
export function generateBlogPostSchema(data: {
  title: string
  description?: string
  content?: string
  imageUrl?: string
  author?: string
  publishedAt: string
  updatedAt?: string
  url: string
  tags?: string[]
}): object {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description || data.content?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
    url: data.url,
    datePublished: data.publishedAt,
    dateModified: data.updatedAt || data.publishedAt,
    inLanguage: 'ru-RU',
    publisher: {
      '@type': 'Organization',
      name: 'NEURONIC LABS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://neuroniclabs.ru/favicon-32x32.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url
    }
  }

  if (data.imageUrl) {
    schema.image = {
      '@type': 'ImageObject',
      url: data.imageUrl,
      width: 1200,
      height: 630
    }
  }

  if (data.author) {
    schema.author = {
      '@type': 'Person',
      name: data.author
    }
  }

  if (data.content) {
    schema.articleBody = data.content.replace(/<[^>]*>/g, '')
  }

  if (data.tags && data.tags.length > 0) {
    schema.keywords = data.tags.join(', ')
  }

  return schema
}

/**
 * Генерирует Schema.org разметку для бизнес-кейса (CaseStudy)
 */
export function generateBusinessCaseSchema(data: {
  title: string
  description: string
  challenge?: string
  solution?: string
  image?: string
  industry?: string
  results?: Array<{
    label: string
    value: string
  }>
  publishedAt?: string
  url: string
}): object {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'CaseStudy',
    name: data.title,
    description: data.description,
    url: data.url,
    inLanguage: 'ru-RU',
    about: {
      '@type': 'Thing',
      name: 'Автоматизация бизнеса с помощью ИИ'
    },
    publisher: {
      '@type': 'Organization',
      name: 'NEURONIC LABS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://neuroniclabs.ru/favicon-32x32.png'
      }
    }
  }

  if (data.image) {
    schema.image = {
      '@type': 'ImageObject',
      url: data.image,
      width: 1200,
      height: 630
    }
  }

  if (data.industry) {
    schema.industry = data.industry
  }

  if (data.publishedAt) {
    schema.datePublished = data.publishedAt
  }

  if (data.challenge) {
    schema.problem = data.challenge
  }

  if (data.solution) {
    schema.solution = data.solution
  }

  if (data.results && data.results.length > 0) {
    schema.result = data.results.map(r => `${r.label}: ${r.value}`).join(', ')
  }

  return schema
}

/**
 * Генерирует Schema.org разметку для списка статей блога (CollectionPage)
 */
export function generateBlogListSchema(url: string, posts: Array<{ title: string; url: string; publishedAt: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Блог NEURONIC LABS',
    description: 'Полезные статьи об автоматизации бизнеса, ИИ-технологиях и эффективных решениях',
    url: url,
    inLanguage: 'ru-RU',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          url: post.url,
          datePublished: post.publishedAt
        }
      }))
    }
  }
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

