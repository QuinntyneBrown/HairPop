"""Build the HairPop design-system documentation site.

Pages are authored as section fragments in src/<folder>/<slug>.html (or
.fragment for generated catalog entries). Each
fragment starts with a metadata comment and then holds only the page's
<section> blocks:

    <!--meta {"lead": "...", "description": "...", "variants": "...", "states": "...",
              "sources": ["pages/style-gallery/default"], "pills": ["Native <button>"]} -->
    <section class="ds-section" id="overview"><h2><a href="#overview">Overview</a></h2>...</section>

This script wraps every fragment in the shared shell (head, navigation,
header with table of contents, footer), then writes index.html and
README.md, so the navigation is identical on every page. Macros keep the
fragments short and consistent:

    {{icon:close}} or {{icon:close|icon--sm}}   inline SVG from ICONS
    {{example:Caption}} markup {{/example}}      live canvas + caption + escaped HTML
    {{themes}} markup {{/themes}}                the same markup in light and dark
    {{tok:Part|--token[|--token2]}}              a token-table row with live values
    {{pair:Label|--fg|--bg|4.5}}                 a live contrast pair
    {{mock:pages/style-gallery/default|note}}    a list item linking a mock

Usage:  python docs/design-system/build.py
"""
from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
PRODUCT = "HairPop"
EXTRACTED = "2026-10-10"

FOUNDATIONS = [
    ("color", "Color"), ("typography", "Typography"), ("spacing", "Spacing"), ("layout", "Layout"),
    ("elevation", "Elevation"), ("shape", "Shape"), ("motion", "Motion"), ("iconography", "Iconography"),
    ("theming", "Theming"), ("responsive", "Responsive"), ("accessibility", "Accessibility"), ("content", "Content"),
]

COMPONENT_GROUPS = [
    ("Actions", [("button", "Button"), ("link", "Link"), ("menu", "Menu")]),
    ("Inputs", [("text-field", "Text field"), ("textarea", "Textarea"), ("select", "Select"), ("checkbox", "Checkbox"),
                ("radio-group", "Radio group"), ("switch", "Switch"), ("form-field", "Form field"), ("form-layout", "Form layout")]),
    ("Navigation", [("top-bar", "Top bar"), ("sidebar-navigation", "Sidebar navigation"), ("tabs", "Tabs"), ("breadcrumb", "Breadcrumb"),
                    ("pagination", "Pagination"), ("page-header", "Page header"), ("footer", "Footer"), ("skip-link", "Skip link")]),
    ("Containers and overlays", [("card", "Card"), ("dialog", "Dialog"), ("tooltip", "Tooltip"), ("divider", "Divider"), ("container", "Container, grid and stack")]),
    ("Data display", [("table", "Table"), ("list", "List"), ("description-list", "Description list"), ("avatar", "Avatar"),
                      ("badge", "Badge"), ("chip", "Chip"), ("stat", "Stat")]),
    ("Feedback", [("toast", "Toast"), ("alert", "Alert and banner"), ("inline-message", "Inline message"), ("progress-bar", "Progress bar"),
                  ("spinner", "Spinner"), ("skeleton", "Skeleton"), ("empty-state", "Empty state"), ("error-page", "Error page")]),
]
COMPONENTS = [(slug, title, group) for group, items in COMPONENT_GROUPS for slug, title in items]

PATTERNS = [
    ("forms", "Forms"), ("feedback-and-loading", "Feedback and loading"), ("empty-and-error-states", "Empty and error states"),
    ("navigation", "Navigation and page structure"), ("dialogs-and-overlays", "Dialogs and overlays"),
    ("tables-and-lists", "Tables and lists"), ("notifications", "Notifications"), ("content-and-tone", "Content and tone"),
]

