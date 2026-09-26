import type { ReactNode } from "react"

/**
 * Rendu "Rich Text" d'un contenu Markdown, façon document Word.
 *
 * Pourquoi un composant maison plutôt que `prose` (Tailwind Typography) :
 * - le plugin @tailwindcss/typography n'est pas installé dans ce projet, donc
 *   les classes `prose` / `prose-apc` utilisées ailleurs ne produisent AUCUN style ;
 * - le contenu vient d'un <textarea> admin étiqueté « Markdown » : injecté en
 *   HTML brut il affichait littéralement `#`, `**`, `-` et perdait les sauts de ligne ;
 * - aucun accès réseau ici pour ajouter react-markdown, et le HTML brut
 *   (dangerouslySetInnerHTML) était une faille XSS stockée.
 *
 * Ce composant ne produit que des éléments React : le HTML brut est retiré,
 * et les liens sont filtrés. Aucun dangerouslySetInnerHTML.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type InlineNode =
  | { type: "text"; value: string }
  | { type: "strong"; children: InlineNode[] }
  | { type: "em"; children: InlineNode[] }
  | { type: "del"; children: InlineNode[] }
  | { type: "code"; value: string }
  | { type: "link"; href: string; children: InlineNode[] }
  | { type: "br" }

export type Align = "left" | "center" | "right" | null

export type BlockNode =
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: InlineNode[] }
  | { type: "paragraph"; children: InlineNode[] }
  | { type: "list"; ordered: boolean; start: number; items: BlockNode[][] }
  | { type: "blockquote"; children: BlockNode[] }
  | { type: "code"; lang: string; value: string }
  | { type: "hr" }
  | { type: "table"; head: InlineNode[][]; align: Align[]; rows: InlineNode[][][] }

/* ------------------------------------------------------------------ */
/*  Nettoyage du texte source                                          */
/* ------------------------------------------------------------------ */

const HTML_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  eacute: "é", egrave: "è", ecirc: "ê", agrave: "à", ccedil: "ç",
  ugrave: "ù", ocirc: "ô", icirc: "î", euro: "€", hellip: "…",
  mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘",
  rdquo: "”", ldquo: "“", bull: "•", deg: "°",
}

export function decodeEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, code: string) => {
    if (code.charAt(0) === "#") {
      const isHex = code.charAt(1) === "x" || code.charAt(1) === "X"
      const num = parseInt(isHex ? code.slice(2) : code.slice(1), isHex ? 16 : 10)
      if (!Number.isFinite(num) || num < 0 || num > 0x10ffff) return match
      try {
        return String.fromCodePoint(num)
      } catch {
        return match
      }
    }
    const decoded = HTML_ENTITIES[code.toLowerCase()]
    return decoded === undefined ? match : decoded
  })
}

/**
 * Retire le HTML éventuel (contenu collé depuis Word ou d'un éditeur riche)
 * en préservant le texte et les séparations de lignes.
 */
export function stripHtml(input: string): string {
  return decodeEntities(
    input
      // Neutralisation complète des scripts et styles (contenu + balises)
      .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, " ")
      .replace(/<\s*(script|style)\b[^>]*>/gi, " ")
      .replace(/<\s*br\s*\/?\s*>/gi, "\n")
      .replace(/<\s*li\b[^>]*>/gi, "\n- ")
      // Les balises de bloc deviennent des séparateurs de paragraphe
      .replace(/<\s*\/?\s*(p|div|h[1-6]|tr|table|section|article|ul|ol|blockquote|pre|hr)\b[^>]*>/gi, "\n\n")
      // Balises restantes (span, b, strong, a, font...) : on garde le texte.
      // La lettre est obligatoire après "<" pour ne pas avaler un comparateur
      // mathématique du type "quantité < 500 et prix > 100".
      .replace(/<\/?[a-zA-Z][^>]*>/g, "")
  )
}

