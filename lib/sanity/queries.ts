import { groq } from 'next-sanity';

/** Normalises any Sanity image into the shape of `Img` in lib/types.ts. */
const IMG = `{ "src": asset->url, "alt": coalesce(alt, asset->altText), "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height, "lqip": asset->metadata.lqip, "hotspot": hotspot }`;

const RICH = `body[]{ ..., _type == "image" => { "_type": "image", "_key": _key, "caption": caption, "img": ${IMG} } }`;

export const settingsQ = groq`*[_id == "siteSettings"][0]{ ..., ogImage${IMG} }`;

export const homeQ = groq`*[_id == "homePage"][0]{ ..., heroSlides[]{ eyebrow, heading, text, image${IMG} }, showcase[]${IMG}, ecoImage${IMG} }`;

export const aboutQ = groq`*[_id == "aboutPage"][0]{ ..., image${IMG}, secondaryImage${IMG}, "story": story[]{ ... } }`;

const SERVICE = `_id, title, "slug": slug.current, category, excerpt, description, image${IMG}, gallery[]${IMG}, turnaround, minOrder, priceFrom, popularWith, features, featured`;
export const servicesQ = groq`*[_type == "service" && defined(slug.current)] | order(order asc, title asc){ ${SERVICE} }`;
export const serviceQ = groq`*[_type == "service" && slug.current == $slug][0]{ ${SERVICE} }`;

export const industriesQ = groq`*[_type == "industry"] | order(order asc){ _id, title, description, stat, image${IMG} }`;

const PROJECT = `_id, title, "slug": slug.current, client, industry, year, excerpt, cover${IMG}, gallery[]${IMG}, tags, featured`;
export const projectsQ = groq`*[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc){ ${PROJECT} }`;
export const projectQ = groq`*[_type == "project" && slug.current == $slug][0]{ ${PROJECT}, ${RICH} }`;

const POST = `_id, title, "slug": slug.current, category, excerpt, cover${IMG}, publishedAt, "readTime": round(length(pt::text(body)) / 1100) + 1`;
export const postsQ = groq`*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc){ ${POST} }`;
export const postQ = groq`*[_type == "post" && slug.current == $slug][0]{ ${POST}, ${RICH} }`;

export const testimonialsQ = groq`*[_type == "testimonial"] | order(order asc, _createdAt asc){ _id, name, role, quote, rating, photo${IMG} }`;
export const faqsQ = groq`*[_type == "faq"] | order(order asc){ _id, question, answer }`;
export const clientLogosQ = groq`*[_type == "clientLogo"] | order(order asc){ _id, name, url, logo${IMG} }`;
export const legalQ = groq`*[_id == $id][0]{ title, updated, "body": body[]{ ... } }`;