# 24-unit grid, 2px stroke, round caps and joins, currentColor (see foundations/iconography).
ICONS = {
    "sparkle": "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
    "close": "M6 6l12 12M18 6L6 18",
    "search": "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
    "check": "M5 12l5 5L19 7",
    "check-circle": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12l3 3 5-6",
    "info": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 7.5v.01",
    "alert-circle": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5M12 16v.01",
    "warning": "M12 4L2.5 20h19zM12 10v4M12 17v.01",
    "arrow-right": "M5 12h14M13 6l6 6-6 6",
    "arrow-left": "M19 12H5M11 6l-6 6 6 6",
    "arrow-up": "M12 19V5M6 11l6-6 6 6",
    "arrow-down": "M12 5v14M6 13l6 6 6-6",
    "chevron-down": "M6 9l6 6 6-6",
    "chevron-left": "M15 6l-6 6 6 6",
    "chevron-right": "M9 6l6 6-6 6",
    "star": "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z",
    "calendar": "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
    "clock": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
    "map-pin": "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
    "bell": "M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0",
    "user": "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 20a8 8 0 0 1 16 0",
    "menu": "M4 6h16M4 12h16M4 18h16",
    "filter": "M4 5h16l-6 8v6l-4-2v-4z",
    "plus": "M12 5v14M5 12h14",
    "edit": "M4 20h4l10-10-4-4L4 16v4zM13 7l4 4",
    "trash": "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
    "external": "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
    "eye": "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    "eye-off": "M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.2 6.2C3.6 8 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5-1.4M9.9 9.9a3 3 0 0 0 4.2 4.2",
    "more": "M5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM19 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
    "refresh": "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
    "wifi-off": "M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M12 20h.01M16.7 11.3A10 10 0 0 1 19 13M2 9a15 15 0 0 1 4.6-2.9M10.7 5.1A15 15 0 0 1 22 9",
    "lock": "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
    "mail": "M3 6h18v12H3zM3 7l9 6 9-6",
    "message": "M4 5h16v11H8l-4 4z",
    "log-out": "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
    "help": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 16.5v.01",
    "home": "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
}

META_RE = re.compile(r"^\s*<!--meta\s+(\{.*?\})\s*-->", re.S)
SECTION_RE = re.compile(r'<section\b[^>]*\bid="([^"]+)"[^>]*>\s*<h2><a href="#\1">(.*?)</a></h2>', re.S)


def esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def icon(name: str, extra: str = "") -> str:
    if name not in ICONS:
        raise KeyError(f"unknown icon '{name}'")
    cls = "icon" + (f" {extra}" if extra else "")
    return f'<svg class="{cls}" aria-hidden="true" viewBox="0 0 24 24"><path d="{ICONS[name]}"/></svg>'


def tok_row(args: list[str]) -> str:
    part, tokens = args[0], [t.strip() for t in args[1:]]
    names = " / ".join(f"<code>{esc(t)}</code>" for t in tokens)
    if tokens[0].startswith(("--color", "--palette")):
        def cell(theme: str) -> str:
            return " ".join(f'<span class="ds-swatch-cell" data-theme="{theme}"><i data-token="{t}" data-swatch></i><span data-token="{t}"></span></span>' for t in tokens)
        return f"<tr><td>{part}</td><td>{names}</td><td>{cell('light')}</td><td>{cell('dark')}</td></tr>"
    values = " / ".join(f'<span data-token="{t}"></span>' for t in tokens)
    return f'<tr><td>{part}</td><td>{names}</td><td colspan="2">{values}</td></tr>'


def pair(args: list[str]) -> str:
    label, fg, bg = args[0], args[1].strip(), args[2].strip()
    minimum = args[3].strip() if len(args) > 3 else "4.5"
    return f'<div class="ds-pair"><span>{label}</span><span class="ds-pair__ratio" data-contrast="{fg}|{bg}" data-min="{minimum}"></span></div>'


def mock_item(args: list[str]) -> str:
    path = args[0].strip()
    note = f" ({args[1]})" if len(args) > 1 and args[1] else ""
    target = ROOT.parent / "mocks" / f"{path}.html"
    if not target.is_file():
        raise FileNotFoundError(f"mock {path} does not exist")
    return f'<li><a href="../../mocks/{path}.html">{esc(path)}</a>{note}</li>'


