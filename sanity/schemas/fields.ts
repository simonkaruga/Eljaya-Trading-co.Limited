import { defineArrayMember, defineField } from 'sanity';

/** Image with focal-point cropping and alt text. Used everywhere an owner uploads a photo. */
export function imageField(name: string, title: string, opts: { description?: string; required?: boolean; group?: string } = {}) {
  return defineField({
    name,
    title,
    type: 'image',
    group: opts.group,
    description: opts.description ?? 'Click the crop icon after uploading to set the focal point, so it stays in frame on phones.',
    options: { hotspot: true },
    validation: opts.required ? (r) => r.required() : undefined,
    fields: [
      defineField({
        name: 'alt',
        title: 'Describe the image',
        type: 'string',
        description: 'Short description for Google and screen readers, e.g. "Green branded jute bags".',
      }),
    ],
  });
}

export function galleryField(name = 'gallery', title = 'More photos', group?: string) {
  return defineField({
    name,
    title,
    type: 'array',
    group,
    description: 'Drag photos here to upload several at once. Drag to reorder.',
    of: [defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Describe the image', type: 'string' }] })],
    options: { layout: 'grid' },
  });
}

export function slugField(source = 'title') {
  return defineField({
    name: 'slug',
    title: 'Web address',
    type: 'slug',
    description: 'Click "Generate". This becomes the page link.',
    options: { source, maxLength: 80 },
    validation: (r) => r.required(),
  });
}

export const orderField = defineField({
  name: 'order',
  title: 'Display order',
  type: 'number',
  description: 'Lower numbers show first.',
  initialValue: 10,
});
