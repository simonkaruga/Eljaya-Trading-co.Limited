import { defineArrayMember, defineType } from 'sanity';

export const richText = defineType({
  name: 'richText',
  title: 'Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading', value: 'h2' },
        { title: 'Sub-heading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullets', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{ name: 'href', type: 'url', title: 'URL', validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }) }],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Photo',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Describe the image' },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
    }),
    defineArrayMember({
      name: 'callout',
      type: 'object',
      title: 'Tip box',
      fields: [{ name: 'text', type: 'text', rows: 3, title: 'Tip' }],
      preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title: `💡 ${title ?? ''}` }) },
    }),
    defineArrayMember({
      name: 'table',
      type: 'object',
      title: 'Table',
      description: 'The first row is the header.',
      fields: [
        {
          name: 'rows',
          type: 'array',
          title: 'Rows',
          of: [
            {
              type: 'object',
              name: 'row',
              fields: [{ name: 'cells', type: 'array', title: 'Cells', of: [{ type: 'string' }] }],
              preview: { select: { cells: 'cells' }, prepare: ({ cells }) => ({ title: (cells ?? []).join('  |  ') }) },
            },
          ],
        },
      ],
      preview: { select: { rows: 'rows' }, prepare: ({ rows }) => ({ title: `Table · ${rows?.length ?? 0} rows` }) },
    }),
  ],
});