def expand(body: str) -> str:
    body = re.sub(r"\{\{icon:([\w-]+)(?:\|([^}]*))?\}\}", lambda m: icon(m.group(1), m.group(2) or ""), body)

    def example(m: re.Match) -> str:
        caption, markup = m.group(1).strip(), m.group(2).strip()
        mods = ""
        if caption.startswith("["):
            mods, caption = caption[1:].split("]", 1)
            mods = " " + " ".join(f"ds-example__canvas--{x}" for x in mods.split(","))
            caption = caption.strip()
        cap = f'<div class="ds-example__caption"><span>{caption}</span></div>' if caption else ""
        return (f'<div class="ds-example"><div class="ds-example__canvas{mods}">{markup}</div>{cap}'
                f'<details class="ds-example__code"><summary>HTML</summary><pre><code>{esc(markup)}</code></pre></details></div>')

    body = re.sub(r"\{\{example:(.*?)\}\}(.*?)\{\{/example\}\}", example, body, flags=re.S)
    body = re.sub(
        r"\{\{themes(?::(stack))?\}\}(.*?)\{\{/themes\}\}",
        lambda m: '<div class="ds-themes">' + "".join(
            f'<div data-theme="{t}"><div class="ds-example__canvas{" ds-example__canvas--stack" if m.group(1) else ""}" style="padding: 0;">{m.group(2).strip()}</div></div>' for t in ("light", "dark")) + "</div>",
        body, flags=re.S)
    body = re.sub(r"\{\{tok:(.*?)\}\}", lambda m: tok_row(m.group(1).split("|")), body)
    body = re.sub(r"\{\{pair:(.*?)\}\}", lambda m: pair(m.group(1).split("|")), body)
    body = re.sub(r"\{\{mock:(.*?)\}\}", lambda m: mock_item(m.group(1).split("|", 1)), body)
    # Sections marked not applicable get their visible reason.
    body = re.sub(r'(<section\b[^>]*\bdata-na="([^"]+)"[^>]*>\s*<h2>.*?</h2>)(?!\s*<p class="ds-na">)',
                  lambda m: f'{m.group(1)}<p class="ds-na">{m.group(2)}</p>', body, flags=re.S)
    leftover = re.search(r"\{\{[^}]*\}\}", body)
    if leftover:
        raise ValueError(f"unexpanded macro {leftover.group(0)}")
    return body


def read_fragment(folder: str, slug: str) -> tuple[dict, str]:
    path = SRC / folder / f"{slug}.html"
    if not path.is_file():
        path = SRC / folder / f"{slug}.fragment"
    if not path.is_file():
        return {"lead": "", "description": "", "missing": True}, ""
    text = path.read_text(encoding="utf-8")
    m = META_RE.match(text)
    meta = json.loads(m.group(1)) if m else {}
    return meta, expand(text[m.end():] if m else text)


def nav() -> str:
    def group(label: str, items: list[tuple[str, str]], folder: str) -> str:
        links = "".join(f'<li><a href="../{folder}/{slug}.html">{esc(title)}</a></li>' for slug, title in items)
        return f"<details open><summary>{label}</summary><ul>{links}</ul></details>"
    parts = [group("Foundations", FOUNDATIONS, "foundations")]
    parts += [group(name, items, "components") for name, items in COMPONENT_GROUPS]
    parts.append(group("Patterns", PATTERNS, "patterns"))
    return ('<nav class="ds-nav" aria-label="Design system"><div class="ds-nav__brand"><a href="../index.html">HairPop DS</a>'
            '<button class="ds-theme-toggle" type="button" aria-pressed="false">☾ Dark</button></div>' + "".join(parts) + "</nav>")


def head(title: str, description: str, prefix: str) -> str:
    return (f'<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            f"<title>{esc(title)} — {PRODUCT} design system</title>\n<meta name=\"description\" content=\"{esc(description)}\">\n"
            f'<link rel="stylesheet" href="{prefix}assets/fonts/fonts.css">\n<link rel="stylesheet" href="{prefix}tokens/tokens.css">\n'
            f'<link rel="stylesheet" href="{prefix}assets/components.css">\n<link rel="stylesheet" href="{prefix}assets/ds.css">\n</head>\n')


def footer(prefix: str) -> str:
    return (f'<footer class="ds-footer"><span>{PRODUCT} design system · extracted from <a href="{prefix}../mocks/index.html">docs/mocks</a> on {EXTRACTED}</span>'
            '<a href="#top">Back to top</a></footer>')


