import { defineArrayMember, defineField, defineType } from 'sanity';
import { BasketIcon as GiftIcon } from '@sanity/icons/Basket';
import { BlockquoteIcon } from '@sanity/icons/Blockquote';
import { CaseIcon } from '@sanity/icons/Case';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { EnvelopeIcon } from '@sanity/icons/Envelope';
import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { ImagesIcon } from '@sanity/icons/Images';
import { PackageIcon } from '@sanity/icons/Package';
import { TagsIcon } from '@sanity/icons/Tags';
import { LockIcon } from '@sanity/icons/Lock';
import { galleryField, imageField, orderField, slugField } from './fields';

export const service = defineType({
  name: 'service',
  title: 'Product / Service',
  type: 'document',
  icon: PackageIcon,
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'details', title: 'Details' },
    { name: 'photos', title: 'Photos' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Name', type: 'string', group: 'main', validation: (r) => r.required() }),
    slugField(),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'main',
      options: {
        list: [
          { title: 'Promotional merchandise', value: 'merchandise' },
          { title: 'Eco packaging', value: 'packaging' },
          { title: 'Identity & print', value: 'identity' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'excerpt', title: 'Short summary', type: 'text', rows: 2, group: 'main', description: 'One line shown on cards.', validation: (r) => r.required().max(140) }),
    defineField({ name: 'description', title: 'Full description', type: 'text', rows: 6, group: 'main' }),
    defineField({ name: 'featured', title: 'Show on homepage', type: 'boolean', group: 'main', initialValue: false }),
    orderField,
    defineField({ name: 'priceFrom', title: 'Price from', type: 'string', group: 'details', description: 'e.g. KSh 650. Leave empty to hide.' }),
    defineField({ name: 'turnaround', title: 'Turnaround', type: 'string', group: 'details' }),
    defineField({ name: 'minOrder', title: 'Minimum order', type: 'string', group: 'details' }),
    defineField({ name: 'popularWith', title: 'Popular with', type: 'string', group: 'details' }),
    defineField({ name: 'features', title: 'Key features', type: 'array', of: [{ type: 'string' }], group: 'details' }),
    defineField({
      name: 'options',
      title: 'Price list / options',
      type: 'array',
      group: 'details',
      description: 'Variants customers can pick in the instant quote (e.g. "Polo shirt 220gsm"). Leave the price empty to show "price on request".',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'option',
          fields: [
            { name: 'name', title: 'Option', type: 'string', validation: (r) => r.required() },
            { name: 'unitPrice', title: 'Price per piece from (KSh)', type: 'number' },
            { name: 'minQty', title: 'Minimum order', type: 'number' },
            { name: 'note', title: 'Note', type: 'string' },
          ],
          preview: { select: { t: 'name', p: 'unitPrice', m: 'minQty' }, prepare: ({ t, p, m }) => ({ title: t, subtitle: `${p ? `KSh ${p}` : 'On request'}${m ? ` · min ${m}` : ''}` }) },
        }),
      ],
    }),
    imageField('image', 'Main photo', { required: true, group: 'photos' }),
    galleryField('gallery', 'More photos', 'photos'),
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'image' } },
});

export const pack = defineType({
  name: 'pack',
  title: 'Gift pack',
  type: 'document',
  icon: GiftIcon,
  description: 'Ready-made bundles (welcome kits, hampers…) shown on the homepage and services page.',
  fields: [
    defineField({ name: 'title', title: 'Pack name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'badge', title: 'Badge (optional)', type: 'string', description: 'e.g. Most popular' }),
    defineField({ name: 'tagline', title: 'Short description', type: 'string', validation: (r) => r.required() }),
    imageField('image', 'Photo', { required: true }),
    defineField({ name: 'items', title: "What's inside", type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'minQty', title: 'Minimum packs', type: 'number' }),
    orderField,
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'tagline', media: 'image' } },
});

export const industry = defineType({
  name: 'industry',
  title: 'Industry',
  type: 'document',
  icon: TagsIcon,
  fields: [
    defineField({ name: 'title', title: 'Industry', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'stat', title: 'Highlight', type: 'string', description: 'e.g. 120+ clients' }),
    imageField('image', 'Photo', { required: true }),
    orderField,
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'stat', media: 'image' } },
});

export const project = defineType({
  name: 'project',
  title: 'Portfolio project',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({ name: 'title', title: 'Project name', type: 'string', validation: (r) => r.required() }),
    slugField(),
    defineField({ name: 'client', title: 'Client (optional)', type: 'string' }),
    defineField({ name: 'industry', title: 'Industry', type: 'string' }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({ name: 'excerpt', title: 'Short summary', type: 'text', rows: 2, validation: (r) => r.required().max(160) }),
    imageField('cover', 'Cover photo', { required: true }),
    galleryField('gallery', 'Project photos'),
    defineField({ name: 'body', title: 'The story (optional)', type: 'richText' }),
    defineField({ name: 'tags', title: 'Products used', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'featured', title: 'Show on homepage', type: 'boolean', initialValue: false }),
    orderField,
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'client', media: 'cover' } },
});

