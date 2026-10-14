import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from './env';

export const client = createClient({
  projectId: projectId || 'missing',
  dataset,
  apiVersion,
  useCdn: false, // Next caches responses; webhook revalidation makes edits appear instantly
  perspective: 'published',
});

/** Server-only client that can create documents (contact form enquiries). */
export const writeClient = client.withConfig({ token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false });
