type Params = Record<string, string | number | undefined>;
type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };

const META_EVENTS: Record<string, string> = {
  quote_submit: 'Lead',
  contact_submit: 'Lead',
  whatsapp_click: 'Contact',
  phone_click: 'Contact',
  add_to_quote: 'AddToCart',
};

/** Sends a conversion event to Google Analytics 4 and the Meta Pixel when they're configured. */
export function track(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return;
  const w = window as W;
  w.gtag?.('event', event, params);
  const meta = META_EVENTS[event];
  if (meta) w.fbq?.('track', meta, { content_name: params.item ?? event, value: params.value, currency: 'KES' });
}