export const post = defineType({
  name: 'post',
  title: 'News & blog post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    slugField(),
    defineField({ name: 'publishedAt', title: 'Publish date', type: 'date', initialValue: () => new Date().toISOString().slice(0, 10), validation: (r) => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['Company news', 'New products', 'Project spotlight', 'Pricing guide', 'Corporate gifting', 'Sustainable packaging', 'Tips & guides'] },
    }),
    defineField({ name: 'excerpt', title: 'Summary', type: 'text', rows: 3, description: 'Shown on the news list and on Google.', validation: (r) => r.required().max(200) }),
    imageField('cover', 'Cover photo'),
    defineField({ name: 'body', title: 'Article', type: 'richText' }),
  ],
  orderings: [{ title: 'Newest first', name: 'date', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'publishedAt', media: 'cover' } },
});

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Review',
  type: 'document',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'status',
      title: 'Show on website?',
      type: 'string',
      initialValue: 'approved',
      description: 'Reviews sent from the website arrive as "Waiting" and stay hidden until you approve them.',
      options: {
        list: [
          { title: '⏳ Waiting for approval', value: 'pending' },
          { title: '✅ Approved (shown on website)', value: 'approved' },
          { title: '🚫 Rejected (hidden)', value: 'rejected' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role & company', type: 'string', description: 'e.g. HR Manager, Nairobi International School' }),
    defineField({ name: 'quote', title: 'What they said', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'rating', title: 'Stars', type: 'number', initialValue: 5, validation: (r) => r.min(1).max(5) }),
    imageField('photo', 'Photo (optional)'),
    defineField({ name: 'email', title: 'Email (private, never shown)', type: 'string', readOnly: true }),
    defineField({ name: 'source', title: 'Source', type: 'string', readOnly: true, options: { list: ['website', 'manual'] } }),
    defineField({ name: 'submittedAt', title: 'Received', type: 'datetime', readOnly: true }),
    orderField,
  ],
  preview: {
    select: { name: 'name', role: 'role', status: 'status', rating: 'rating', media: 'photo' },
    prepare: ({ name, role, status, rating, media }) => ({
      title: `${status === 'pending' ? '⏳ ' : status === 'rejected' ? '🚫 ' : ''}${name ?? ''}`,
      subtitle: `${'★'.repeat(rating ?? 0)} ${role ?? ''}`,
      media,
    }),
  },
});

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (r) => r.required() }),
    orderField,
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'question' } },
});

export const clientLogo = defineType({
  name: 'clientLogo',
  title: 'Client logo',
  type: 'document',
  icon: ImagesIcon,
  description: 'Logos of businesses you have worked with. They scroll across the homepage.',
  fields: [
    defineField({ name: 'name', title: 'Client name', type: 'string', validation: (r) => r.required() }),
    imageField('logo', 'Logo', { required: true, description: 'A PNG with a transparent background looks best.' }),
    defineField({ name: 'url', title: 'Website (optional)', type: 'url' }),
    orderField,
  ],
  preview: { select: { title: 'name', media: 'logo' } },
});

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  icon: LockIcon,
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'updated', title: 'Last updated', type: 'date' }),
    defineField({ name: 'body', title: 'Content', type: 'richText' }),
  ],
});

export const enquiry = defineType({
  name: 'enquiry',
  title: 'Enquiry',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: '🟢 New', value: 'new' },
          { title: '📞 Contacted', value: 'contacted' },
          { title: '🧾 Quoted', value: 'quoted' },
          { title: '🏆 Won', value: 'won' },
          { title: '✖ Closed', value: 'closed' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({ name: 'company', title: 'Company', type: 'string', readOnly: true }),
    defineField({ name: 'service', title: 'Interested in', type: 'string', readOnly: true }),
    defineField({ name: 'quantity', title: 'Quantity', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', readOnly: true }),
    defineField({
      name: 'items',
      title: 'Quote items',
      type: 'array',
      readOnly: true,
      of: [
        defineArrayMember({
          type: 'object',
          name: 'quoteItem',
          fields: [
            { name: 'product', type: 'string', title: 'Product' },
            { name: 'option', type: 'string', title: 'Option' },
            { name: 'quantity', type: 'number', title: 'Quantity' },
            { name: 'decoration', type: 'string', title: 'Branding method' },
            { name: 'unitPrice', type: 'number', title: 'Listed price from (KSh)' },
          ],
          preview: { select: { p: 'product', o: 'option', q: 'quantity', d: 'decoration' }, prepare: ({ p, o, q, d }) => ({ title: `${q ?? ''} × ${o || p}`, subtitle: [p, d].filter(Boolean).join(' · ') }) },
        }),
      ],
    }),
    defineField({ name: 'estimate', title: 'Estimated value (KSh, from)', type: 'number', readOnly: true }),
    defineField({ name: 'neededBy', title: 'Needed by', type: 'date', readOnly: true }),
    defineField({ name: 'location', title: 'Delivery location', type: 'string', readOnly: true }),
    defineField({ name: 'artwork', title: 'Logo / artwork', type: 'file', readOnly: true }),
    defineField({ name: 'notes', title: 'Internal notes', type: 'text', rows: 3, description: 'Only visible to your team.' }),
    defineField({ name: 'submittedAt', title: 'Received', type: 'datetime', readOnly: true }),
  ],
  orderings: [{ title: 'Newest first', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] }],
  preview: {
    select: { name: 'name', company: 'company', service: 'service', status: 'status', at: 'submittedAt', est: 'estimate' },
    prepare: ({ name, company, service, status, at, est }) => ({
      title: `${status === 'new' ? '🟢 ' : ''}${name ?? 'Unknown'}${company ? ` · ${company}` : ''}`,
      subtitle: `${est ? `≈ KSh ${Math.round(est).toLocaleString()} · ` : ''}${service ?? ''}${at ? ` · ${new Date(at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}` : ''}`,
    }),
  },
});
