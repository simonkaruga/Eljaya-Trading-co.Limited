'use client';

import { defineConfig } from 'sanity';
import { structureTool, type StructureBuilder } from 'sanity/structure';
import { media } from 'sanity-plugin-media';
import { CogIcon } from '@sanity/icons/Cog';
import { HomeIcon } from '@sanity/icons/Home';
import { UsersIcon } from '@sanity/icons/Users';
import { InboxIcon } from '@sanity/icons/Inbox';
import { LockIcon } from '@sanity/icons/Lock';
import { PackageIcon } from '@sanity/icons/Package';
import { CaseIcon } from '@sanity/icons/Case';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { BlockquoteIcon } from '@sanity/icons/Blockquote';
import { TagsIcon } from '@sanity/icons/Tags';
import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { ImagesIcon } from '@sanity/icons/Images';
import { schemaTypes, SINGLETONS } from './sanity/schemas';
import { projectId, dataset } from './lib/sanity/env';

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-mark.png" alt="" width={18} height={24} />
      <span style={{ fontWeight: 700, fontSize: 13 }}>Eljaya Admin</span>
    </div>
  );
}

const singleton = (S: StructureBuilder, type: string, id: string, title: string, icon: React.ComponentType) =>
  S.listItem().title(title).icon(icon).id(id).child(S.document().schemaType(type).documentId(id).title(title));

const list = (S: StructureBuilder, type: string, title: string, icon: React.ComponentType) =>
  S.documentTypeListItem(type).title(title).icon(icon);

export default defineConfig({
  name: 'eljaya',
  title: 'Eljaya Admin',
  basePath: '/studio',
  projectId: projectId || 'missing',
  dataset,

  studio: { components: { logo: Logo } },

  plugins: [
    structureTool({
      title: 'Website',
      structure: (S) =>
        S.list()
          .title('Eljaya website')
          .items([
            S.listItem()
              .title('Enquiries')
              .icon(InboxIcon)
              .child(
                S.list()
                  .title('Enquiries')
                  .items([
                    S.listItem().title('New').icon(InboxIcon).child(
                      S.documentList().title('New enquiries').schemaType('enquiry')
                        .filter('_type == "enquiry" && status == "new"')
                        .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                    ),
                    S.listItem().title('In progress').icon(InboxIcon).child(
                      S.documentList().title('In progress').schemaType('enquiry')
                        .filter('_type == "enquiry" && status in ["contacted", "quoted"]')
                        .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                    ),
                    S.listItem().title('All enquiries').icon(InboxIcon).child(
                      S.documentTypeList('enquiry').title('All enquiries')
                        .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
                    ),
                  ]),
              ),
            S.divider(),
            singleton(S, 'homePage', 'homePage', 'Homepage', HomeIcon),
            singleton(S, 'aboutPage', 'aboutPage', 'About page', UsersIcon),
            singleton(S, 'siteSettings', 'siteSettings', 'Business details & announcements', CogIcon),
            S.divider(),
            list(S, 'service', 'Products & services', PackageIcon),
            list(S, 'project', 'Portfolio', CaseIcon),
            list(S, 'post', 'News & blog', DocumentTextIcon),
            list(S, 'testimonial', 'Testimonials', BlockquoteIcon),
            list(S, 'industry', 'Industries', TagsIcon),
            list(S, 'faq', 'FAQs', HelpCircleIcon),
            list(S, 'clientLogo', 'Client logos', ImagesIcon),
            S.divider(),
            singleton(S, 'legalPage', 'legal-privacy', 'Privacy policy', LockIcon),
            singleton(S, 'legalPage', 'legal-terms', 'Terms of service', LockIcon),
          ]),
    }),
    media(),
  ],

  schema: {
    types: schemaTypes,
    // Hide singletons and form-submitted enquiries from the global "Create" menu
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType) && schemaType !== 'enquiry'),
  },

  document: {
    actions: (actions, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
});