/** Autorise uniquement les schémas sûrs : http(s), mailto, tel, ancres et chemins relatifs. */
export function safeHref(raw: string): string | null {
  const href = raw.replace(/[\u0000-\u0020\u007F]/g, "").trim()
  if (!href) return null
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href
  if (/^[#/.]/.test(href)) return href
  return null
}

/* ------------------------------------------------------------------ */
/*  Analyse du texte en ligne (gras, italique, lien, code)             */
/* ------------------------------------------------------------------ */

const isWordChar = (c: string | undefined): boolean =>
  c !== undefined && /[0-9A-Za-zÀ-ɏ]/.test(c)

/** Position du prochain délimiteur non échappé, ou -1. */
function findClosing(src: string, from: number, delim: string): number {
  let idx = from
  for (;;) {
    idx = src.indexOf(delim, idx)
    if (idx === -1) return -1
    let backslashes = 0
    let k = idx - 1
    while (k >= 0 && src.charAt(k) === "\\") {
      backslashes++
      k--
    }
    if (backslashes % 2 === 0) return idx
    idx += delim.length
  }
}

function matchLink(src: string, start: number): { href: string; text: string; end: number } | null {
  const close = src.indexOf("]", start + 1)
  if (close === -1 || src.charAt(close + 1) !== "(") return null
  const paren = src.indexOf(")", close + 2)
  if (paren === -1) return null
  const rawHref = src.slice(close + 2, paren).trim()
  return {
    href: (rawHref.split(/\s+/)[0] ?? "").replace(/^<|>$/g, ""),
    text: src.slice(start + 1, close),
    end: paren + 1,
  }
}

export function parseInline(src: string): InlineNode[] {
  const out: InlineNode[] = []
  let buffer = ""
  let i = 0

  const flush = () => {
    if (buffer) {
      out.push({ type: "text", value: decodeEntities(buffer) })
      buffer = ""
    }
  }

  while (i < src.length) {
    const ch = src.charAt(i)

    // Saut de ligne explicite -> <br> (comportement « document Word »)
    if (ch === "\n") {
      flush()
      out.push({ type: "br" })
      i++
      continue
    }

    // Échappement : \* ne produit pas d'emphase
    if (ch === "\\" && i + 1 < src.length) {
      buffer += src.charAt(i + 1)
      i += 2
      continue
    }

    // Code inline
    if (ch === "`") {
      const end = src.indexOf("`", i + 1)
      if (end > i) {
        flush()
        out.push({ type: "code", value: src.slice(i + 1, end).trim() })
        i = end + 1
        continue
      }
    }

    // Lien [texte](url) et image ![alt](url) -> le texte alternatif est conservé
    if (ch === "[" || (ch === "!" && src.charAt(i + 1) === "[")) {
      const link = matchLink(src, ch === "!" ? i + 1 : i)
      if (link) {
        flush()
        const children = parseInline(link.text)
        const href = safeHref(link.href)
        if (href) {
          out.push({ type: "link", href, children })
        } else {
          out.push(...children)
        }
        i = link.end
        continue
      }
    }

    // Barré
    if (ch === "~" && src.charAt(i + 1) === "~") {
      const end = findClosing(src, i + 2, "~~")
      if (end > i) {
        flush()
        out.push({ type: "del", children: parseInline(src.slice(i + 2, end)) })
        i = end + 2
        continue
      }
    }

    // Gras : **texte** ou __texte__
    if ((ch === "*" || ch === "_") && src.charAt(i + 1) === ch) {
      const usable = ch === "*" || (!isWordChar(src.charAt(i - 1)) && !isWordChar(src.charAt(i + 2)))
      if (usable) {
        const end = findClosing(src, i + 2, ch + ch)
        if (end > i) {
          flush()
          out.push({ type: "strong", children: parseInline(src.slice(i + 2, end)) })
          i = end + 2
          continue
        }
      }
    }

    // Italique : *texte* ou _texte_
    if (ch === "*" || ch === "_") {
      const usable = ch === "*" || (!isWordChar(src.charAt(i - 1)) && !isWordChar(src.charAt(i + 1)))
      if (usable) {
        const end = findClosing(src, i + 1, ch)
        if (end > i) {
          flush()
          out.push({ type: "em", children: parseInline(src.slice(i + 1, end)) })
          i = end + 1
          continue
        }
      }
    }

    buffer += ch
    i++
  }

  flush()
  return out
}

/* ------------------------------------------------------------------ */
/*  Analyse par blocs                                                  */
/* ------------------------------------------------------------------ */

const leadingSpaces = (line: string): number =>
  (line.match(/^[ \t]*/)?.[0] ?? "").replace(/\t/g, "  ").length

const isThematicBreak = (line: string): boolean =>
  /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line)

function matchListItem(line: string): { indent: number; ordered: boolean; num: number; text: string } | null {
  const m = /^([ \t]*)([-*+]|\d{1,9}[.)])[ \t]+(.*)$/.exec(line)
  if (!m) return null
  const marker = m[2] as string
  // "***" ou "---" sont des séparateurs, pas des puces
  if (/^[-*+]{2,}$/.test(marker)) return null
  const ordered = /\d/.test(marker)
  return {
    indent: (m[1] as string).replace(/\t/g, "  ").length,
    ordered,
    num: ordered ? parseInt(marker, 10) : 1,
    text: m[3] as string,
  }
}

