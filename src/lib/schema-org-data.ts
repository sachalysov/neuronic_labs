/**
 * Данные для Schema.org разметки
 */

import { OrganizationSchema, ServiceSchema, setupSchemaOrg } from './schema-org';

export const organizationData: OrganizationSchema = {
  name: 'Neuronic Labs',
  legalName: 'Neuronic Labs Агентство по внедрению автоматизации в бизнес',
  alternateName: 'NEURONIC LABS',
  description: 'Агентство по внедрению автоматизации бизнеса с помощью ИИ. Внедряем ИИ-продавца для Telegram, WhatsApp, Avito за 7-14 дней.',
  url: 'https://neuroniclabs.ru',
  logo: 'https://neuroniclabs.ru/favicon-32x32.png',
  foundingDate: '2020',
  taxID: '130102424667',
  contactPoint: {
    telephone: '+7-993-079-91-77',
    contactType: 'Customer Service',
    email: 'neuroniclabs@yandex.ru',
    availableLanguage: ['Russian'],
    areaServed: 'RU',
    hoursAvailable: {
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  },
  sameAs: [
    'https://t.me/NeuronicLabs',
  ],
  areaServed: {
    type: 'Country',
    name: 'Россия',
  },
  address: {
    addressCountry: 'RU',
    addressRegion: 'Россия',
  },
  offers: {
    priceCurrency: 'RUB',
    lowPrice: '15000',
    highPrice: '50000',
    offerCount: '3',
  },
  aggregateRating: {
    ratingValue: '4.9',
    reviewCount: '90',
    bestRating: '5',
    worstRating: '1',
  },
};

export const serviceData: ServiceSchema = {
  serviceType: 'Автоматизация бизнеса с помощью ИИ, создание ИИ-агентов и чат-ботов, интеллектуальная автоматизация процессов',
  name: 'Создание ИИ-агентов и чат-ботов для автоматизации бизнеса',
  description: 'Услуги по созданию ИИ-агентов, чат-ботов, интеллектуальной автоматизации бизнес-процессов, интеграции ИИ в работу, автоматизации рутинных задач, счетов и отчётов',
  provider: {
    name: 'Neuronic Labs',
    taxID: '130102424667',
  },
  areaServed: [
    { type: 'City', name: 'Санкт-Петербург' },
    { type: 'City', name: 'Санкт-Петербург' },
    { type: 'City', name: 'Краснодар' },
    { type: 'City', name: 'Екатеринбург' },
    { type: 'City', name: 'Новосибирск' },
    { type: 'City', name: 'Ростов-на-Дону' },
    { type: 'City', name: 'Казань' },
    { type: 'City', name: 'Нижний Новгород' },
    { type: 'City', name: 'Самара' },
    { type: 'Country', name: 'Россия' },
  ],
  hasOfferCatalog: {
    name: 'Услуги автоматизации бизнеса',
    itemListElement: [
      {
        itemOffered: {
          name: 'Создание ИИ-агента для бизнеса',
          description: 'Разработка и внедрение ИИ-агента для автоматизации бизнес-процессов, обработки лидов 24/7 в Telegram, WhatsApp, Avito и других каналах',
        },
        price: '15000',
        priceCurrency: 'RUB',
      },
      {
        itemOffered: {
          name: 'Создание чат-бота с ИИ',
          description: 'Разработка интеллектуального чат-бота для автоматизации продаж и поддержки клиентов',
        },
        price: '20000',
        priceCurrency: 'RUB',
      },
      {
        itemOffered: {
          name: 'Интеллектуальная автоматизация бизнес-процессов',
          description: 'Полная автоматизация бизнес-процессов с помощью ИИ: автоматизация рутинных задач, счетов, отчётов, генерация контента',
        },
        price: '30000',
        priceCurrency: 'RUB',
      },
      {
        itemOffered: {
          name: 'Интеграция ИИ в работу',
          description: 'Интеграция ИИ-решений с существующими системами: CRM, учетные системы, мессенджеры',
        },
        price: '25000',
        priceCurrency: 'RUB',
      },
      {
        itemOffered: {
          name: 'Автоматизация продаж с ИИ',
          description: 'Внедрение ИИ-продавца для автоматизации продаж в Telegram, WhatsApp, Avito и других каналах',
        },
        price: '35000',
        priceCurrency: 'RUB',
      },
      {
        itemOffered: {
          name: 'Автоматизация счетов и отчётов',
          description: 'Автоматизация документооборота: создание счетов, формирование отчётов с помощью ИИ',
        },
        price: '20000',
        priceCurrency: 'RUB',
      },
    ],
  },
};

/**
 * Инициализирует Schema.org разметку
 */
export function initSchemaOrg() {
  setupSchemaOrg(organizationData, serviceData);
}