def page(folder: str, slug: str, title: str, kicker: str) -> dict:
    meta, body = read_fragment(folder, slug)
    if meta.get("missing"):
        if "--allow-missing" not in sys.argv:
            raise FileNotFoundError(f"src/{folder}/{slug}.html or .fragment is missing")
        print(f"skipped missing src/{folder}/{slug}.html or .fragment")
        return {"slug": slug, "title": title, "folder": folder, **meta}
    toc = "".join(f'<li><a href="#{sid}">{label}</a></li>' for sid, label in SECTION_RE.findall(body))
    pills = ['<span class="ds-pill ds-pill--ok">WCAG 2.2 AA</span>'] if folder != "foundations" else []
    pills += [f'<span class="ds-pill">{p}</span>' for p in meta.get("pills", [])]
    lead = meta.get("lead", "")
    out = (head(title, meta.get("description", lead), "../") + '<body id="top">\n<a class="skip-link" href="#main">Skip to content</a>\n<div class="ds-shell">\n'
           + nav() + '\n<main id="main" class="ds-main">\n<header class="ds-header">'
           f'<p class="ds-kicker">{esc(kicker)}</p><h1>{esc(title)}</h1><p class="ds-lead">{lead}</p>'
           + (f'<div class="ds-meta">{"".join(pills)}</div>' if pills else "")
           + f'<ul class="ds-toc">{toc}</ul></header>\n{body.strip()}\n{footer("../")}\n</main>\n</div>\n<script src="../assets/ds.js"></script>\n</body>\n</html>\n')
    (ROOT / folder).mkdir(exist_ok=True)
    (ROOT / folder / f"{slug}.html").write_text(out, encoding="utf-8")
    return {"slug": slug, "title": title, "folder": folder, **meta}


def cards(entries: list[dict]) -> str:
    return '<div class="ds-cards">' + "".join(
        f'<a class="ds-card" href="{e["folder"]}/{e["slug"]}.html"><b>{esc(e["title"])}</b><span>{esc(e.get("description", ""))}</span></a>' for e in entries) + "</div>"


def index(foundations: list[dict], components: list[dict], patterns: list[dict]) -> None:
    by_slug = {e["slug"]: e for e in foundations + components + patterns}
    start = [by_slug[s] for s in ("color", "typography", "layout", "button", "form-field", "dialog")]
    groups = "".join(f'<h3>{esc(name)}</h3>' + cards([by_slug[s] for s, _ in items]) for name, items in COMPONENT_GROUPS)
    body = f'''<header class="ds-header"><p class="ds-kicker">Design system</p><h1>{PRODUCT} design system</h1>
<p class="ds-lead">The visual and interaction language of HairPop, written down once: tokens, foundations, {len(components)} components and {len(patterns)} patterns, extracted from the customer-journey mocks so every screen built from here is consistent without re-deciding it.</p>
<div class="ds-meta"><span class="ds-pill ds-pill--ok">WCAG 2.2 AA, both themes</span><span class="ds-pill">Light and dark</span><span class="ds-pill">Extracted {EXTRACTED}</span></div>
<ul class="ds-toc"><li><a href="#start">Start here</a></li><li><a href="#foundations">Foundations</a></li><li><a href="#components">Components</a></li><li><a href="#patterns">Patterns</a></li><li><a href="#use">How to use</a></li><li><a href="#provenance">Provenance</a></li></ul></header>
<section class="ds-section" id="start"><h2><a href="#start">Start here</a></h2><p>New to the system? These six pages hold most of the decisions you will need on day one.</p>{cards(start)}</section>
<section class="ds-section" id="foundations"><h2><a href="#foundations">Foundations</a></h2><p>The decisions every component inherits: colour, type, space, layout, elevation, shape, motion, icons, theming, responsive rules, accessibility and content.</p>{cards(foundations)}</section>
<section class="ds-section" id="components"><h2><a href="#components">Components</a></h2><p>Every component documents anatomy, variants, sizes, the full state matrix in both themes, responsive behaviour, accessibility, content rules, do and don't, tokens and code.</p>{groups}</section>
<section class="ds-section" id="patterns"><h2><a href="#patterns">Patterns</a></h2><p>How components combine to do a job, and the rules that span them.</p>{cards(patterns)}</section>
<section class="ds-section" id="use"><h2><a href="#use">How to use</a></h2>
<ol><li>Link the fonts, the tokens and the component CSS, in that order:<pre><code>&lt;link rel="stylesheet" href="assets/fonts/fonts.css"&gt;
&lt;link rel="stylesheet" href="tokens/tokens.css"&gt;
&lt;link rel="stylesheet" href="assets/components.css"&gt;</code></pre></li>
<li>Use the class names and attributes from each component's <b>Code</b> section. They are the mocks' BEM classes, so end-to-end locators written against the mocks keep working.</li>
<li>Read tokens by role (<code>var(--color-fg-muted)</code>, <code>var(--space-4)</code>), never by value. To re-skin one component, override its component tokens (<code>--btn-bg</code>, <code>--card-padding</code>); to change a theme, override semantic tokens only.</li>
<li>Generate platform constants from <a href="tokens/tokens.json">tokens/tokens.json</a> (DTCG format; dark values under <code>$extensions</code>).</li>
<li>Press <kbd>t</kbd> or use the toggle in the sidebar to switch every page between light and dark.</li></ol></section>
<section class="ds-section" id="provenance"><h2><a href="#provenance">Provenance</a></h2><p>Extracted on {EXTRACTED} from the 181 HairPop customer-journey mocks in <a href="../mocks/index.html">docs/mocks</a> (33 screens: 22 pages, 7 dialogs, 4 notification sets). Every value traces to a mock or to a correction logged in the <a href="README.md">README</a> drift table. Pages are generated by <code>build.py</code> from the fragments in <code>src/</code>.</p></section>
{footer("")}'''
    out = (head(f"{PRODUCT} design system", "Tokens, foundations, components and patterns for HairPop, extracted from the customer-journey mocks.", "")
           + '<body id="top">\n<a class="skip-link" href="#main">Skip to content</a>\n<div class="ds-shell">\n' + nav().replace('href="../', 'href="')
           + f'\n<main id="main" class="ds-main">\n{body}\n</main>\n</div>\n<script src="assets/ds.js"></script>\n</body>\n</html>\n')
    (ROOT / "index.html").write_text(out, encoding="utf-8")


