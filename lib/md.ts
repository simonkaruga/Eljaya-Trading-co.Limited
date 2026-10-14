/**
 * Tiny Markdown → Portable Text converter used for the built-in fallback
 * content and by `scripts/seed.ts` when importing it into Sanity.
 *
 * Supports: `## h2`, `### h3`, `- bullets`, `> callout`, `| table | rows |`
 * (first row is the header), paragraphs, **bold** and [links](/url).
 */
let n = 0;
const key = () => `k${(n++).toString(36)}`;

type Span = { _type: 'span'; _key: string; text: string; marks: string[] };
type MarkDef = { _type: 'link'; _key: string; href: string };

function inline(text: string) {
  const children: Span[] = [];
  const markDefs: MarkDef[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) children.push({ _type: 'span', _key: key(), text: text.slice(last, m.index), marks: [] });
    if (m[1]) {
      children.push({ _type: 'span', _key: key(), text: m[1], marks: ['strong'] });
    } else {
      const def: MarkDef = { _type: 'link', _key: key(), href: m[3] };
      markDefs.push(def);
      children.push({ _type: 'span', _key: key(), text: m[2], marks: [def._key] });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) children.push({ _type: 'span', _key: key(), text: text.slice(last), marks: [] });
  return { children, markDefs };
}

export function md(src: string) {
  const out: Record<string, unknown>[] = [];
  let table: { _type: 'table'; _key: string; rows: { _key: string; cells: string[] }[] } | null = null;

  for (const raw of src.trim().split('\n')) {
    const line = raw.trim();
    if (!line.startsWith('|')) table = null;
    if (!line) continue;

    if (line.startsWith('|')) {
      const cells = line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      if (!table) {
        table = { _type: 'table', _key: key(), rows: [] };
        out.push(table);
      }
      table.rows.push({ _key: key(), cells });
    } else if (line.startsWith('> ')) {
      out.push({ _type: 'callout', _key: key(), text: line.slice(2) });
    } else {
      const h = /^(#{2,3})\s+(.*)$/.exec(line);
      const li = /^-\s+(.*)$/.exec(line);
      const text = h ? h[2] : li ? li[1] : line;
      out.push({
        _type: 'block',
        _key: key(),
        style: h ? (h[1].length === 2 ? 'h2' : 'h3') : 'normal',
        ...(li ? { listItem: 'bullet', level: 1 } : {}),
        ...inline(text),
      });
    }
  }
  return out;
}

/** Plain text of a portable-text array (for read-time estimates, meta descriptions). */
export function toPlainText(blocks: unknown[] = []): string {
  return blocks
    .map((b) => {
      const block = b as { _type?: string; children?: { text?: string }[]; text?: string };
      if (block._type === 'block') return (block.children ?? []).map((c) => c.text ?? '').join('');
      if (block._type === 'callout') return block.text ?? '';
      return '';
    })
    .join('\n');
}
