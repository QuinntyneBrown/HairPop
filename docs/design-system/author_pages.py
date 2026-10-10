"""Author the design-system fragments that share a structured catalog.

The Button page is hand-authored. This script writes the remaining source
fragments; build.py wraps them in the common navigation and page shell.
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

import build

ROOT = Path(__file__).parent
SRC = ROOT / "src"
MOCKS = ROOT.parent / "mocks"


def esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def section(name: str, body: str, na: str = "") -> str:
    attr = f' data-na="{esc(na)}"' if na else ""
    label = name.replace("-", " ").capitalize()
    return f'<section class="ds-section" id="{name}"{attr}><h2><a href="#{name}">{label}</a></h2>{body}</section>\n'


def write(folder: str, slug: str, meta: dict, sections: list[str]) -> None:
    path = SRC / folder / f"{slug}.fragment"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("<!--meta " + json.dumps(meta, ensure_ascii=False) + " -->\n" + "\n".join(sections), encoding="utf-8")


FOUNDATION_COPY = {
    "color": ("Use semantic roles for meaning; primitive ramps are implementation details.", "The plum accent comes from the customer journey; neutrals, green, amber, and red support surfaces and feedback. Never convey status by colour alone.", "pages/style-gallery/default"),
    "typography": ("Manrope carries interface copy and display; JetBrains Mono is reserved for code and measurements.", "Use the named text roles instead of choosing font size, weight, and line height independently. Keep prose near the measure token so descriptions remain scannable.", "pages/style-detail/default"),
    "spacing": ("A four-pixel rhythm governs related content and section separation.", "Use the compact steps inside controls, medium steps between related fields, and larger steps between sections. The half-step supports optical alignment only.", "pages/booking-request/default"),
    "layout": ("Content follows a mobile-first grid with capped reading width.", "The container margin protects the viewport edge; gutters separate columns. Four columns on phones become eight at tablet width and twelve on desktop.", "pages/style-gallery/default"),
    "elevation": ("Surface roles and four shadow levels communicate layering.", "Cards use the first shadow, menus and toasts the second, dialogs the third, and exceptional overlays the fourth. Z-order tokens prevent local stacking contests.", "dialogs/request-review/default"),
    "shape": ("Radius and border roles connect controls, cards, and overlays.", "Choose the radius by component scale; reserve the full radius for pills and avatars. Keep control height and target size independent of decoration.", "pages/account-settings/default"),
    "motion": ("Motion confirms a change without delaying the next task.", "Fast transitions cover hover and focus; deliberate motion is for opening an overlay. Reduced-motion preferences remove nonessential movement while leaving busy status perceivable.", "notifications/booking-update/success"),
    "iconography": ("Simple stroked icons support labels and status messages.", "Use a 24-unit viewBox, a two-unit stroke, rounded caps and joins, and currentColor. Decorative icons are hidden from assistive technology; icon-only controls need a name.", "dialogs/cancel-appointment/default"),
    "theming": ("Light and dark themes map the same semantic roles to different values.", "Set data-theme on the shell for an explicit choice; otherwise the system preference applies. Components read role tokens and require no theme-specific selectors.", "pages/style-gallery/default"),
    "responsive": ("The same journey stays usable from narrow phones to wide desktops.", "At 360 pixels, cards and forms stack. At 768 pixels, the grid gains eight columns and larger margins; at 1024 pixels it gains twelve. Dialogs become full-width sheets on small screens.", "pages/matching-braiders/default"),
    "accessibility": ("Accessible semantics are part of each component contract.", "Use native controls, visible focus, programmatic labels and errors, logical focus order, and status announcements. Test keyboard operation, 200% text zoom, 400% browser zoom, reduced motion, and both themes against WCAG 2.2 AA.", "pages/booking-request/invalid"),
    "content": ("Copy helps customers understand what is known and what happens next.", "Use sentence case and concrete verbs. Call prices estimates until accepted; do not call a request confirmed before braider acceptance. Error copy says what happened and offers one recovery action.", "pages/appointment-detail/default"),
}


def token_groups() -> dict[str, list[str]]:
    names = list(dict.fromkeys(re.findall(r"^\s*(--[\w-]+)\s*:", (ROOT / "tokens/tokens.css").read_text(encoding="utf-8"), re.M)))
    groups = {key: [] for key in FOUNDATION_COPY}
    for name in names:
        if name.startswith(("--palette-", "--color-")):
            group = "color"
        elif name.startswith(("--font-", "--text-", "--letter-spacing-", "--line-height-")):
            group = "typography"
        elif name.startswith("--space-"):
            group = "spacing"
        elif name.startswith("--layout-"):
            group = "layout"
        elif name.startswith(("--shadow-", "--z-")):
            group = "elevation"
        elif name.startswith(("--radius-", "--border-width-", "--control-height-", "--target-", "--focus-ring-")):
            group = "shape"
        elif name.startswith(("--duration-", "--ease-", "--motion-")):
            group = "motion"
        else:
            raise ValueError(f"Unassigned token {name}")
        groups[group].append(name)
    return groups


def foundation_pages() -> None:
    groups = token_groups()
    pairs = json.loads((ROOT / "tokens/contrast-pairs.json").read_text(encoding="utf-8"))
    for slug, (lead, detail, source) in FOUNDATION_COPY.items():
        entries = groups[slug]
        intro = section("overview", f"<p>{esc(detail)}</p><p>The example and rules below derive from <a href=\"../../mocks/{source}.html\">{esc(source)}</a>.</p>")
        if slug == "color":
            pair_items = pairs if isinstance(pairs, list) else pairs.get("pairs", [])
            live = "".join(f'{{{{pair:{esc(p.get("label", p.get("description", "Contrast pair")))}|{p.get("fg", p.get("foreground"))}|{p.get("bg", p.get("background"))}|{p.get("min", p.get("minimum", 4.5))}}}}}' for p in pair_items)
            specific = section("contrast", "<p>Each foreground/background pair is evaluated in light and dark themes. Text uses at least 4.5:1; meaningful graphics and boundaries use at least 3:1.</p>" + live)
        elif slug == "layout":
            specific = section("grid", "<p>Base: four columns, 16px gutter and margin. At 768px: eight columns, 24px gutter and 32px margin. At 1024px: twelve columns, 32px gutter and 48px margin. The content container caps at 1280px.</p><div class=\"grid\"><div class=\"card\">One</div><div class=\"card\">Two</div><div class=\"card\">Three</div></div>")
        elif slug == "responsive":
            specific = section("breakpoints", "<table class=\"ds-table\"><thead><tr><th scope=\"col\">Width</th><th scope=\"col\">Columns</th><th scope=\"col\">Behaviour</th></tr></thead><tbody><tr><td>0–639px</td><td>4</td><td>Stack cards, forms, and detail columns.</td></tr><tr><td>640–767px</td><td>4</td><td>Keep touch controls comfortable.</td></tr><tr><td>768–1023px</td><td>8</td><td>Allow short paired fields and card grids.</td></tr><tr><td>1024–1279px</td><td>12</td><td>Show wide navigation and detail sidebars.</td></tr><tr><td>1280px and above</td><td>12</td><td>Cap content width and centre the container.</td></tr></tbody></table>")
        elif slug == "motion":
            specific = section("reduced-motion", "<p>Transitions follow duration and easing roles. Under <code>prefers-reduced-motion: reduce</code>, suppress decorative movement; preserve progress as text or an announced busy state.</p><button class=\"btn\" type=\"button\" data-state=\"hover\">Replay hover state</button>")
        elif slug == "iconography":
            specific = section("construction", "<p>Icon geometry is stored in <code>build.py</code>. Use <code>currentColor</code> so meaning and contrast follow the surrounding role.</p><div class=\"cluster\">{{icon:search}}{{icon:calendar}}{{icon:check-circle}}{{icon:warning}}</div>")
        elif slug == "accessibility":
            specific = section("checks", "<ul><li>Tab through every control and dialog; Escape returns focus to its trigger.</li><li>Associate help and errors with fields through <code>aria-describedby</code>.</li><li>Announce async success politely and critical errors assertively.</li><li>Check contrast in both themes, target size, reflow, zoom, and reduced motion.</li></ul>")
        elif slug == "content":
            specific = section("microcopy", "<table class=\"ds-table\"><thead><tr><th scope=\"col\">Situation</th><th scope=\"col\">Use</th></tr></thead><tbody><tr><td>Pending request</td><td>Awaiting reply. Nia will confirm the time and final price.</td></tr><tr><td>Estimate</td><td>Estimated price: $180–$240.</td></tr><tr><td>Error</td><td>We couldn’t save this change. Your details remain here. Try again.</td></tr><tr><td>Empty result</td><td>No matches for these filters. Try a wider price range.</td></tr></tbody></table>")
        else:
            specific = section("usage", "<p>Apply the roles shown below to the mock's corresponding parts. Use the semantic token on a product surface; reserve primitive tokens for defining themes.</p>{{themes}}<div class=\"card\"><p class=\"eyebrow\">HairPop</p><h3>Medium knotless braids</h3><p class=\"text-muted\">Typical time: 4–7 hours</p></div>{{/themes}}")
        if entries:
            rows = "".join(f"{{{{tok:{name.removeprefix('--').replace('-', ' ').capitalize()}|{name}}}}}" for name in entries)
            token_section = section("tokens", '<div class="ds-table-wrap"><table class="ds-table"><thead><tr><th scope="col">Role</th><th scope="col">Token</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead><tbody>' + rows + "</tbody></table></div>")
        else:
            token_section = section("tokens", "<p>Iconography, responsive, accessibility, and content rules use the shared tokens documented on the other foundation pages.</p>")
        write("foundations", slug, {"lead": lead, "description": detail, "covers": detail}, [intro, specific, token_section, section("sources", f'<ul>{{{{mock:{source}|source screen}}}}</ul>')])


# Each specimen uses the product classes from assets/components.css. The source
# is a real mock where the component occurs; an empty source means the catalog
# requires a core primitive that the present customer mocks do not display.
COMPONENT_SPECS = {
    "link": ("Navigate to another destination with text that names it.", '<a class="link--standalone" href="../../mocks/pages/style-detail/default.html">Explore knotless braids →</a>', "inline, standalone with icon, external", "one", "visited", "--color-fg-link,--color-fg-link-hover,--color-focus-ring", "pages/style-gallery/default"),
    "menu": ("Offer a short set of contextual actions from one trigger.", '<div class="menu-anchor"><button class="btn" type="button" aria-haspopup="menu" aria-expanded="true">More actions</button><ul class="menu menu--static" role="menu"><li role="none"><button class="menu__item" role="menuitem" type="button">View request</button></li><li role="none"><button class="menu__item menu__item--danger" role="menuitem" type="button">Cancel request</button></li></ul></div>', "icons, shortcuts, sections, danger item, checkable item", "one", "open, checked, disabled item", "--color-bg-surface-raised,--color-bg-subtle,--shadow-3,--z-dropdown", ""),
    "text-field": ("Collect one line of customer information with a visible label.", '<label class="field">Your email<input class="input" type="email" value="maya.chen@example.com"></label>', "text, email, password, number, search, prefix or suffix, icon, counter", "sm, md, lg", "invalid, read-only, required", "--color-bg-surface,--color-border-strong,--color-danger-solid,--control-height-md", "pages/account-settings/default"),
    "textarea": ("Collect longer hair details or written review text.", '<label class="field">Hair details<textarea class="textarea" rows="3">Shoulder length; bringing my own extensions.</textarea></label>', "auto-grow, counter", "md", "invalid, read-only", "--color-bg-surface,--color-border-strong,--color-danger-solid,--space-3", "pages/booking-request/default"),
    "select": ("Choose one value from a finite list with a native control.", '<label class="field">Service<select class="select"><option>Medium knotless braids</option><option>Passion twists</option></select></label>', "native, placeholder option", "sm, md, lg", "invalid, disabled", "--color-bg-surface,--color-border-strong,--control-height-md", "pages/booking-request/default"),
    "checkbox": ("Choose one or more independent options.", '<label class="choice"><input type="checkbox" checked><span class="choice__text">Remember my optional usage choices</span></label>', "single, group, with description", "one", "checked, indeterminate, invalid", "--color-accent,--color-border-strong,--target-min", "dialogs/cookie-preferences/default"),
    "radio-group": ("Choose exactly one option from a named set.", '<fieldset class="choice-group"><legend>Preferred appointment</legend><label class="choice"><input type="radio" name="time-preview" checked><span>Sat 24 Oct, 10:00 am</span></label><label class="choice"><input type="radio" name="time-preview"><span>Sun 25 Oct, 11:00 am</span></label></fieldset>', "vertical, horizontal, card style", "one", "checked, invalid", "--color-accent,--color-border-strong,--space-3", ""),
    "switch": ("Turn a setting on or off immediately.", '<label class="switch"><input type="checkbox" role="switch" checked><span>Optional usage information</span></label>', "label left, label right, description", "one", "on, off, disabled", "--color-accent,--color-border-strong,--color-bg-surface", "dialogs/cookie-preferences/default"),
    "form-field": ("Keep a label, control, help, error and count together.", '<label class="field"><span class="field__label">Your email</span><input class="input" type="email" aria-describedby="field-help-preview"><span class="field__help" id="field-help-preview">Used for booking updates.</span></label>', "label and help, label and error, counter", "one", "invalid, required", "--space-1,--space-2,--color-fg-muted,--color-danger-fg", "pages/account-settings/invalid"),
    "form-layout": ("Arrange related fields and actions in a readable form.", '<form class="form-layout"><label class="field">Name<input class="input" value="Maya Chen"></label><label class="field">Phone<input class="input" type="tel" value="416-555-0148"></label><div class="form-actions"><button class="btn btn--primary" type="submit">Save changes</button></div></form>', "single column, paired fields, inline, actions bar, error summary", "one", "submitting, invalid", "--layout-form-max,--space-4,--space-6,--color-danger-bg", "pages/account-settings/default"),
    "top-bar": ("Keep primary navigation and account actions consistently placed.", '<header class="topbar"><a class="topbar__brand" href="../../mocks/index.html">✦ HairPop</a><nav class="topbar__nav" aria-label="Primary"><a class="nav-link" href="../../mocks/pages/style-gallery/default.html" aria-current="page">Styles</a><a class="nav-link" href="../../mocks/pages/matching-braiders/default.html">Braiders</a></nav></header>', "search, actions, tabs, compact mobile", "one", "current", "--layout-topbar-height,--color-bg-surface,--color-fg-accent", "pages/style-gallery/default"),
    "sidebar-navigation": ("Navigate grouped sections in a wide application shell.", '<nav class="sidebar" data-open="true" aria-label="Account"><span class="sidebar__group">Account</span><a class="nav-link" href="../../mocks/pages/my-appointments/default.html" aria-current="page">Appointments</a><a class="nav-link" href="../../mocks/pages/account-settings/default.html">Settings</a></nav>', "grouped, collapsible, badges, collapsed icons", "one", "current, expanded", "--layout-sidebar-width,--color-bg-surface,--color-fg-accent", ""),
    "tabs": ("Switch between panels at the same level without changing task context.", '<div class="tabs" role="tablist" aria-label="Appointments"><button class="tab" role="tab" type="button" aria-selected="true">Upcoming</button><button class="tab" role="tab" type="button" aria-selected="false">Past</button></div>', "underline, pill, counts, scrollable", "sm, md", "selected, disabled", "--color-fg-accent,--color-border-default,--control-height-md", ""),
    "breadcrumb": ("Show location within a nested journey.", '<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="../../mocks/pages/style-gallery/default.html">Styles</a></li><li><span aria-current="page">Knotless braids</span></li></ol></nav>', "full, collapsed parent", "one", "current", "--color-fg-muted,--color-fg-link,--space-2", "pages/style-detail/default"),
    "pagination": ("Move between bounded result pages.", '<nav class="pagination" aria-label="Pagination"><a href="../../mocks/pages/style-gallery/default.html">Previous</a><a href="../../mocks/pages/style-gallery/long.html" aria-current="page">2</a><a href="../../mocks/pages/style-gallery/long.html">Next</a></nav>', "numbered, previous and next, page size", "one", "current, disabled", "--color-accent-subtle,--color-fg-accent,--target-min", "pages/style-gallery/long"),
    "page-header": ("Introduce a screen before its actions and content.", '<div class="page-header"><div><p class="eyebrow">Discover</p><h2>Find a style that feels like you</h2><p class="subtitle">Browse protective styles and compare the details.</p></div></div>', "title and description, with actions, with eyebrow", "one", "default", "--text-h1,--color-fg-muted,--space-4", "pages/style-gallery/default"),
    "footer": ("Hold secondary navigation and legal destinations.", '<footer class="site-footer"><span>HairPop · Made for confident hair decisions</span><span><a href="../../mocks/pages/terms/default.html">Terms</a> · <a href="../../mocks/pages/privacy/default.html">Privacy</a></span></footer>', "simple, multi-column", "one", "default", "--color-border-default,--color-fg-muted,--space-4", "pages/style-gallery/default"),
    "skip-link": ("Let keyboard users move directly to the main content.", '<a class="skip-link" href="#main">Skip to content</a>', "visible on focus", "one", "focused", "--color-focus-ring,--color-bg-surface-raised,--z-skip-link", "pages/style-gallery/default"),
    "card": ("Group one style, braider, appointment, or information unit.", '<article class="card"><p class="eyebrow">Most explored</p><h3 class="card__title">Knotless braids</h3><p>Gentle at the root · 4–7 hours.</p><a href="../../mocks/pages/style-detail/default.html">Explore knotless braids</a></article>', "default, interactive, header and footer, flush media, selected", "one", "hover, selected", "--color-bg-surface,--color-border-default,--radius-lg,--shadow-1", "pages/style-gallery/default"),
    "dialog": ("Ask for a focused decision while preserving the parent screen.", '<div class="dialog dialog--inline" role="dialog" aria-modal="true" aria-labelledby="dialog-preview-title"><div class="dialog__panel"><div class="dialog__header"><h3 id="dialog-preview-title">Cancel request?</h3></div><div class="dialog__body">Nia will see that you no longer need this time.</div><div class="dialog__footer"><button class="btn" type="button">Keep request</button><button class="btn btn--danger" type="button">Cancel request</button></div></div></div>', "default, destructive, form, scrollable, mobile sheet", "sm, md, lg", "busy, invalid, failed", "--color-bg-surface-raised,--shadow-3,--z-modal,--radius-lg", "dialogs/cancel-appointment/default"),
    "tooltip": ("Explain a compact control on hover and focus.", '<span class="tooltip-anchor"><button class="btn btn--icon" type="button" aria-label="More information" aria-describedby="tooltip-preview">ⓘ</button><span class="tooltip tooltip--static" id="tooltip-preview" role="tooltip">Estimated price</span></span>', "text, shortcut", "one", "visible", "--color-bg-inverse,--color-fg-inverse,--z-tooltip", ""),
    "divider": ("Separate related groups without adding another card.", '<div class="stack"><p>Service</p><hr class="divider"><p>Preparation</p></div>', "horizontal, vertical, labelled", "one", "default", "--color-border-default,--space-4", ""),
    "container": ("Align content with the shared responsive grid and spacing primitives.", '<div class="container"><div class="feature-grid"><div class="card">Style</div><div class="card">Braider</div></div></div>', "container, grid, stack, cluster", "one", "default", "--layout-container-max,--layout-gutter,--layout-margin,--space-4", "pages/style-gallery/default"),
    "table": ("Compare structured records with real column headers.", '<div class="table-wrap"><table class="table"><caption>Appointments</caption><thead><tr><th scope="col">Braider</th><th scope="col">Status</th></tr></thead><tbody><tr><td>Nia Okafor</td><td>Awaiting reply</td></tr></tbody></table></div>', "default, dense, sortable, selectable, row actions, sticky, expandable, responsive", "sm, md", "loading, empty, error, row hover, selected", "--color-bg-surface-sunken,--color-border-default,--space-3", ""),
    "list": ("Show a sequence of related items with optional actions.", '<ul class="list"><li><a href="../../mocks/pages/appointment-detail/default.html">Nia Okafor · medium knotless braids</a></li><li><a href="../../mocks/pages/care-and-review/default.html">Care and review</a></li></ul>', "simple, two-line, icon, interactive, divided", "one", "hover, selected", "--color-border-default,--color-bg-subtle,--space-3", "pages/my-appointments/default"),
    "description-list": ("Pair facts and their labels in appointment detail.", '<dl class="dl"><div><dt>Service</dt><dd>Medium knotless braids</dd></div><div><dt>Typical duration</dt><dd>About five hours</dd></div></dl>', "horizontal, vertical", "one", "default", "--color-fg-muted,--space-2,--space-4", "pages/appointment-detail/default"),
    "avatar": ("Identify a braider when a photo is unavailable or compact.", '<span class="avatar" aria-label="Nia Okafor">NO</span>', "image, initials, icon, group, status dot", "sm, md, lg", "default", "--color-accent-subtle,--color-fg-accent,--radius-full", "pages/braider-profile/default"),
    "badge": ("Display a short, explicit status beside an item.", '<span class="badge badge--warning">Awaiting reply</span>', "neutral, info, success, warning, danger, solid, count", "one", "default", "--color-warning-bg,--color-warning-fg,--radius-full", "pages/my-appointments/default"),
    "chip": ("Show or change a compact filter choice.", '<button class="chip" type="button" aria-pressed="true">Braids</button>', "filter, removable input, static", "sm, md", "selected, hover", "--color-accent-subtle,--color-fg-accent,--radius-full", "pages/style-gallery/default"),
    "stat": ("Highlight one numerical fact with its label.", '<div class="fact"><strong class="fact__value">4.9 ★</strong><span class="fact__label">From 86 reviews</span></div>', "delta, sparkline placeholder", "one", "loading", "--text-h3,--color-fg-muted,--space-1", "pages/braider-profile/default"),
    "toast": ("Confirm or explain the result of a recent action.", '<div class="toast-region toast-region--inline" role="status"><div class="toast toast--success"><div class="toast__body"><strong class="toast__title">Time confirmed</strong><span class="toast__text">Nia confirmed Sat 24 Oct at 10:00 am.</span></div><button class="close" type="button" aria-label="Dismiss notification">×</button></div></div>', "info, success, warning, danger, action, stacked", "one", "leaving, persistent", "--color-bg-inverse,--color-fg-inverse,--shadow-2,--z-toast", "notifications/booking-update/success"),
    "alert": ("Keep important page-level or inline information visible.", '<div class="alert alert--warning" role="status"><div class="alert__body"><strong class="alert__title">Some details are unavailable.</strong><p>Reviews could not load. Retry reviews.</p></div></div>', "info, success, warning, danger, page banner, actions", "one", "persistent, dismissible", "--color-warning-bg,--color-warning-fg,--color-warning-border", "pages/braider-profile/partial"),
    "inline-message": ("Explain a field or its validation result next to the field.", '<span class="field__error" id="inline-preview">Choose an offered time.</span>', "hint, error, success", "one", "invalid", "--color-danger-fg,--color-fg-muted,--text-body-sm", "pages/booking-request/invalid"),
    "progress-bar": ("Show known completion or an unknown duration without hiding context.", '<div class="progress-field"><div class="progress-field__label"><span>Upload</span><output>60%</output></div><div class="progress" role="progressbar" aria-label="Upload" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60"><div class="progress__bar" style="--value: 60%"></div></div></div>', "determinate, indeterminate, labelled, success, danger", "one", "busy, complete", "--color-accent,--color-bg-subtle-hover,--duration-deliberate", ""),
    "spinner": ("Show brief indeterminate work alongside meaningful loading text.", '<span class="spinner-inline" role="status"><span class="spinner" aria-hidden="true"></span><span>Loading appointments</span></span>', "sm, md, lg, inline", "sm, md, lg", "busy", "--color-accent,--color-border-default,--duration-loop-spin", "pages/my-appointments/loading"),
    "skeleton": ("Reserve the shape of content while its data is loading.", '<div class="card" aria-busy="true"><div class="skeleton skeleton--title" aria-hidden="true"></div><div class="skeleton skeleton--text" aria-hidden="true"></div><div class="skeleton skeleton--text" aria-hidden="true"></div></div>', "text, title, circle, rect, card", "one", "loading", "--color-bg-subtle,--duration-loop-shimmer,--radius-md", "pages/style-gallery/loading"),
    "empty-state": ("Explain the absence of content and provide one useful next step.", '<section class="empty"><div class="empty__icon" aria-hidden="true">✦</div><h3 class="empty__title">Nothing here yet</h3><p class="empty__text">Explore styles to find your next visit.</p><a class="btn btn--primary" href="../../mocks/pages/style-gallery/default.html">Explore styles</a></section>', "first run, no results, permission, error", "compact, full", "empty", "--color-fg-muted,--space-6,--text-h2", "pages/my-appointments/empty"),
    "error-page": ("Give a safe way forward when a whole page cannot be used.", '<section class="empty empty--error"><div class="empty__icon" aria-hidden="true">!</div><h3 class="empty__title">HairPop needs a moment</h3><p class="empty__text">We couldn’t load this page.</p><a class="btn btn--primary" href="../../mocks/pages/style-gallery/default.html">Explore styles</a></section>', "404, 403, 500, offline, maintenance", "one", "error, offline", "--color-danger-fg,--color-fg-muted,--space-6", "pages/server-error/default"),
}

RESPONSIVE_RULES = {
    "top-bar": "Below 768px, hide the horizontal links and expose an explicitly labelled menu trigger. Keep the account action reachable.",
    "sidebar-navigation": "Below 1024px, place the navigation in a drawer controlled by a button with aria-expanded and aria-controls.",
    "tabs": "Allow horizontal scrolling when labels do not fit; tabs stay on one row and focus remains visible.",
    "breadcrumb": "Below 768px, show the current page and immediate parent; put deeper ancestors in an accessible menu.",
    "dialog": "Below 640px, use a full-width sheet with a reachable action footer. At wider widths, centre the panel and cap its width.",
    "table": "Keep a wide table inside its own horizontal scroll region; for four or fewer columns a page may use cards below 768px.",
    "toast": "Below 640px, span the safe viewport width at the bottom. At wider widths, cap the stack at 24rem and align it right.",
    "form-layout": "Use one column on phones. Pair only short, related fields at 768px and wider; keep the submit action after the fields.",
    "page-header": "Below 768px, place actions after the title and description and let the primary action fill the available width.",
    "pagination": "Preserve Previous and Next on narrow screens; collapse the numbered range when space is limited.",
    "container": "Use four columns on phones, eight from 768px, and twelve from 1024px. Read gutter and margin tokens.",
}

KEYBOARD_RULES = {
    "menu": "Enter or Space opens from the trigger; Arrow Up and Arrow Down move among items; Escape closes and returns focus; type-ahead finds an item.",
    "tabs": "Tab enters the tab list; Left and Right arrows move among tabs; Home and End move to the ends; Enter or Space activates in manual mode.",
    "dialog": "Tab and Shift+Tab stay inside the modal; Escape closes unless a destructive operation is committing; closing returns focus to the trigger.",
    "radio-group": "Tab enters the group; arrow keys move selection and focus among enabled options; Space selects the focused option.",
    "checkbox": "Tab reaches the checkbox; Space toggles its checked state.",
    "switch": "Tab reaches the switch; Space toggles its checked state.",
    "select": "Tab reaches the select; native arrows change the option and Escape closes the native popup.",
    "tooltip": "Tab focuses the described trigger; Escape dismisses a visible tooltip without moving focus.",
    "table": "Tab reaches sortable headers, row links, checkboxes, and action buttons in reading order; sorting uses Enter or Space.",
}


def state_markup(markup: str, state: str) -> str:
    if state == "default":
        return markup
    tags = ("button", "input", "select", "textarea", "a")
    match = re.search(r"<(?:" + "|".join(tags) + r")\b", markup)
    if not match:
        match = re.search(r"<\w+\b", markup)
    if not match:
        return markup
    position = match.end()
    attr = f' data-state="{esc(state)}"'
    if state == "disabled" and match.group() in {"<button", "<input", "<select", "<textarea"}:
        attr += " disabled"
    if state == "invalid" and match.group() in {"<input", "<select", "<textarea"}:
        attr += ' aria-invalid="true"'
    if state in {"selected", "pressed", "checked"} and match.group() == "<button":
        attr += ' aria-pressed="true"'
    return markup[:position] + attr + markup[position:]


def component_pages() -> None:
    for slug, title, group in build.COMPONENTS:
        if slug == "button":
            continue
        purpose, preview, variants, sizes, extras, token_csv, source = COMPONENT_SPECS[slug]
        variant_names = [item.strip() for item in variants.split(",")]
        state_names = list(dict.fromkeys(["default", "hover", "focus", "active", "disabled"] + [x.strip() for x in extras.split(",") if x.strip() not in {"default", "one"}]))
        source_list = [source] if source else []
        meta = {"lead": purpose, "description": purpose, "variants": variants, "states": ", ".join(state_names), "sources": source_list, "pills": ["Extracted" if source else "Core primitive · derived"]}
        if source:
            source_intro = f'This component appears in <a href="../../mocks/{source}.html">{esc(source)}</a>.'
            source_body = f'<ul>{{{{mock:{source}|visible specimen}}}}</ul><p>The examples use the corresponding selectors in <a href="../assets/components.css">components.css</a>.</p>'
        else:
            source_intro = 'The customer mocks do not yet show this core primitive. Its roles and states extend the same tokens and interaction rules as the extracted components.'
            source_body = '<p>Core catalog primitive. Derived from <a href="../assets/components.css">the shared component stylesheet</a> and the related mock patterns; no direct screen specimen exists yet.</p>'
        overview = section("overview", f'<p>{esc(purpose)} {source_intro}</p><p>Use it for this job; choose a different component when the interaction or information hierarchy changes.</p>')
        anatomy = section("anatomy", f'<div class="ds-anatomy"><figure class="ds-anatomy__figure">{preview}</figure><ol class="ds-anatomy__list"><li><div><b>Semantic element</b><small>Preserves the native role and browser interaction.</small></div></li><li><div><b>Visible content</b><small>Names the action, value, or status in plain language.</small></div></li><li><div><b>Component class</b><small>Reads shared roles from the token stylesheet.</small></div></li></ol></div>')
        variant_items = "".join(f'<li><strong>{esc(name.capitalize())}</strong> — use this form when the surrounding content calls for {esc(name.strip())} presentation.</li>' for name in variant_names)
        variants_section = section("variants", f'<p>Choose the variant by meaning and context. Keep status or action labels explicit.</p><ul>{variant_items}</ul>{{{{example:Base specimen}}}}{preview}{{{{/example}}}}')
        if sizes == "one":
            sizes_section = section("sizes", "", "This component has one size; it adapts through content and layout tokens.")
        else:
            size_items = "".join(f'<li><strong>{esc(size.strip())}</strong> — align height and padding to the {esc(size.strip())} control role; keep touch targets reachable.</li>' for size in sizes.split(","))
            sizes_section = section("sizes", f'<ul>{size_items}</ul><p>Small, medium, and large control heights are defined by <code>--control-height-sm</code>, <code>--control-height-md</code>, and <code>--control-height-lg</code>.</p>')
        heads = "".join(f'<th scope="col">{esc(x)}</th>' for x in state_names)
        cells = "".join(f'<td>{state_markup(preview, x)}</td>' for x in state_names)
        states_section = section("states", f'<p>The table forces pointer and focus states with <code>data-state</code> for review. Production interactions use native attributes and pseudo-classes.</p><div class="ds-matrix"><table><thead><tr><th scope="col">Specimen</th>{heads}</tr></thead><tbody><tr><th scope="row">{esc(title)}</th>{cells}</tr></tbody></table></div>{{{{themes}}}}{preview}{{{{/themes}}}}')
        responsive = section("responsive", f'<p>{esc(RESPONSIVE_RULES.get(slug, "Keep the component within the 16px phone margin, allow text to wrap without clipping, and preserve a reachable 24px minimum target. At 768px and 1024px, let the containing grid set width rather than adding fixed dimensions."))}</p>')
        theming = section("theming", '<p>The same markup appears in light and dark themes. Use the semantic roles in the token table; override a component token only for a local variation.</p>{{themes}}' + preview + '{{/themes}}')
        keyboard = KEYBOARD_RULES.get(slug, "Tab and Shift+Tab follow DOM order; Enter or Space activates native controls, while links use Enter. Static content remains in reading order.")
        accessible = section("accessibility", f'<h3>Role and keyboard</h3><p>{esc(keyboard)}</p><h3>Focus and labelling</h3><p>Keep the shared visible focus ring. The visible text supplies the accessible name; icon-only actions need an explicit label. Associate help and errors with the relevant control.</p><h3>Contrast, motion, and touch</h3><p>Text uses a 4.5:1 minimum, meaningful controls and focus boundaries use 3:1, and all actions keep a 24px minimum target with comfortable spacing. Reduced motion removes decorative transitions. Check the actual foreground and background pair in both themes on the <a href="../foundations/color.html">Color foundation</a>.</p>')
        content = section("content", f'<p>Use sentence case. For {esc(title.lower())}, keep the wording concrete and close to the value or action it describes. Show “Awaiting reply” until the braider accepts; label a price estimate as an estimate.</p>')
        dodont = section("do-dont", f'<div class="ds-dodont"><figure class="ds-do"><div class="ds-example__canvas">{preview}</div><figcaption>Use the {esc(title.lower())} for its stated job: {esc(purpose.lower())}</figcaption></figure><figure class="ds-dont"><div class="ds-example__canvas"><span class="text-muted">Unclear action</span></div><figcaption>Do not replace the semantic element with unlabelled text or a decorative shape.</figcaption></figure><figure class="ds-do"><div class="ds-example__canvas"><span class="badge badge--warning">Awaiting reply</span></div><figcaption>Pair colour with an explicit state label.</figcaption></figure><figure class="ds-dont"><div class="ds-example__canvas"><span class="dot" aria-hidden="true"></span></div><figcaption>Do not make colour or a dot the only carrier of status.</figcaption></figure></div>')
        token_names = [x.strip() for x in token_csv.split(",")]
        rows = "".join(f'{{{{tok:{esc(name.removeprefix("--").replace("-", " ").capitalize())}|{name}}}}}' for name in token_names)
        tokens = section("tokens", '<div class="ds-table-wrap"><table class="ds-table"><thead><tr><th scope="col">Part</th><th scope="col">Token</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead><tbody>' + rows + '</tbody></table></div>')
        code = section("code", f'<p>Copy the semantic markup and product class; replace the sample content with real data.</p><pre><code>{esc(preview)}</code></pre><p>Forced <code>data-state</code> values are for documentation snapshots only.</p>')
        sources = section("sources", source_body)
        write("components", slug, meta, [overview, anatomy, variants_section, sizes_section, states_section, responsive, theming, accessible, content, dodont, tokens, code, sources])


PATTERN_SPECS = {
    "forms": ("Collect only the details needed for a request or account change.", "Use one column on phones; keep labels above fields and the primary action after them.", "Validate on blur, revalidate on input, focus the error summary on submit, retain values on failure, and keep the submit label during busy work.", "pages/booking-request/invalid", "form-layout"),
    "feedback-and-loading": ("Show progress and outcomes without making customers guess whether an action persisted.", "Use skeletons for page structure, spinners for short local work, inline errors for fields, and toasts for completed actions.", "Busy prevents duplicate submissions; failure retains work; success reflects the durable server result. Important errors persist until resolved.", "pages/booking-request/submitting", "skeleton"),
    "empty-and-error-states": ("Explain absent content and give one safe recovery action.", "Distinguish first-run empty, filtered no-results, partial data, forbidden, offline, and server error.", "Use the applicable mock state; keep any successfully loaded core data in a partial state and retry only the missing region.", "pages/style-gallery/no-results", "empty-state"),
    "navigation": ("Keep the route, page title, and next step understandable across the journey.", "Use a skip link, top bar, page header, breadcrumb when nested, and footer for secondary destinations.", "Current navigation uses aria-current; route changes move focus to the new page heading; browser Back restores the previous context.", "pages/style-gallery/default", "top-bar"),
    "dialogs-and-overlays": ("Interrupt the page only for a focused decision or short edit.", "Use a dialog for confirmation and short forms; use a dedicated page for a long task. Keep one modal layer active at a time.", "Open moves focus inside, Escape or close returns it to the trigger, and busy state blocks repeat confirmation without discarding the form.", "dialogs/cancel-appointment/default", "dialog"),
    "tables-and-lists": ("Choose a presentation that fits the comparison task.", "Use a table when values across records must be compared; use cards or lists for narrative appointment and braider results.", "Loading retains structure; empty and no-results differ; sorted headers announce direction; selected rows retain a visible label.", "pages/my-appointments/long", "list"),
    "notifications": ("Send material updates to the notification center and immediate feedback to the current screen.", "Use a toast for an action result, a banner for persistent page context, and the center for appointment history.", "Success may dismiss after eight seconds and pauses on focus; errors persist. Read and unread states remain explicit.", "notifications/booking-update/stacked", "toast"),
    "content-and-tone": ("Write clear copy that earns confidence without promising unconfirmed details.", "Use concrete verbs, sentence case, local date and time, and an explicit price status: typical, starting, estimated, or confirmed.", "A request is Awaiting reply until accepted. Errors describe what happened, preserve work, and name the next action.", "pages/appointment-detail/default", "badge"),
}


def pattern_pages() -> None:
    for slug, title in build.PATTERNS:
        purpose, structure_rule, states_rule, source, component_slug = PATTERN_SPECS[slug]
        example = COMPONENT_SPECS[component_slug][1]
        meta = {"lead": purpose, "description": purpose, "covers": structure_rule}
        sections = [
            section("overview", f'<p>{esc(purpose)} The reference journey is <a href="../../mocks/{source}.html">{esc(source)}</a>.</p>'),
            section("when", f'<p>{esc(structure_rule)}</p><p>Choose this composition when its information and action hierarchy matches the task; keep a simpler component when one action is sufficient.</p>'),
            section("structure", f'<p>{esc(structure_rule)}</p>{{{{example:Composed example}}}}{example}{{{{/example}}}}'),
            section("states", f'<p>{esc(states_rule)}</p><p>Check default, loading or busy, empty where applicable, validation, success, error, and offline against the relevant mock states.</p>'),
            section("responsive", '<p>At 360px, stack related elements in reading order and keep actions reachable. At 768px, allow compact pairs; at 1024px, use the wider grid without stretching prose beyond the measure token.</p>'),
            section("accessibility", '<p>Use native landmarks and controls. Keep focus visible, follow the visual reading order, announce async results, and associate errors with fields. Modal compositions return focus to their trigger. Check both themes, reflow, zoom, and reduced motion.</p>'),
            section("content", f'<p>{esc(states_rule)} Name the action or state in words; never rely on colour alone. Use the cast, dates, and price language in the source mock as an example, not as live data.</p>'),
            section("do-dont", f'<div class="ds-dodont"><figure class="ds-do"><div class="ds-example__canvas">{example}</div><figcaption>Use the semantic component and explicit text from the source journey.</figcaption></figure><figure class="ds-dont"><div class="ds-example__canvas"><span class="dot" aria-hidden="true"></span></div><figcaption>Do not leave the task or status encoded only in decoration.</figcaption></figure></div>'),
            section("sources", f'<ul>{{{{mock:{source}|source state}}}}</ul><p>See the <a href="../components/{component_slug}.html">{esc(component_slug.replace("-", " "))} component</a> for its individual contract.</p>'),
        ]
        write("patterns", slug, meta, sections)


if __name__ == "__main__":
    foundation_pages()
    component_pages()
    pattern_pages()
