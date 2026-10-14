import { richText } from './richText';
import { aboutPage, homePage, siteSettings } from './singletons';
import { clientLogo, enquiry, faq, industry, legalPage, post, project, service, testimonial } from './documents';

export const schemaTypes = [
  richText,
  siteSettings, homePage, aboutPage,
  service, industry, project, post, testimonial, faq, clientLogo, legalPage, enquiry,
];

/** Document types edited as a single fixed page (no "create new" / "delete"). */
export const SINGLETONS = ['siteSettings', 'homePage', 'aboutPage', 'legalPage'];
