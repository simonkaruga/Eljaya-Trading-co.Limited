import { defineArrayMember, defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons/Cog';
import { HomeIcon } from '@sanity/icons/Home';
import { UsersIcon } from '@sanity/icons/Users';
import { imageField } from './fields';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Business details',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'contact', title: 'Contact', default: true },
    { name: 'news', title: 'Announcement bar' },
    { name: 'numbers', title: 'Numbers & reviews' },
    { name: 'social', title: 'Social media' },
    { name: 'seo', title: 'Google / SEO' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Business name', type: 'string', group: 'contact', validation: (r) => r.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'contact' }),
    defineField({ name: 'phone', title: 'Phone number', type: 'string', group: 'contact', description: 'As people should see it, e.g. +254 718 146 386' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp number', type: 'string', group: 'contact', description: 'Digits only with country code, e.g. 254718146386' }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact' }),
    defineField({ name: 'address', title: 'Address', type: 'string', group: 'contact' }),
    defineField({ name: 'mapQuery', title: 'Google Maps search', type: 'string', group: 'contact', description: 'What to search on the map, e.g. "Coffee Plaza, Mfangano Street, Nairobi"' }),
    defineField({ name: 'hours', title: 'Opening hours', type: 'string', group: 'contact' }),

    defineField({
      name: 'announcement',
      title: 'Announcement bar',
      type: 'object',
      group: 'news',
      description: 'A thin bar at the very top of every page. Great for offers, holidays or news.',
      fields: [
        { name: 'enabled', title: 'Show the bar', type: 'boolean', initialValue: false },
        { name: 'text', title: 'Message', type: 'string' },
        { name: 'link', title: 'Link (optional)', type: 'string', description: 'e.g. /contact or /news/my-post' },
      ],
    }),

    defineField({
      name: 'stats',
      title: 'Headline numbers',
      type: 'array',
      group: 'numbers',
      description: 'The animated counters on the homepage (up to 4).',
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'value', title: 'Number', type: 'number', validation: (r) => r.required() },
            { name: 'suffix', title: 'After the number', type: 'string', description: 'e.g. +, %, yrs' },
            { name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() },
          ],
          preview: { select: { v: 'value', s: 'suffix', l: 'label' }, prepare: ({ v, s, l }) => ({ title: `${v}${s ?? ''}`, subtitle: l }) },
        }),
      ],
    }),
    defineField({ name: 'googleReviewUrl', title: 'Google reviews link', type: 'url', group: 'numbers' }),
    defineField({ name: 'rating', title: 'Google rating', type: 'number', group: 'numbers', validation: (r) => r.min(1).max(5) }),
    defineField({ name: 'reviewCount', title: 'Number of Google reviews', type: 'number', group: 'numbers' }),

    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'object',
      group: 'social',
      fields: [
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn' },
        { name: 'tiktok', type: 'url', title: 'TikTok' },
      ],
    }),

    defineField({ name: 'seoTitle', title: 'Google title', type: 'string', group: 'seo', validation: (r) => r.max(70).warning('Google shows about 60 characters') }),
    defineField({ name: 'seoDescription', title: 'Google description', type: 'text', rows: 3, group: 'seo', validation: (r) => r.max(170).warning('Google shows about 155 characters') }),
    imageField('ogImage', 'Share image', { group: 'seo', description: 'Shown when the site is shared on WhatsApp, Facebook, etc. Landscape works best.' }),
  ],
  preview: { prepare: () => ({ title: 'Business details' }) },
});

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Top slideshow', default: true },
    { name: 'intro', title: 'Intro' },
    { name: 'eco', title: 'Eco section' },
    { name: 'cta', title: 'Bottom call-to-action' },
  ],
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Slideshow',
      type: 'array',
      group: 'hero',
      description: 'The big rotating banner at the top. Add 2–5 slides; drag to reorder.',
      validation: (r) => r.min(1).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'slide',
          fields: [
            imageField('image', 'Photo', { required: true, description: 'Use a wide, high-quality photo (at least 1600px wide). Set the focal point with the crop icon.' }),
            { name: 'eyebrow', title: 'Small text above heading', type: 'string' },
            { name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required().max(70) },
            { name: 'text', title: 'Supporting text', type: 'text', rows: 2 },
          ],
          preview: { select: { title: 'heading', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'marquee',
      title: 'Scrolling product words',
      type: 'array',
      group: 'hero',
      description: 'The words that scroll across under the slideshow.',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'introHeading', title: 'Intro heading', type: 'text', rows: 2, group: 'intro' }),
    defineField({ name: 'introText', title: 'Intro text', type: 'text', rows: 4, group: 'intro' }),
    defineField({ name: 'ecoHeading', title: 'Heading', type: 'string', group: 'eco' }),
    defineField({ name: 'ecoText', title: 'Text', type: 'text', rows: 4, group: 'eco' }),
    imageField('ecoImage', 'Photo', { group: 'eco' }),
    defineField({ name: 'ecoPoints', title: 'Bullet points', type: 'array', of: [{ type: 'string' }], group: 'eco' }),
    defineField({ name: 'ctaHeading', title: 'Heading', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaText', title: 'Text', type: 'text', rows: 3, group: 'cta' }),
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
});

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { name: 'story', title: 'Our story', default: true },
    { name: 'values', title: 'Values' },
    { name: 'process', title: 'Our process' },
  ],
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', group: 'story' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3, group: 'story' }),
    imageField('image', 'Main photo', { group: 'story' }),
    imageField('secondaryImage', 'Second photo', { group: 'story' }),
    defineField({ name: 'story', title: 'Our story', type: 'richText', group: 'story' }),
    defineField({
      name: 'values',
      title: 'What we stand for',
      type: 'array',
      group: 'values',
      of: [defineArrayMember({ type: 'object', fields: [{ name: 'title', type: 'string', title: 'Title' }, { name: 'text', type: 'text', rows: 3, title: 'Text' }] })],
    }),
    defineField({ name: 'processHeading', title: 'Process heading', type: 'string', group: 'process' }),
    defineField({ name: 'processIntro', title: 'Process intro', type: 'text', rows: 3, group: 'process' }),
    defineField({
      name: 'processSteps',
      title: 'Steps',
      type: 'array',
      group: 'process',
      description: 'Also shown on the homepage.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Step name' },
            { name: 'duration', type: 'string', title: 'How long', description: 'e.g. 2–3 days' },
            { name: 'text', type: 'text', rows: 3, title: 'Description' },
            { name: 'points', type: 'array', title: 'Bullet points', of: [{ type: 'string' }] },
          ],
          preview: { select: { title: 'title', subtitle: 'duration' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'About page' }) },
});