function parseAlign(cell: string): Align {
  const c = cell.trim()
  const left = c.startsWith(":")
  const right = c.endsWith(":")
  if (left && right) return "center"
  if (right) return "right"
  if (left) return "left"
  return null
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "")
  const cells: string[] = []
  let buf = ""
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed.charAt(i)
    if (ch === "\\" && trimmed.charAt(i + 1) === "|") {
      buf += "|"
      i++
      continue
    }
    if (ch === "|") {
      cells.push(buf)
      buf = ""
      continue
    }
    buf += ch
  }
  cells.push(buf)
  return cells.map((c) => c.trim())
}

const isTableDivider = (line: string): boolean =>
  line.includes("-") && /^\s*\|?[\s:|-]*\|?\s*$/.test(line) && /-{2,}/.test(line)

function parseList(lines: string[], start: number): { node: BlockNode; next: number } {
  const first = matchListItem(lines[start] as string)
  const ordered = first ? first.ordered : false
  const startNumber = first ? first.num : 1
  const baseIndent = first ? first.indent : 0
  const collected: string[][] = []
  let current: string[] | null = null
  let i = start

  while (i < lines.length) {
    const raw = lines[i] as string

    if (!raw.trim()) {
      let j = i
      while (j < lines.length && !(lines[j] as string).trim()) j++
      if (j >= lines.length) {
        i = j
        break
      }
      const nextItem = matchListItem(lines[j] as string)
      const isDeeper = !nextItem && leadingSpaces(lines[j] as string) > baseIndent
      if ((nextItem && nextItem.ordered === ordered) || isDeeper) {
        i = j
        continue
      }
      i = j
      break
    }

    const item = matchListItem(raw)

    if (item && item.indent === baseIndent && item.ordered === ordered) {
      current = [item.text]
      collected.push(current)
      i++
      continue
    }

    // Item imbriqué : on conserve son indentation relative
    if (item && item.indent > baseIndent && current) {
      current.push(raw.slice(Math.min(baseIndent, leadingSpaces(raw))))
      i++
      continue
    }

    if (current) {
      // Ligne de continuation de l'item
      current.push(leadingSpaces(raw) > baseIndent ? raw.slice(baseIndent) : raw.trim())
      i++
      continue
    }

    break
  }

  return {
    node: {
      type: "list",
      ordered,
      start: ordered ? startNumber : 1,
      items: collected.map((itemLines) => parseBlocks(itemLines)),
    },
    next: i,
  }
}

