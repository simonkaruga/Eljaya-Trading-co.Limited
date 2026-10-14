export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2025-10-01';

/** False until a Sanity project ID is set; the site then serves lib/fallback.ts. */
export const sanityEnabled = Boolean(projectId);