def md_cell(text: str) -> str:
    return re.sub(r"<[^>]+>", "", str(text)).replace("|", "\\|").strip()


def readme(foundations: list[dict], components: list[dict], patterns: list[dict]) -> None:
    lines = [f"# {PRODUCT} design system", "",
             f"Extracted from [docs/mocks](../mocks/README.md) on {EXTRACTED}. Open [index.html](index.html) locally; every page works from disk.",
             "", "Pages are generated: edit the fragments in `src/`, then run `python docs/design-system/build.py`.", "",
             "## Foundations", "", "| Page | Covers |", "|---|---|"]
    lines += [f"| [{e['title']}]({e['folder']}/{e['slug']}.html) | {md_cell(e.get('covers', e.get('description', '')))} |" for e in foundations]
    lines += ["", "## Components", "", "| Component | Group | Variants | States | Source mocks |", "|---|---|---|---|---|"]
    for e in components:
        sources = ", ".join(f"[{s}](../mocks/{s}.html)" for s in e.get("sources", [])) or "core set (not yet in a mock)"
        lines.append(f"| [{e['title']}]({e['folder']}/{e['slug']}.html) | {e['group']} | {md_cell(e.get('variants', ''))} | {md_cell(e.get('states', ''))} | {sources} |")
    lines += ["", "## Patterns", "", "| Pattern | Covers |", "|---|---|"]
    lines += [f"| [{e['title']}]({e['folder']}/{e['slug']}.html) | {md_cell(e.get('covers', e.get('description', '')))} |" for e in patterns]
    lines += ["", "## Tokens", "",
              "- [`tokens/tokens.css`](tokens/tokens.css) — the source of truth: primitives, semantic tokens, light and dark themes, reduced-motion, high-contrast and forced-colours overrides.",
              "- [`tokens/tokens.json`](tokens/tokens.json) — DTCG export generated from `tokens.css` (`tokens_to_json.py`); dark values under `$extensions`.",
              "- [`tokens/contrast-pairs.json`](tokens/contrast-pairs.json) — every foreground/background pairing the components rely on, checked in both themes.",
              "- [`assets/components.css`](assets/components.css) — the component stylesheet; token-driven, with `data-state` hooks for static state previews.",
              "- [`assets/fonts/`](assets/fonts/fonts.css) — local Manrope and JetBrains Mono (SIL OFL 1.1).", ""]
    for extra in ("drift.md", "verification.md"):
        path = SRC / extra
        if path.is_file():
            lines += [path.read_text(encoding="utf-8").strip(), ""]
    (ROOT / "README.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    foundations = [page("foundations", s, t, "Foundation") for s, t in FOUNDATIONS]
    components = [{**page("components", s, t, f"Component · {g}"), "group": g} for s, t, g in COMPONENTS]
    patterns = [page("patterns", s, t, "Pattern") for s, t in PATTERNS]
    index(foundations, components, patterns)
    readme(foundations, components, patterns)
    print(f"built {len(foundations)} foundations, {len(components)} components, {len(patterns)} patterns, index.html and README.md")


if __name__ == "__main__":
    main()