export function parseBlocks(lines: string[]): BlockNode[] {
  const blocks: BlockNode[] = []
  let i = 0

  while (i < lines.length) {
    const raw = lines[i] as string
    const trimmed = raw.trim()

    if (!trimmed) {
      i++
      continue
    }

    // Bloc de code
    if (/^ {0,3}```/.test(trimmed)) {
      const lang = trimmed.replace(/^```/, "").trim()
      const buffer: string[] = []
      i++
      while (i < lines.length && !/^ {0,3}```/.test((lines[i] as string).trim())) {
        buffer.push(lines[i] as string)
        i++
      }
      i++
      blocks.push({ type: "code", lang, value: buffer.join("\n") })
      continue
    }

    // Séparateur horizontal
    if (isThematicBreak(trimmed)) {
      blocks.push({ type: "hr" })
      i++
      continue
    }

    // Titre
    const heading = /^ {0,3}(#{1,6})\s+(.*)$/.exec(trimmed)
    if (heading) {
      const level = (heading[1] as string).length as 1 | 2 | 3 | 4 | 5 | 6
      const text = (heading[2] as string).replace(/\s+#+\s*$/, "")
      blocks.push({ type: "heading", level, children: parseInline(text) })
      i++
      continue
    }

    // Citation
    if (/^ {0,3}>/.test(raw)) {
      const buffer: string[] = []
      while (i < lines.length && /^ {0,3}>/.test(lines[i] as string)) {
        buffer.push((lines[i] as string).replace(/^ {0,3}> ?/, ""))
        i++
      }
      blocks.push({ type: "blockquote", children: parseBlocks(buffer) })
      continue
    }

    // Tableau
    if (trimmed.includes("|") && i + 1 < lines.length && isTableDivider(lines[i + 1] as string)) {
      const head = splitTableRow(raw)
      const align = splitTableRow(lines[i + 1] as string).map(parseAlign)
      i += 2
      const rows: InlineNode[][][] = []
      while (i < lines.length && (lines[i] as string).trim().includes("|")) {
        const cells = splitTableRow(lines[i] as string)
        while (cells.length < head.length) cells.push("")
        rows.push(cells.slice(0, head.length).map((c) => parseInline(c)))
        i++
      }
      blocks.push({ type: "table", head: head.map((c) => parseInline(c)), align, rows })
      continue
    }

    // Liste
    if (matchListItem(raw)) {
      const { node, next } = parseList(lines, i)
      blocks.push(node)
      i = next
      continue
    }

    // Paragraphe : jusqu'à une ligne vide ou un nouveau bloc.
    // Les retours à la ligne internes sont conservés (rendu <br>).
    const buffer: string[] = []
    while (i < lines.length) {
      const line = lines[i] as string
      const t = line.trim()
      if (!t) break
      if (/^ {0,3}(#{1,6})\s+/.test(t)) break
      if (/^ {0,3}>/.test(line)) break
      if (/^ {0,3}```/.test(t)) break
      if (isThematicBreak(t)) break
      if (matchListItem(line)) break
      if (buffer.length > 0 && t.includes("|") && i + 1 < lines.length && isTableDivider(lines[i + 1] as string)) break
      buffer.push(t)
      i++
    }
    if (buffer.length) {
      blocks.push({ type: "paragraph", children: parseInline(buffer.join("\n")) })
    }
  }

  return blocks
}

/** Point d'entrée : Markdown (ou texte brut) -> arbre de blocs. */
export function parseMarkdown(source: string): BlockNode[] {
  return parseBlocks(stripHtml(source).replace(/\r\n?/g, "\n").split("\n"))
}

/* ------------------------------------------------------------------ */
/*  Rendu React                                                        */
/* ------------------------------------------------------------------ */

const HEADING_CLASSES: Record<number, string> = {
  1: "text-2xl md:text-3xl font-black uppercase tracking-tighter text-gray-900 mt-9 pb-3 border-b border-gray-100",
  2: "text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900 mt-8",
  3: "text-lg font-bold text-apc-green mt-6",
  4: "text-base font-bold uppercase tracking-wider text-gray-700 mt-5",
  5: "text-sm font-bold uppercase tracking-widest text-gray-500 mt-4",
  6: "text-xs font-bold uppercase tracking-widest text-gray-400 mt-4",
}

const LIST_MARKERS = ["list-disc", "list-circle", "list-square"]

function renderInlines(nodes: InlineNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`
    switch (node.type) {
      case "text":
        return <span key={key}>{node.value}</span>
      case "br":
        return <br key={key} />
      case "strong":
        return (
          <strong key={key} className="font-bold text-gray-900">
            {renderInlines(node.children, key)}
          </strong>
        )
      case "em":
        return <em key={key}>{renderInlines(node.children, key)}</em>
      case "del":
        return (
          <del key={key} className="line-through text-gray-400">
            {renderInlines(node.children, key)}
          </del>
        )
      case "code":
        return (
          <code
            key={key}
            className="font-mono text-[13px] bg-gray-100 text-apc-blue px-1.5 py-0.5 rounded-md"
          >
            {node.value}
          </code>
        )
      case "link": {
        const external = /^https?:/i.test(node.href)
        return (
          <a
            key={key}
            href={node.href}
            className="text-apc-blue font-medium underline underline-offset-2 hover:text-apc-blue/80 break-words"
            {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
          >
            {renderInlines(node.children, key)}
          </a>
        )
      }
      default:
        return null
    }
  })
}

const ALIGN_CLASSES: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

function renderBlocks(blocks: BlockNode[], keyPrefix: string, depth = 0): ReactNode[] {
  return blocks.map((block, index) => {
    const key = `${keyPrefix}-${index}`
    switch (block.type) {
      case "heading": {
        const Tag = `h${block.level}` as "h1"
        return (
          <Tag key={key} className={HEADING_CLASSES[block.level]}>
            {renderInlines(block.children, key)}
          </Tag>
        )
      }
      case "paragraph":
        return (
          <p key={key} className="mt-4">
            {renderInlines(block.children, key)}
          </p>
        )
      case "hr":
        return <hr key={key} className="border-t border-gray-200 my-8" />
      case "code":
        return (
          <pre
            key={key}
            className="mt-5 bg-gray-900 text-gray-100 rounded-2xl p-5 overflow-x-auto font-mono text-xs leading-relaxed"
          >
            {block.value}
          </pre>
        )
      case "blockquote":
        return (
          <blockquote
            key={key}
            className="mt-6 border-l-4 border-apc-green bg-apc-green/5 rounded-r-2xl pl-5 py-4 italic text-gray-600"
          >
            {renderBlocks(block.children, key, depth)}
          </blockquote>
        )
      case "list": {
        const marker = LIST_MARKERS[Math.min(depth, LIST_MARKERS.length - 1)] as string
        const Tag = block.ordered ? "ol" : "ul"
        return (
          <Tag
            key={key}
            start={block.ordered ? block.start : undefined}
            className={`mt-4 space-y-2 pl-6 text-gray-700 marker:text-apc-green marker:font-bold ${marker}`}
          >
            {block.items.map((itemBlocks, itemIndex) => (
              <li
                key={`${key}-li-${itemIndex}`}
                className="[&>*:first-child]:mt-0 [&>p]:my-1 leading-relaxed"
              >
                {renderBlocks(itemBlocks, `${key}-li-${itemIndex}`, depth + 1)}
              </li>
            ))}
          </Tag>
        )
      }
      case "table":
        return (
          <div key={key} className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {block.head.map((cell, cellIndex) => (
                    <th
                      key={`${key}-th-${cellIndex}`}
                      className={`px-4 py-3 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 ${
                        ALIGN_CLASSES[block.align[cellIndex] ?? ""] ?? "text-left"
                      }`}
                    >
                      {renderInlines(cell, `${key}-th-${cellIndex}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`${key}-tr-${rowIndex}`} className="even:bg-gray-50/40">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${key}-td-${rowIndex}-${cellIndex}`}
                        className={`px-4 py-3 border border-gray-100 align-top text-gray-700 ${
                          ALIGN_CLASSES[block.align[cellIndex] ?? ""] ?? "text-left"
                        }`}
                      >
                        {renderInlines(cell, `${key}-td-${rowIndex}-${cellIndex}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      default:
        return null
    }
  })
}

export function MarkdownContent({
  content,
  className = "",
}: {
  content?: string | null
  className?: string
}) {
  const source = typeof content === "string" ? content : ""
  if (!source.trim()) return null

  const blocks = parseMarkdown(source)

  return (
    <div
      className={`text-[15px] leading-relaxed text-gray-600 [&>*:first-child]:mt-0 ${className}`.trim()}
    >
      {renderBlocks(blocks, "md")}
    </div>
  )
}

export default MarkdownContent
