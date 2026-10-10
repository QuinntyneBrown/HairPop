"""Regenerate the static HairPop mock screens from the catalog below.

The mocks render with the design system's stylesheets and markup: every class
comes from docs/design-system/assets/components.css, every icon is the inline
SVG from the design system's ICONS registry, and each component follows its
CRD in docs/specs/components/. Change a component there first, then here.
"""
from __future__ import annotations

import ast
import html
import json
from pathlib import Path

ROOT = Path(__file__).parent
DESIGN_SYSTEM_BUILD = ROOT.parent / "design-system" / "build.py"

PAGES = [
    ("style-gallery", "Style gallery", "/", "Find a style that feels like you", "Browse protective styles, compare typical time and price, and see real work.", "Browse styles", ["default", "loading", "empty", "error", "no-results", "long", "edge", "offline"]),
    ("style-detail", "Knotless braids", "/styles/knotless-braids", "Knotless braids, your way", "A lighter feel at the root, with room to choose length and size.", "Find a braider", ["default", "loading", "empty", "error", "partial", "edge", "offline"]),
    ("matching-braiders", "Matching braiders", "/styles/knotless-braids/braiders", "Braiders for knotless braids", "12 braiders offer this style near Toronto · prices and availability vary.", "View Nia’s profile", ["default", "loading", "empty", "error", "no-results", "long", "edge", "offline"]),
    ("braider-profile", "Nia’s profile", "/braiders/nia-okafor", "Nia Okafor", "Knotless braids and twists in Toronto · 4.9 from 86 reviews.", "Request an appointment", ["default", "loading", "empty", "error", "partial", "edge", "offline"]),
    ("booking-request", "Booking request", "/book/nia-okafor", "Request your appointment", "Nia will review your details and confirm the time and final price.", "Send request", ["default", "loading", "empty", "error", "invalid", "submitting", "success", "offline"]),
    ("appointment-detail", "Appointment detail", "/appointments/hp-1048", "Your appointment with Nia", "Request HP-1048 · Sat 24 Oct at 10:00 am · awaiting Nia’s reply.", "Message Nia", ["default", "loading", "empty", "error", "partial", "success", "offline"]),
    ("my-appointments", "My appointments", "/appointments", "My appointments", "1 request awaiting a reply · 1 completed appointment.", "View request", ["default", "loading", "empty", "error", "no-results", "long", "edge", "offline"]),
    ("care-and-review", "Care and review", "/appointments/hp-0992/care", "Care for your knotless braids", "Your visit with Nia was on Sat 3 Oct · share how it went.", "Post review", ["default", "loading", "empty", "error", "invalid", "submitting", "success", "offline"]),
    ("sign-in", "Sign in", "/sign-in", "Welcome back", "Sign in to manage requests, appointments and reviews.", "Sign in", ["default", "loading", "error", "invalid", "submitting", "success"]),
    ("sign-up", "Create account", "/sign-up", "Join HairPop", "Keep your appointments and trusted braiders in one place.", "Create account", ["default", "loading", "error", "invalid", "submitting", "success"]),
    ("forgot-password", "Forgot password", "/forgot-password", "Reset your password", "We’ll send a secure link to the email on your account.", "Send reset link", ["default", "loading", "error", "invalid", "submitting", "success"]),
    ("reset-password", "Reset password", "/reset-password", "Choose a new password", "Use at least 12 characters for your HairPop account.", "Save password", ["default", "loading", "error", "invalid", "submitting", "success"]),
    ("verify-email", "Verify email", "/verify-email", "Check your email", "We sent a verification link to maya.chen@example.com.", "Resend email", ["default", "loading", "error", "submitting", "success"]),
    ("notification-center", "Notifications", "/notifications", "Notifications", "2 unread updates about your appointments.", "View appointment", ["default", "loading", "empty", "error", "unread", "read", "offline"]),
    ("account-settings", "Account settings", "/settings", "Account settings", "Keep your contact details current so braiders can reach you.", "Save changes", ["default", "loading", "error", "invalid", "submitting", "success", "failed", "offline"]),
    ("help", "Help", "/help", "How can we help?", "Find answers about requests, pricing, changes and reviews.", "Contact support", ["default", "loading", "error", "offline"]),
    ("not-found", "Page not found", "/404", "We couldn’t find that page", "The link may be old, or the address may have changed.", "Explore styles", ["default"]),
    ("forbidden", "Access unavailable", "/403", "You can’t open this page", "Sign in with the account you use for your appointments.", "Sign in", ["default"]),
    ("server-error", "Service error", "/500", "HairPop needs a moment", "We couldn’t load this page. Your booking request has not been resent.", "Try again", ["default"]),
    ("offline", "Offline", "/offline", "You’re offline", "Saved appointment details remain available. Requests need a connection.", "Try again", ["default"]),
    ("terms", "Terms of use", "/terms", "Terms of use", "How HairPop helps customers and independent braiders connect.", "Explore styles", ["default", "loading", "error"]),
    ("privacy", "Privacy", "/privacy", "Privacy at HairPop", "What information is used when you browse, request and review.", "Explore styles", ["default", "loading", "error"]),
]

# (id, title, opens from, description, states, reason when invalid is not applicable)
DIALOGS = [
    ("filter-braiders", "Filter braiders", "matching-braiders", "Choose the travel distance and price range that work for you.", ["default", "busy", "invalid", "failed"], None),
    ("request-review", "Review request", "booking-request", "Check your details before Nia receives your request.", ["default", "busy", "failed"], "This confirmation dialog has no inputs; the booking form validates before it opens."),
    ("cancel-appointment", "Cancel request HP-1048?", "appointment-detail", "Nia will see that you no longer need Sat 24 Oct at 10:00 am. You can send a new request later.", ["default", "busy", "failed"], "This destructive confirmation has no inputs."),
    ("change-appointment", "Request a change", "appointment-detail", "Tell Nia which new time works for you.", ["default", "busy", "invalid", "failed"], None),
    ("report-review", "Report a review", "braider-profile", "Tell us why this review needs a closer look.", ["default", "busy", "invalid", "failed"], None),
    ("sign-out", "Sign out?", "account-settings", "You can return to browse styles at any time.", ["default", "busy"], "This destructive confirmation has no inputs."),
    ("cookie-preferences", "Cookie preferences", "style-gallery", "Choose whether HairPop may remember optional usage information.", ["default", "busy", "failed"], "A single optional checkbox has no invalid answer."),
]

NOTIFICATIONS = [
    ("booking-update", "Booking update", "appointment-detail"),
    ("review-feedback", "Review feedback", "care-and-review"),
    ("account-feedback", "Account feedback", "account-settings"),
    ("cookie-consent", "Cookie consent", "style-gallery"),
]
NOTIFICATION_STATES = ["info", "success", "warning", "danger", "with-action", "stacked", "persistent"]

PAGE_MAP = {p[0]: p for p in PAGES}
NAV = [("style-gallery", "Styles"), ("matching-braiders", "Braiders"), ("my-appointments", "Appointments"), ("help", "Help")]
AUTH_SCREENS = {"sign-in", "sign-up", "forgot-password", "reset-password", "verify-email"}
ERROR_PAGES = {"not-found", "forbidden", "server-error", "offline"}
FORM_SCREENS = {"booking-request", "care-and-review", "sign-in", "sign-up", "forgot-password", "reset-password", "verify-email", "account-settings"}
READ_SCREENS = {"style-gallery", "style-detail", "matching-braiders", "braider-profile", "appointment-detail", "my-appointments", "notification-center", "help"}
EYEBROWS = {
    **dict.fromkeys(["style-gallery", "style-detail", "matching-braiders", "braider-profile"], "Discover"),
    **dict.fromkeys(["booking-request", "appointment-detail", "my-appointments", "care-and-review"], "Appointments"),
    **dict.fromkeys(["notification-center", "account-settings"], "Account"),
}


def load_icons():
    """Read the ICONS registry from the design system build, the single source of icon paths."""
    tree = ast.parse(DESIGN_SYSTEM_BUILD.read_text(encoding="utf-8"))
    for node in tree.body:
        if isinstance(node, ast.Assign) and any(getattr(t, "id", None) == "ICONS" for t in node.targets):
            return ast.literal_eval(node.value)
    raise SystemExit("ICONS not found in docs/design-system/build.py")


ICONS = load_icons()


def esc(value):
    return html.escape(str(value), quote=True)


def attribute(name, value, active=True):
    return f' {name}="{esc(value)}"' if active else ''


def href(screen, kind="page"):
    folder = {"page": "pages", "dialog": "dialogs", "notification": "notifications"}[kind]
    return f"../../{folder}/{screen}/default.html"


def icon(name, extra="", label=None):
    cls = "icon" + (f" {extra}" if extra else "")
    a11y = f' role="img" aria-label="{esc(label)}"' if label else ' aria-hidden="true"'
    return f'<svg class="{cls}"{a11y} viewBox="0 0 24 24"><path d="{ICONS[name]}"/></svg>'


STAR = icon("star", "icon--sm icon--fill", "out of 5 stars")


def anchor(label, target, primary=False, kind="page"):
    return f'<a class="btn{" btn--primary" if primary else ""}" href="{href(target, kind)}">{esc(label)}</a>'


def alert(tone, glyph, title, text, *, actions="", role=None, extra=""):
    acts = f'<div class="alert__actions">{actions}</div>' if actions else ''
    return f'<div class="alert alert--{tone}{" " + extra if extra else ""}"{attribute("role", role, bool(role))}>{icon(glyph)}<div class="alert__body"><p class="alert__title">{esc(title)}</p><p>{esc(text)}</p>{acts}</div></div>'


# ---------------------------------------------------------------- shell

def breadcrumb(screen, state):
    if state in ("loading", "error"):
        return ''
    crumbs = {
        "style-detail": [("Styles", "style-gallery")],
        "braider-profile": [("Braiders", "matching-braiders")],
        "appointment-detail": [("Appointments", "my-appointments")],
        "matching-braiders": [("Styles", "style-gallery"), ("Knotless braids", "style-detail")],
    }.get(screen)
    if not crumbs:
        return ''
    current = {"style-detail": "Knotless braids", "braider-profile": "Nia Okafor", "appointment-detail": "HP-1048", "matching-braiders": "Braiders"}[screen]
    items = ''.join(f'<li><a href="{href(target)}">{icon("chevron-left", "icon--sm") if i == len(crumbs) - 1 else ""}{esc(label)}</a></li>' for i, (label, target) in enumerate(crumbs))
    return f'<nav class="breadcrumb" aria-label="Breadcrumb"><ol>{items}<li><span aria-current="page">{esc(current)}</span></li></ol></nav>'


def page_header(screen, state):
    p = PAGE_MAP[screen]
    eyebrow = f'<p class="eyebrow">{esc(EYEBROWS[screen])}</p>' if screen in EYEBROWS else ''
    actions = f'<div class="page-header__actions">{anchor("Book a style", "style-gallery", True)}</div>' if screen == "my-appointments" and state in ("default", "long", "edge", "offline") else ''
    return f'<div class="page-header"><div>{eyebrow}<h1 tabindex="-1">{esc(p[3])}</h1><p class="subtitle">{esc(p[4])}</p></div>{actions}</div>'


def shell(screen, state, *, inert=False):
    signed_out = screen in AUTH_SCREENS
    nav = "".join(f'<a class="nav-link" href="{href(i)}"{attribute("aria-current", "page", i == screen)}>{esc(label)}</a>' for i, label in NAV)
    if signed_out:
        updates = ''
        account = f'<a class="account-link topbar__account" href="{href("sign-in")}">Sign in</a>'
    else:
        if screen == "notification-center" and state in ("read", "empty"):
            updates = f'<a class="account-link" href="{href("notification-center")}">Updates</a>'
        else:
            updates = f'<a class="account-link" href="{href("notification-center")}">Updates <span class="badge badge--count">2</span><span class="visually-hidden">, 2 unread</span></a>'
        account = f'<a class="account-link topbar__account" href="{href("account-settings")}">Maya</a>'
    menu = f'<button class="btn btn--ghost btn--icon topbar__menu" type="button" aria-label="Menu" aria-expanded="false" aria-controls="primary-panel">{icon("menu")}</button>'
    banner = ''
    if state == "offline" and screen in READ_SCREENS:
        banner = alert("warning", "wifi-off", "You’re offline", "Saved details are shown. Actions need a connection.", role="status", extra="banner")
    if screen in ERROR_PAGES:
        main_inner = content(screen, state)
    else:
        main_inner = breadcrumb(screen, state) + page_header(screen, state) + content(screen, state)
    footer_links = ''.join(f'<li><a class="link link--inherit" href="{url}"{extra}>{label}</a></li>' for label, url, extra in [
        ("Help", href("help"), ''), ("Cookie preferences", href("cookie-preferences", "dialog"), ' aria-haspopup="dialog"'), ("Terms", href("terms"), ''), ("Privacy", href("privacy"), '')])
    return f'''<div{attribute("inert", "", inert)}{attribute("aria-hidden", "true", inert)}><a class="skip-link" href="#main">Skip to content</a><div class="product-shell">
<header class="topbar"><a class="topbar__brand" href="{href('style-gallery')}">{icon("sparkle")}HairPop</a><nav class="topbar__nav" aria-label="Primary">{nav}</nav><span class="topbar__spacer"></span>{updates}{menu}{account}</header>
{banner}<main id="main" class="container product-main">{main_inner}</main>
<footer class="site-footer"><p>HairPop · Made for confident hair decisions</p><ul class="site-footer__links">{footer_links}</ul></footer>
</div></div>'''


# ---------------------------------------------------------------- cards and lists

def card(title, description, target, meta, link_text, media="art", alt=""):
    if media == "art":
        visual = f'<div class="story-card__art" aria-hidden="true">{icon("sparkle", "icon--fill")}</div>'
    else:
        visual = f'<img class="story-card__photo" src="../../assets/photos/{media}" alt="{esc(alt)}">'
    url = target if target.startswith("mailto:") else href(target)
    return f'<article class="card story-card">{visual}<div class="stack"><p class="eyebrow">{esc(meta)}</p><h2 class="card__title">{esc(title)}</h2><p class="text-muted">{description}</p><a class="link link--standalone" href="{url}">{esc(link_text)} <span class="link__arrow" aria-hidden="true">{icon("arrow-right", "icon--sm")}</span></a></div></article>'


def style_cards(edge=False):
    cards = [
        card("Knotless braids", "Gentle at the root · 4–7 hours · typically $160–$300", "style-detail", "Most explored", "Explore Knotless braids", "knotless-braids.png", "Medium knotless braids shown from the back and side"),
        card("Passion twists", "Soft, textured finish · 3–6 hours · typically $140–$260", "style-detail", "Protective style", "Explore Passion twists"),
        card("Cornrows", "Clean lines and versatile patterns · 2–4 hours", "style-detail", "Classic", "Explore Cornrows"),
    ]
    if edge:
        cards.append(card("Extra-long boho knotless braids with curly ends and gold cuffs", "Waist length, human-hair curls left out through the lengths · 8–10 hours · typically $320–$480", "style-detail", "New this month", "Explore Extra-long boho knotless braids"))
    return ''.join(cards)


def braider_cards(edge=False):
    cards = [
        card("Nia Okafor", f"4.9 {STAR} from 86 reviews · Toronto West · knotless braids from $180", "braider-profile", "Available Sat 24 Oct", "View Nia’s profile", "nia.jpg", "Portrait of Nia Okafor"),
        card("Aisha Mensah", f"4.8 {STAR} from 64 reviews · North York · knotless braids from $195", "braider-profile", "Next week", "View Aisha’s profile"),
        card("Jules Baptiste", f"4.9 {STAR} from 41 reviews · Scarborough · knotless braids from $170", "braider-profile", "Available Sun 25 Oct", "View Jules’s profile"),
    ]
    if edge:
        cards.append(card("Amara Nkiruka Adeyemi-Williams", f"4.7 {STAR} from 1,284 reviews · Etobicoke, North York, Scarborough and surrounding neighbourhoods · knotless braids from $210", "braider-profile", "Next available Tue 27 Oct", "View Amara’s profile"))
    return ''.join(cards)


def appointment_row(badge, title, line, action):
    return f'<div class="card appointment-row"><div>{badge}<h2 class="card__title">{esc(title)}</h2><p class="text-muted">{esc(line)}</p></div>{action}</div>'


def fact(value, label):
    return f'<div class="fact"><span class="fact__value">{esc(value)}</span><span class="fact__label">{esc(label)}</span></div>'


def dl(pairs, extra=""):
    def dd(value):
        if isinstance(value, tuple):
            return f'<dd class="{value[1]}">{value[0]}</dd>'
        return f'<dd>{value}</dd>'
    return f'<dl class="dl{" " + extra if extra else ""}">' + ''.join(f'<dt>{esc(k)}</dt>{dd(v)}' for k, v in pairs) + '</dl>'


def search_form(screen, action_html=""):
    names = {"style-gallery": "Search style gallery", "matching-braiders": "Search matching braiders", "my-appointments": "Search my appointments"}
    return f'<form class="filter-row" role="search" action="default.html" novalidate><div class="search search-box">{icon("search")}<input class="input" type="search" id="q" name="q" value="knotless braids" aria-label="{names[screen]}" enterkeyhint="search"></div>{action_html}</form>'


def filters_button():
    return f'<button class="btn" type="button" aria-haspopup="dialog">Filters{icon("filter")}</button>'


def sort_menu():
    return f'<div class="menu-anchor"><button class="btn" type="button" id="sort-trigger" aria-haspopup="menu" aria-expanded="false">Sort: Best match {icon("chevron-down", "icon--sm")}</button></div>'


def chip_filter_row():
    chips = ''.join(f'<button type="button" class="chip" aria-pressed="{"true" if i == 0 else "false"}">{label}</button>' for i, label in enumerate(["All styles", "Braids", "Twists", "Locs"]))
    return f'<div class="chip-row" role="group" aria-label="Style type">{chips}</div>'


def applied_filters(screen):
    chips = {"style-gallery": [("Knotless", "knotless"), ("Toronto", "Toronto"), ("Under $150", "under $150")],
             "matching-braiders": [("Under $150", "under $150"), ("Within 10 km", "within 10 km")],
             "my-appointments": [("Cancelled", "cancelled")]}[screen]
    row = ''.join(f'<span class="chip chip--static">{esc(label)}<button class="remove" type="button" aria-label="Remove filter: {esc(name)}">{icon("close", "icon--sm")}</button></span>' for label, name in chips)
    if screen != "my-appointments":
        row += '<button class="btn btn--link btn--sm" type="button">Clear filters</button>'
    return f'<div class="chip-row" role="group" aria-label="Applied filters">{row}</div>'


def pagination(screen, state):
    if state != "long":
        return ''
    if screen == "style-gallery":
        return f'<nav class="pagination" aria-label="Results pages"><span class="pagination__summary">Showing 1–3 of 126</span><a role="link" aria-disabled="true">Previous</a><a href="long.html" aria-current="page">1</a><a class="pagination__wide" href="long.html">2</a><a class="pagination__wide" href="long.html">3</a><span class="pagination__ellipsis" aria-hidden="true">…</span><a href="long.html">42</a><a href="long.html">Next</a></nav>'
    if screen == "matching-braiders":
        return '<nav class="pagination" aria-label="Braiders pages"><span class="pagination__summary">Showing 4–6 of 12 braiders</span><a href="long.html">Previous</a><a href="long.html">1</a><a href="long.html" aria-current="page">2</a><a href="long.html">3</a><a href="long.html">4</a><a href="long.html">Next</a></nav>'
    return '<nav class="pagination" aria-label="Appointment pages"><span class="pagination__summary">Showing 1–2 of 6 appointments</span><a role="link" aria-disabled="true">Previous</a><a href="long.html" aria-current="page">1</a><a href="long.html">2</a><a href="long.html">3</a><a href="long.html">Next</a></nav>'


# ---------------------------------------------------------------- feedback states

def status_slot():
    return '<span class="visually-hidden" role="status"></span>'


def empty_state(glyph, title, text, actions, *, extra="", heading="h2", focus=False):
    cls = "empty" + (f" {extra}" if extra else "")
    return f'<section class="{cls}"><div class="empty__icon" aria-hidden="true">{icon(glyph, "icon--lg")}</div><{heading} class="empty__title"{attribute("tabindex", "-1", focus)}>{esc(title)}</{heading}><p class="empty__text">{esc(text)}</p><div class="empty__actions">{actions}</div>{status_slot()}</section>'


ERROR_THING = {
    "style-gallery": "the style gallery", "style-detail": "knotless braids", "matching-braiders": "braiders for knotless braids",
    "braider-profile": "Nia’s profile", "booking-request": "your booking request", "appointment-detail": "your appointment",
    "my-appointments": "your appointments", "care-and-review": "your care guide", "sign-in": "the sign-in page",
    "sign-up": "the sign-up page", "forgot-password": "the password reset page", "reset-password": "the password reset page",
    "verify-email": "the email check page", "notification-center": "your updates", "account-settings": "your account settings",
    "help": "help topics", "terms": "the terms of use", "privacy": "the privacy notice",
}

EMPTY = {
    "my-appointments": ("calendar", "No appointments yet", "When you request a visit, you’ll find its status and details here.", ("Explore styles", "style-gallery")),
    "notification-center": ("bell", "No updates yet", "Updates about requests and appointments will appear here.", ("Explore styles", "style-gallery")),
    "style-gallery": ("sparkle", "No styles to explore yet", "Styles are being refreshed. Check back shortly or browse braiders.", ("Browse braiders", "matching-braiders")),
    "matching-braiders": ("user", "No braiders offer knotless braids yet", "No braiders have listed this style near Toronto yet. Try another style.", ("Explore styles", "style-gallery")),
    "style-detail": ("sparkle", "No style details yet", "There’s no information to show here yet. Explore styles to keep going.", ("Explore styles", "style-gallery")),
    "booking-request": ("calendar", "No services to request yet", "There’s no information to show here yet. Explore styles to keep going.", ("Explore styles", "style-gallery")),
    "appointment-detail": ("calendar", "No appointment details yet", "There’s no information to show here yet. Explore styles to keep going.", ("Explore styles", "style-gallery")),
    "care-and-review": ("star", "No care guidance yet", "There’s no information to show here yet. Explore styles to keep going.", ("Explore styles", "style-gallery")),
}

NO_RESULTS = {
    "style-gallery": ("No styles match this search", "Try a different style name or remove a filter."),
    "matching-braiders": ("No braiders match these filters", "Try a wider price range or distance to see more options."),
    "my-appointments": ("No appointments match these filters", "Clear the filter to see your request HP-1048 and your 3 Oct visit."),
}

SUCCESS = {
    "booking-request": ("Request sent to Nia", "This is a request, not a confirmed appointment. Nia will reply with the final time and price.", ("View appointment", "appointment-detail")),
    "care-and-review": ("Your review is posted", "Your review helps others choose a braider with confidence.", ("Explore styles", "style-gallery")),
    "sign-in": ("You’re signed in", "You can continue exploring HairPop.", ("Explore styles", "style-gallery")),
    "sign-up": ("Your account is ready", "You can continue exploring HairPop.", ("Explore styles", "style-gallery")),
    "forgot-password": ("Check your inbox", "If this email belongs to an account, a reset link is on its way.", ("Explore styles", "style-gallery")),
    "reset-password": ("Password updated", "You can continue exploring HairPop.", ("Explore styles", "style-gallery")),
    "verify-email": ("Email sent again", "You can continue exploring HairPop.", ("Explore styles", "style-gallery")),
}


def error_state(screen):
    return empty_state("alert-circle", f"We couldn’t load {ERROR_THING[screen]}", "Check your connection and try again. Your details are safe.",
                       '<button class="btn btn--primary" type="button">Try again</button>' + anchor("Explore styles", "style-gallery"), extra="empty--error")


def error_page(screen):
    p = PAGE_MAP[screen]
    if screen == "not-found":
        return empty_state("search", p[3], p[4], anchor("Explore styles", "style-gallery", True), extra="empty--stack-actions", heading="h1", focus=True)
    if screen == "forbidden":
        return empty_state("lock", p[3], p[4], anchor("Sign in", "sign-in", True), extra="empty--warning empty--stack-actions", heading="h1", focus=True)
    if screen == "server-error":
        section = empty_state("alert-circle", p[3], p[4], '<button class="btn btn--primary" type="button">Try again</button>' + anchor("Contact support", "help"), extra="empty--error empty--stack-actions", heading="h1", focus=True)
        return section.replace(status_slot(), '<p class="empty__reference">Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am</p>' + status_slot())
    return empty_state("wifi-off", p[3], p[4], '<button class="btn btn--primary" type="button">Try again</button>' + anchor("View saved appointments", "my-appointments"), extra="empty--warning empty--stack-actions", heading="h1", focus=True)


# ---------------------------------------------------------------- loading

def sk(kind, style=""):
    return f'<span class="skeleton skeleton--{kind}"{attribute("style", style, bool(style))}></span>'


def sk_group(label, inner):
    return f'<div class="skeleton-group"><span class="visually-hidden" role="status">{esc(label)}</span>{inner}</div>'


SK_STORY = ('<div class="card story-card" aria-hidden="true">' + sk("hero") + '<div class="stack">' + sk("text", "width: 30%") + sk("title")
            + '<div>' + sk("text") + sk("text") + '</div>' + sk("text", "width: 40%") + '</div></div>')
SK_BUTTON = sk("rect", "width: 8rem; height: var(--control-height-md)")
SK_BADGE = sk("rect", "width: 7rem; height: 1.5rem")


def sk_lines(n):
    return ''.join(sk("text") for _ in range(n))


FORM_FIELD_COUNT = {"booking-request": 4, "care-and-review": 2, "account-settings": 3, "sign-in": 2, "sign-up": 3, "forgot-password": 1, "reset-password": 2, "verify-email": 0}
LOADING_LABEL = {"booking-request": "Loading your booking request", "care-and-review": "Loading care and review", "account-settings": "Loading account settings",
                 "sign-in": "Loading sign in", "sign-up": "Loading create account", "forgot-password": "Loading forgot password",
                 "reset-password": "Loading reset password", "verify-email": "Loading verify email", "terms": "Loading terms of use", "privacy": "Loading privacy"}


def loading(screen):
    if screen == "style-gallery":
        return f'<section class="stack">{search_form(screen, anchor("Find braiders", "matching-braiders"))}{chip_filter_row()}<section class="feature-grid" aria-label="Styles" aria-busy="true">{sk_group("Loading styles", SK_STORY * 3)}</section></section>'
    if screen == "matching-braiders":
        return f'{search_form(screen, filters_button() + sort_menu())}<section class="feature-grid" aria-label="Braiders for knotless braids" aria-busy="true">{sk_group("Loading braiders for knotless braids", SK_STORY * 3)}</section>'
    if screen == "help":
        return f'<section class="feature-grid" aria-label="Help topics" aria-busy="true">{sk_group("Loading help topics", SK_STORY * 3)}</section>'
    if screen == "my-appointments":
        row = f'<div class="card appointment-row" aria-hidden="true"><div>{SK_BADGE}{sk("title")}{sk("text")}</div>{SK_BUTTON}</div>'
        return f'<section class="stack" aria-label="My appointments" aria-busy="true">{sk_group("Loading your appointments", row * 3)}</section>'
    if screen == "notification-center":
        row = f'<li class="list__item">{sk("circle")}<div class="list__body">{sk("text", "width: 50%")}{sk("text")}</div></li>'
        return f'<section aria-label="Updates" aria-busy="true">{sk_group("Loading your updates", f"<div class=\"card card--flush\" aria-hidden=\"true\"><ul class=\"list\">{row * 4}</ul></div>")}</section>'
    if screen == "style-detail":
        facts = '<div class="fact-grid">' + sk("rect", "height: 4.375rem") * 3 + '</div>'
        main = f'<div class="card" aria-hidden="true">{sk("hero")}{sk("title")}{sk_lines(2)}{facts}{sk("text")}</div>'
        aside = f'<div class="card" aria-hidden="true">{sk("title")}{sk_lines(2)}{sk("rect", "width: 100%; height: var(--control-height-md)")}</div>'
        return f'<section class="detail-grid" aria-label="Knotless braids" aria-busy="true">{sk_group("Loading knotless braids", main + aside)}</section>'
    if screen == "braider-profile":
        facts = '<div class="fact-grid">' + sk("rect", "height: 4.375rem") * 2 + '</div>'
        profile = f'<div class="card" aria-hidden="true">{sk("circle", "width: 3rem")}{sk("title")}{sk_lines(2)}{facts}{SK_BUTTON}</div>'
        reviews = f'<div class="card" aria-hidden="true">{sk("title")}{sk_lines(3)}</div>'
        aside = f'<div class="card" aria-hidden="true">{sk("title")}{sk_lines(3)}</div>'
        return f'<section class="detail-grid" aria-label="Nia’s profile" aria-busy="true">{sk_group("Loading Nia’s profile", f"<div class=\"stack\">{profile}{reviews}</div>{aside}")}</section>'
    if screen == "appointment-detail":
        main = f'<div class="card" aria-hidden="true">{SK_BADGE}{sk("title")}{sk_lines(3)}<div class="cluster">{SK_BUTTON}{SK_BUTTON}</div></div>'
        aside = f'<div class="card" aria-hidden="true">{sk("title")}{sk_lines(3)}</div>'
        return f'<section class="detail-grid" aria-label="Your appointment" aria-busy="true">{sk_group("Loading your appointment", main + aside)}</section>'
    if screen in ("terms", "privacy"):
        inner = (sk("title") + sk_lines(4)) * 2
        return f'<section class="card legal-copy" aria-label="{esc(PAGE_MAP[screen][1])}" aria-busy="true">{sk_group(LOADING_LABEL[screen], f"<div aria-hidden=\"true\">{inner}</div>")}</section>'
    fields = (sk("text", "width: 30%") + sk("rect", "width: 100%; height: var(--control-height-md)")) * FORM_FIELD_COUNT[screen]
    return f'<section class="form-panel card" aria-label="{esc(PAGE_MAP[screen][1])}" aria-busy="true">{sk_group(LOADING_LABEL[screen], f"<div class=\"stack\" aria-hidden=\"true\">{sk("title")}{fields}{SK_BUTTON}</div>")}</section>'


# ---------------------------------------------------------------- form controls (form-field, text-field, textarea, select, radio-group, checkbox CRDs)

def described(*ids):
    ids = [i for i in ids if i]
    return attribute("aria-describedby", " ".join(ids), bool(ids))


def optional_marker(optional):
    return ' <span class="optional">(optional)</span>' if optional else ''


def messages(fid, hint, error, counter=None, over=False):
    out = ''
    if hint:
        out += f'<span class="field__help" id="{fid}-help">{esc(hint)}</span>'
    if error:
        out += f'<span class="field__error" id="{fid}-error">{esc(error)}</span>'
    if counter:
        out += f'<span class="field__counter" id="{fid}-counter"{attribute("data-over", "true", over)}>{esc(counter)}</span>'
    return out


def text_field(fid, label, value="", typ="text", *, autocomplete=None, required=False, optional=False, hint=None, error=None, show=False, prefix=None, extra=""):
    desc = described(f"{fid}-error" if error else None, f"{fid}-help" if hint else None)
    control = (f'<input class="input" id="{fid}" name="{fid}" type="{typ}"{attribute("value", value, bool(value))}{attribute("autocomplete", autocomplete, bool(autocomplete))}'
               f'{attribute("required", "", required)}{attribute("aria-invalid", "true", bool(error))}{desc}{extra}>')
    if show:
        control = f'<div class="input-group">{control}<button class="btn" type="button" aria-pressed="false" aria-controls="{fid}">Show</button></div>'
    elif prefix:
        control = f'<div class="input-group"><span class="addon" id="{fid}-addon-prefix" aria-hidden="true">{esc(prefix)}</span>{control}</div>'
    return f'<div class="field"><label class="field__label" for="{fid}">{esc(label)}{optional_marker(optional)}</label>{control}{messages(fid, hint, error)}</div>'


def textarea_field(fid, label, value, limit, *, required=False, optional=False, hint=None, error=None):
    counter = f"{len(value)} of {limit} characters"
    desc = described(f"{fid}-error" if error else None, f"{fid}-help" if hint else None, f"{fid}-counter")
    control = f'<textarea class="textarea textarea--auto-grow" id="{fid}" name="{fid}"{attribute("required", "", required)}{attribute("aria-invalid", "true", bool(error))}{desc}>{esc(value)}</textarea>'
    return f'<div class="field"><label class="field__label" for="{fid}">{esc(label)}{optional_marker(optional)}</label>{control}{messages(fid, hint, error, counter, len(value) > limit)}</div>'


def select_field(fid, label, options_html, *, error=None):
    control = f'<select class="select" id="{fid}" name="{fid}" required{attribute("aria-invalid", "true", bool(error))}{described(f"{fid}-error" if error else None)}>{options_html}</select>'
    return f'<div class="field"><label class="field__label" for="{fid}">{esc(label)}</label>{control}{messages(fid, None, error)}</div>'


def options(values, selected=None):
    return ''.join(f'<option{attribute("selected", "", v == selected)}>{esc(v)}</option>' for v in values)


def radio_group(name, legend, choices, *, checked=None, error=None, inline=False, cards=False, required=True):
    items = ''
    for i, choice in enumerate(choices, 1):
        rid = f"{name}-{i}"
        label, value, description = choice
        desc_html = f'<small id="{rid}-description">{esc(description)}</small>' if description else ''
        text = f'<span class="choice__text"><span id="{rid}-label">{esc(label)}</span>{desc_html}</span>' if description else f'<span id="{rid}-label">{esc(label)}</span>'
        items += (f'<label class="choice{" choice--card" if cards else ""}"><input type="radio" id="{rid}" name="{name}" value="{esc(value)}"{attribute("checked", "", checked == i)}{attribute("required", "", required)}'
                  f'{attribute("aria-invalid", "true", bool(error))} aria-labelledby="{rid}-label"{attribute("aria-describedby", f"{rid}-description", bool(description))}>{text}</label>')
    group = f'<div class="choice-group{" choice-group--inline" if inline else ""}">{items}</div>'
    return f'<fieldset class="field"{described(f"{name}-error" if error else None)}><legend>{esc(legend)}</legend>{group}{messages(name, None, error)}</fieldset>'


def form_summary(title, lines):
    links = ''.join(f'<li><a href="#{target}">{esc(text)}</a></li>' for target, text in lines)
    return f'<div class="alert alert--danger form-summary" tabindex="-1" role="group" aria-labelledby="form-summary-title">{icon("alert-circle")}<div class="alert__body"><strong id="form-summary-title">{esc(title)}</strong><ul>{links}</ul></div></div>'


def form_actions(label, *, busy=False, status="", tone=None):
    tone_cls = f" inline-status--{tone}" if tone else ""
    glyph = {"success": icon("check", "icon--sm"), "danger": icon("alert-circle", "icon--sm")}.get(tone, "")
    dot = '<span class="dot dot--pulse" aria-hidden="true"></span>' if busy else ''
    return f'<div class="form-actions"><p class="inline-status{tone_cls}" role="status">{dot}{glyph}{esc(status)}</p><button class="btn btn--primary" type="submit"{attribute("aria-busy", "true", busy)}>{esc(label)}</button></div>'


EMAIL_ERROR = "Enter an email address like name@example.com."


def form_content(screen, state):
    invalid = state == "invalid"
    busy = state == "submitting"
    label = PAGE_MAP[screen][5]
    fields, summary, status, tone, after, heading, foot = [], None, "", None, "", "Details", ""
    if screen == "booking-request":
        heading = "Your details"
        slots = [("Sat 24 Oct · 10:00 am", "slot-2026-10-24-1000", "About 5 hours · estimate $180–$240"), ("Sun 25 Oct · 11:00 am", "slot-2026-10-25-1100", "About 5 hours · estimate $180–$240")]
        time_error = "Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am." if invalid else None
        fields = [
            select_field("service", "Service", options(["Medium knotless braids", "Small knotless braids", "Passion twists"], "Medium knotless braids")),
            radio_group("time", "Preferred time", slots, checked=None if invalid else 1, error=time_error, cards=True),
            '<div class="form-row">' + text_field("email", "Your email", "maya.chen@example.com", "email", autocomplete="email", required=True)
            + text_field("phone", "Phone", "416-555-0148", "tel", autocomplete="tel", optional=True) + '</div>',
            textarea_field("hair", "Hair details", "Shoulder length; bringing my own extensions", 200, optional=True),
        ]
        foot = '<p class="text-muted">Estimate: $180–$240 · about 5 hours. Nia confirms the final price and time.</p>'
        if invalid:
            summary = ("Check 1 field before sending", [("time-1", f"Preferred time: {time_error}")])
        if busy:
            status = "Sending your request to Nia…"
    elif screen == "care-and-review":
        heading = "Your review"
        ratings = [("1", "1", None), ("2", "2", None), ("3", "3", None), ("4", "4", None), ("5 (excellent)", "5", None)]
        review = "" if invalid else "Nia explained each step and the braids feel comfortable."
        fields = [
            radio_group("rating", "Rating, 1 to 5", ratings, checked=None if invalid else 5, error="Choose a rating from 1 to 5." if invalid else None, inline=True),
            textarea_field("review", "Your review", review, 500, required=True, hint="What should others know about your visit?", error="Write a few words about your visit with Nia." if invalid else None),
        ]
        foot = '<p class="text-muted">Keep your scalp moisturized, sleep with a satin bonnet, and contact Nia if the braids feel too tight.</p>'
        if invalid:
            summary = ("Check 2 fields before posting", [("rating-1", "Rating, 1 to 5: Choose a rating from 1 to 5."), ("review", "Your review: Write a few words about your visit with Nia.")])
        if busy:
            status = "Posting your review…"
    elif screen == "account-settings":
        heading = "Contact details"
        fields = [
            text_field("name", "Name", "Maya Chen", autocomplete="name", required=True),
            text_field("email", "Email", "maya.chen@" if invalid else "maya.chen@example.com", "email", autocomplete="email", required=True, error=EMAIL_ERROR if invalid else None),
            text_field("phone", "Phone", "416-555-0148", "tel", autocomplete="tel", optional=True, hint="Braiders text this number."),
        ]
        if invalid:
            summary = ("Check 1 field before saving", [("email", f"Email: {EMAIL_ERROR}")])
        if busy:
            status = "Saving…"
        if state == "success":
            status, tone = "Saved just now", "success"
        if state == "failed":
            status, tone = "Not saved", "danger"
        after = ('<section class="card form-panel stack" aria-labelledby="notifications-title"><h2 id="notifications-title">Notifications</h2><p class="text-muted">These settings save as soon as you change them.</p>'
                 '<label class="switch switch--end"><input type="checkbox" role="switch" checked aria-labelledby="sw-reminders-label" aria-describedby="sw-reminders-desc"><span class="choice__text"><span id="sw-reminders-label">Appointment reminders</span><small class="text-muted" id="sw-reminders-desc">A text the day before Sat 24 Oct at 10:00 am.</small></span></label>'
                 '<label class="switch switch--end"><input type="checkbox" role="switch" aria-labelledby="sw-email-label" aria-describedby="sw-email-desc"><span class="choice__text"><span id="sw-email-label">Email updates</span><small class="text-muted" id="sw-email-desc">News about your requests and appointments, sent to maya.chen@example.com.</small></span></label></section>')
    elif screen == "sign-in":
        fields = [
            text_field("email", "Email", "maya.chen@" if invalid else "maya.chen@example.com", "email", autocomplete="email", required=True, error=EMAIL_ERROR if invalid else None),
            text_field("password", "Password", "", "password", autocomplete="current-password", required=True, show=True),
        ]
        if invalid:
            summary = ("Check 1 field before signing in", [("email", f"Email: {EMAIL_ERROR}")])
        after_form = f'<div class="divider divider--label"><span>or</span></div><a class="btn btn--block" href="{href("sign-up")}">Create account</a>'
    elif screen == "sign-up":
        pw_error = "Use at least 12 characters." if invalid else None
        fields = [
            text_field("name", "Name", "Maya Chen", autocomplete="name", required=True),
            text_field("email", "Email", "maya.chen@" if invalid else "maya.chen@example.com", "email", autocomplete="email", required=True, error=EMAIL_ERROR if invalid else None),
            text_field("password", "Password", "short1234" if invalid else "", "password", autocomplete="new-password", required=True, hint="Use at least 12 characters.", error=pw_error, show=True),
        ]
        if invalid:
            summary = ("Check 2 fields before creating your account", [("email", f"Email: {EMAIL_ERROR}"), ("password", "Password: Use at least 12 characters.")])
    elif screen == "forgot-password":
        err = "Enter the email address on your account."
        fields = [text_field("email", "Email", "maya.chen@" if invalid else "maya.chen@example.com", "email", autocomplete="email", required=True, error=err if invalid else None)]
        if invalid:
            summary = ("Check 1 field before sending", [("email", f"Email: {err}")])
    elif screen == "reset-password":
        err = "Use at least 12 characters." if invalid else None
        fields = [
            text_field("password", "New password", "short1234" if invalid else "", "password", autocomplete="new-password", required=True, hint="Use at least 12 characters.", error=err, show=True),
            text_field("confirm", "Confirm password", "", "password", autocomplete="new-password", required=True, show=True),
        ]
        if invalid:
            summary = ("Check 1 field before saving", [("password", "New password: Use at least 12 characters.")])
    summary_html = form_summary(*summary) if summary else ''
    banner = ''
    if state == "offline":
        banner = alert("warning", "wifi-off", "You’re offline", "Your details remain here. Connect before sending.")
    if state == "failed":
        banner = alert("danger", "alert-circle", "We couldn’t save this change.", "Your details remain here. Please try again.", role="alert")
    trailing = after_form if screen == "sign-in" and state in ("default", "invalid", "submitting") else ''
    form = f'<form class="stack" id="{screen}-form" action="{href(screen)}" novalidate>{summary_html}{"".join(fields)}{foot}{form_actions(label, busy=busy, status=status, tone=tone)}</form>'
    return f'{banner}<section class="form-panel card" aria-labelledby="details-title"><h2 id="details-title">{esc(heading)}</h2>{form}{trailing}</section>{after}'


# ---------------------------------------------------------------- page content

def content(screen, state):
    if screen in ERROR_PAGES:
        return error_page(screen)
    if state == "loading":
        return loading(screen)
    if state == "error":
        return error_state(screen)
    if state == "empty" and screen in EMPTY:
        glyph, title, text, (label, target) = EMPTY[screen]
        return empty_state(glyph, title, text, anchor(label, target, True))
    if state == "no-results":
        title, text = NO_RESULTS[screen]
        action = {"style-gallery": anchor("Find braiders", "matching-braiders"), "matching-braiders": filters_button(), "my-appointments": ""}[screen]
        return search_form(screen, action) + applied_filters(screen) + empty_state("search", title, text, '<button class="btn btn--primary" type="button">Clear filters</button>')
    if state == "success" and screen in SUCCESS:
        title, text, (label, target) = SUCCESS[screen]
        return empty_state("check", title, text, anchor(label, target, True), focus=True)
    if screen in FORM_SCREENS:
        return form_content(screen, state)
    partial = alert("warning", "warning", "Some details are unavailable", "Reviews could not load.", actions='<a class="link link--inherit" href="default.html">Retry reviews</a>') if state == "partial" else ''
    edge = state == "edge"
    if screen == "style-gallery":
        return f'<section class="stack">{search_form(screen, anchor("Find braiders", "matching-braiders"))}{chip_filter_row()}<div class="feature-grid">{style_cards(edge)}</div>{pagination(screen, state)}</section>'
    if screen == "matching-braiders":
        return f'{search_form(screen, filters_button() + sort_menu())}<div class="feature-grid">{braider_cards(edge)}</div>{pagination(screen, state)}'
    if screen == "style-detail":
        name = "Extra-long boho knotless braids with curly ends and gold cuffs" if edge else None
        intro = f'<div class="card"><h2 class="card__title">{esc(name)}</h2><p>Waist length, human-hair curls left out through the lengths · 8–10 hours · typically $320–$480.</p></div>' if edge else ''
        facts = '<div class="fact-grid">' + fact("4–7 hours", "Typical time") + fact("$160–$300", "Typical price") + fact("4–8 weeks", "Typical wear") + '</div>'
        return (partial + intro + f'<div class="detail-grid"><section class="card" aria-labelledby="expect-title"><img class="hero-photo" src="../../assets/photos/knotless-braids.png" alt="Long medium knotless braids with neat, visible parting"><h2 id="expect-title">What to expect</h2><p>Knotless braids start with your natural hair, then extensions are fed in gradually. The finish is flexible and usually feels lighter at the roots.</p>{facts}<p class="text-muted">Length, size, hair density and supplied extensions affect the final quote.</p></section>'
                f'<aside class="card" aria-labelledby="yours-title"><h2 id="yours-title">Make it yours</h2><p>Choose small, medium or large braids, then talk through length and colour with your braider.</p>{anchor("See braiders for this style", "matching-braiders", True)}</aside></div>')
    if screen == "braider-profile":
        return partial + braider_profile(state)
    if screen == "appointment-detail":
        return partial + appointment_detail(state)
    if screen == "my-appointments":
        rows = appointment_row('<span class="badge badge--warning">Awaiting reply</span>', "Nia Okafor · knotless braids", "Sat 24 Oct · 10:00 am · estimate $180–$240", anchor("View request", "appointment-detail", True))
        rows += appointment_row('<span class="badge">Completed</span>', "Nia Okafor · knotless braids", "Sat 3 Oct · review ready", anchor("View care and review", "care-and-review"))
        if edge:
            rows += appointment_row('<span class="badge badge--danger">Cancelled</span>', "Amara Nkiruka Adeyemi-Williams · extra-long boho knotless braids with curly ends", "Sat 12 Sep · 9:00 am · cancelled by Amara", anchor("View request", "appointment-detail"))
        return f'<section class="stack">{rows}{pagination(screen, state)}</section>'
    if screen == "notification-center":
        unread = state != "read"
        chevron = icon("chevron-right")
        def row(title, meta, target, is_unread):
            prefix = '<span class="visually-hidden">Unread: </span>' if is_unread else ''
            return (f'<li><a class="list__item list__item--interactive{" list__item--unread" if is_unread else ""}" href="{href(target)}"><div class="list__body">'
                    f'<div class="list__title">{prefix}{esc(title)}</div><div class="list__meta">{esc(meta)}</div></div>{"" if is_unread else chevron}</a></li>')
        rows = row("Nia received your request", "Today at 9:42 am · She will confirm the time and final price.", "appointment-detail", unread)
        rows += row("How to prepare for knotless braids", "Yesterday · Read Nia’s preparation checklist.", "care-and-review", unread)
        return f'<div class="card card--flush"><ul class="list" aria-label="Notifications">{rows}</ul></div>'
    if screen == "help":
        return ('<section class="feature-grid">' + card("How requests work", "A request becomes an appointment when a braider accepts it.", "booking-request", "Appointments", "See how requests work")
                + card("Prices and estimates", "See what can change a final quote before you request.", "style-detail", "Pricing", "See what changes a quote")
                + card("Need a hand?", "Email support@hairpop.example with your request number.", "mailto:support@hairpop.example", "Support", "Contact support") + '</section>')
    if screen in ("terms", "privacy"):
        first = "Using HairPop" if screen == "terms" else "Your information"
        return (f'<section class="card legal-copy" aria-labelledby="legal-title"><h2 id="legal-title">{esc(first)}</h2><p>HairPop helps customers discover independent braiders and send appointment requests. A request is pending until the braider accepts it.</p><p>Prices shown before confirmation are estimates. The braider confirms appointment details and policies directly with you.</p>'
                f'<h2>{esc("Your choices" if screen == "privacy" else "Requests and reviews")}</h2><p>You can update contact details and review your appointments in your account. Contact support@hairpop.example for help with your information or an appointment.</p></section>')
    raise ValueError(f"No content for {screen}/{state}")


def braider_profile(state):
    edge = state == "edge"
    if edge:
        head = '<div class="profile-head"><span class="avatar avatar--xl" aria-hidden="true">AA</span><div><h2>Amara Nkiruka Adeyemi-Williams</h2><p>Senior knotless braid specialist serving Etobicoke, North York, Scarborough and surrounding neighbourhoods · 1,284 reviews.</p></div></div>'
        edge_card = f'<div class="card">{head}</div>'
    else:
        edge_card = ''
    facts = '<div class="fact-grid">' + fact("From $180", "Knotless braids") + fact("5 hours", "Typical duration") + '</div>'
    request = f'<a class="btn btn--primary" href="{href("booking-request")}">{icon("calendar")}Request with Nia</a>'
    profile = (f'<div class="card"><div class="profile-head"><span class="avatar avatar--xl" aria-hidden="true">NO</span><div><h2>Nia Okafor</h2><p>Toronto West · 4.9 {STAR} from 86 reviews</p></div></div>'
               f'<p>I specialize in comfortable, neat braids. Bring inspiration photos and we’ll confirm the details together.</p>{facts}{request}</div>')
    if state == "empty":
        portfolio = ('<div class="card" aria-labelledby="portfolio-title"><h2 id="portfolio-title">Portfolio</h2><section class="empty empty--compact"><div class="empty__icon" aria-hidden="true">' + icon("star")
                     + f'</div><h3 class="empty__title">No portfolio photos yet</h3><p class="empty__text">You can still read Nia’s services and policies.</p><div class="empty__actions"><a class="btn btn--primary btn--sm" href="{href("booking-request")}">Request with Nia</a></div>{status_slot()}</section></div>')
    else:
        portfolio = ''
    if state == "partial":
        reviews = ''
    else:
        pages = (f'<nav class="pagination pagination--simple" aria-label="Review pages"><a role="link" aria-disabled="true">{icon("chevron-left", "icon--sm")}<span class="visually-hidden">Previous reviews</span></a>'
                 f'<span class="pagination__summary">Reviews 1–10 of 86</span><a href="default.html">{icon("chevron-right", "icon--sm")}<span class="visually-hidden">Next reviews</span></a></nav>')
        reviews = (f'<div class="card"><h2>Customer reviews</h2><blockquote>“The parts were so neat and Nia checked that nothing felt too tight.”</blockquote>'
                   f'<p class="cluster"><span class="avatar avatar--sm" aria-hidden="true">MC</span><cite>Maya Chen, 3 Oct</cite></p>'
                   f'<a class="link" href="{href("report-review", "dialog")}">Report a review</a>{pages if state != "empty" else ""}</div>')
    pairs = [("Service area", "Toronto West"), ("Address", ("Shared after confirmation", "text-muted")), ("Typical duration", "5 hours"), ("Knotless braids", "From $180")]
    if state == "partial":
        pairs.append(("Reviews", '<span class="inline-status inline-status--danger">Couldn’t load</span> · <a href="default.html">Retry reviews</a>'))
    aside = (f'<aside class="card" aria-labelledby="before-title"><h2 id="before-title">Before you book</h2>{dl(pairs, "dl--stacked")}'
             '<p>Changes and cancellations are subject to Nia’s policy, shown before you send a request. Please arrive with detangled hair.</p></aside>')
    return f'{edge_card}<div class="detail-grid"><section class="stack">{profile}{portfolio}{reviews}</section>{aside}</div>'


def appointment_detail(state):
    if state == "success":
        pairs = [("Status", '<span class="badge badge--success">Confirmed</span>'), ("Time", "Sat 24 Oct · 10:00 am"), ("Confirmed estimate", "$210"), ("Studio address", "1246 Bloor Street West, Toronto")]
    else:
        pairs = [("Status", '<span class="badge badge--warning">Awaiting reply</span>'), ("Service", "Medium knotless braids"), ("Braider", f'<a href="{href("braider-profile")}">Nia Okafor</a>'),
                 ("Preferred time", "Sat 24 Oct · 10:00 am · about 5 hours"), ("Estimate", "$180–$240"), ("Final price", ("Nia confirms after accepting", "text-muted")), ("Location", ("Shared after Nia accepts", "text-muted"))]
    actions = '<div class="cluster"><button class="btn" type="button" aria-haspopup="dialog">Request a change</button><button class="btn btn--link" type="button" aria-haspopup="dialog">Cancel request</button></div>'
    return (f'<div class="detail-grid"><section class="card stack" aria-labelledby="appointment-title"><h2 id="appointment-title">Medium knotless braids</h2>{dl(pairs)}{actions}</section>'
            '<aside class="card" aria-labelledby="prepare-title"><h2 id="prepare-title">Prepare for your visit</h2><ol><li>Wash and detangle your hair.</li><li>Bring the extensions discussed with Nia.</li><li>Send any inspiration photos in advance.</li></ol></aside></div>')


# ---------------------------------------------------------------- dialogs (dialog, tooltip, alert CRDs)

DIALOG_SAFE = {"filter-braiders": "Clear filters", "request-review": "Edit details", "cancel-appointment": "Keep request", "change-appointment": "Keep current time",
               "report-review": "Keep browsing", "sign-out": "Stay signed in", "cookie-preferences": "Keep browsing"}
DIALOG_ACTION = {"filter-braiders": "Show braiders", "request-review": "Send request", "cancel-appointment": "Cancel request", "change-appointment": "Send change request",
                 "report-review": "Send report", "sign-out": "Sign out", "cookie-preferences": "Save preferences"}
DIALOG_BUSY = {"filter-braiders": "Finding braiders…", "request-review": "Sending your request…", "cancel-appointment": "Cancelling your request…", "change-appointment": "Sending your change request…",
               "report-review": "Sending your report…", "sign-out": "Signing you out…", "cookie-preferences": "Saving your preferences…"}
DESTRUCTIVE = {"cancel-appointment": "alert-circle", "sign-out": "log-out"}


def dialog_fields(screen, invalid, failed):
    if screen == "filter-braiders":
        err = "Enter a price of at least $160 for this style." if invalid else None
        fields = (text_field("price", "Maximum price", "150", "number", prefix="$", error=err, extra=' inputmode="numeric" min="0" step="10"')
                  + select_field("distance", "Distance from Toronto", options(["Within 5 km", "Within 10 km", "Within 25 km"], "Within 25 km" if failed else "Within 10 km")))
        return fields, ("Check 1 field before showing braiders", [("price", f"Maximum price: {err}")]) if invalid else None
    if screen == "change-appointment":
        err = "Choose one of the times Nia has offered." if invalid else None
        sel = None if invalid else "Sun 25 Oct, 11:00 am"
        opts = (f'<option value="" disabled{attribute("selected", "", invalid)}>Choose a time</option><optgroup label="Sat 24 Oct">{options(["Sat 24 Oct, 1:00 pm"], sel)}</optgroup>'
                f'<optgroup label="Sun 25 Oct">{options(["Sun 25 Oct, 11:00 am", "Sun 25 Oct, 2:00 pm"], sel)}</optgroup>')
        return select_field("new-time", "New preferred time", opts, error=err), ("Check 1 field before sending", [("new-time", f"New preferred time: {err}")]) if invalid else None
    if screen == "report-review":
        err = "Tell us what needs review." if invalid else None
        return textarea_field("reason", "Reason", "" if invalid else "Inaccurate service details", 300, required=True, error=err), ("Check 1 field before sending", [("reason", f"Reason: {err}")]) if invalid else None
    if screen == "cookie-preferences":
        return ('<div class="field"><label class="choice"><input type="checkbox" checked aria-labelledby="optional-usage-label" aria-describedby="optional-usage-description">'
                '<span class="choice__text"><span id="optional-usage-label">Remember my optional usage choices</span><small id="optional-usage-description">Helps us improve search. You can change this any time.</small></span></label></div>'), None
    return '', None


def dialog_content(item, state):
    screen, title, source, description, _, _ = item
    invalid, busy, failed = state == "invalid", state == "busy", state == "failed"
    destructive = screen in DESTRUCTIVE
    # The bubble is shown pushed along the panel's end edge, as the tooltip CRD's D-2 positions it, with its arrow on the trigger's centre.
    close = (f'<span class="has-tooltip"><button class="btn btn--ghost btn--icon" type="button" aria-label="Close dialog" aria-describedby="dlg-close-tip">{icon("close")}</button>'
             '<span class="tooltip tooltip--below" role="tooltip" id="dlg-close-tip" style="left: auto; right: 0; translate: none; --tooltip-arrow-x: calc(100% - var(--control-height-md) / 2)">Close dialog</span></span>')
    chip = ''
    if destructive:
        chip = f'<span class="dialog__icon dialog__icon--danger">{icon(DESTRUCTIVE[screen])}</span>'
    elif screen == "request-review":
        chip = f'<span class="dialog__icon dialog__icon--info">{icon("info")}</span>'
    header = f'<div class="dialog__header">{chip}<div><h2 class="dialog__title" id="dlg-title">{esc(title)}</h2><p id="dlg-desc" class="text-muted">{esc(description)}</p></div>{"" if destructive else close}</div>'
    failure = ''
    if failed:
        if screen == "cancel-appointment":
            failure = alert("danger", "alert-circle", "We couldn’t cancel this request.", "Your request is unchanged. Check your connection and try again.", role="alert")
        else:
            failure = alert("danger", "alert-circle", "We couldn’t save this change.", "Your details remain here. Please try again.", role="alert")
    fields, summary = dialog_fields(screen, invalid, failed)
    is_form = bool(fields)
    if is_form:
        body_inner = f'<form class="stack" id="{screen}-form" novalidate>{form_summary(*summary) if summary else ""}{fields}</form>'
    elif screen == "request-review":
        body_inner = dl([("Service", "Medium knotless braids"), ("Braider", "Nia Okafor"), ("Preferred time", "Sat 24 Oct · 10:00 am · not confirmed until Nia accepts"),
                         ("Estimate", "$180–$240 · about 5 hours · Nia confirms the final price"), ("Location", "Toronto West · address shared after Nia accepts"),
                         ("Your email", "maya.chen@example.com"), ("Hair details", "Shoulder length; bringing my own extensions")])
    else:
        body_inner = ''
    body = f'<div class="dialog__body stack">{failure}{body_inner}</div>'
    tone = "btn--danger" if destructive else "btn--primary"
    confirm_label = "Try again" if failed else DIALOG_ACTION[screen]
    submit = f' type="submit" form="{screen}-form"' if is_form else ' type="button"'
    footer = f'<div class="dialog__footer"><button class="btn" type="button">{esc(DIALOG_SAFE[screen])}</button><button class="btn {tone}"{submit}{attribute("aria-busy", "true", busy)}>{esc(confirm_label)}</button></div>'
    status = f'<p class="sr-only" role="status">{esc(DIALOG_BUSY[screen]) if busy else ""}</p>'
    size = " dialog__panel--sm" if destructive else " dialog__panel--lg" if screen == "cookie-preferences" else ""
    role = "alertdialog" if destructive else "dialog"
    return (f'<div class="backdrop"></div><div class="dialog" data-dismiss-on-escape><div class="dialog__panel{size}" role="{role}" aria-modal="true" aria-labelledby="dlg-title" aria-describedby="dlg-desc">'
            f'{header}{body}{footer}{status}</div></div>')


# ---------------------------------------------------------------- notifications (toast CRD)

TOAST_MESSAGES = {
    "booking-update": {"info": ("Request received", "Nia has your request and will reply soon."), "success": ("Time confirmed", "Nia confirmed Sat 24 Oct at 10:00 am."), "warning": ("Time needs a change", "Nia suggested Sun 25 Oct at 11:00 am."), "danger": ("Update could not be sent", "Your request is still saved. Retry when connected.")},
    "review-feedback": {"info": ("Review ready", "Share how your visit with Nia went."), "success": ("Review posted", "Thank you for helping others choose."), "warning": ("Review needs attention", "Please add a rating before posting."), "danger": ("Review not posted", "Your words are saved. Please try again.")},
    "account-feedback": {"info": ("Details saved locally", "We’ll sync your changes when connected."), "success": ("Details updated", "Nia can reach you at your new number."), "warning": ("Verify your email", "Open the link sent to maya.chen@example.com."), "danger": ("Changes not saved", "Your edits are still here. Please try again.")},
    "cookie-consent": {"info": ("Your privacy choices", "Choose whether optional usage data may be stored."), "success": ("Preferences saved", "You can change them any time."), "warning": ("Choice needed", "Select a preference to continue."), "danger": ("Preferences not saved", "Please retry before leaving this page.")},
}
TOAST_ACTIONS = {
    "booking-update": {"success": "View appointment", "warning": "View suggestion", "danger": "Retry"},
    "review-feedback": {"info": "Write review", "warning": "Add a rating", "danger": "Retry"},
    "account-feedback": {"success": "Undo", "warning": "Resend email", "danger": "Retry"},
    "cookie-consent": {"info": "Choose", "success": "Undo", "warning": "Choose", "danger": "Retry"},
}
TOAST_ICONS = {"info": "info", "success": "check-circle", "warning": "warning", "danger": "alert-circle"}


def notification_content(item, state):
    screen, _, _ = item
    kinds = {"stacked": ["info", "success", "danger"], "with-action": ["warning"], "persistent": ["info"]}.get(state, [state])

    def one_toast(kind):
        title, text = TOAST_MESSAGES[screen][kind]
        action_label = TOAST_ACTIONS[screen].get(kind)
        action = f'<button class="toast__action" type="button">{esc(action_label)}</button>' if action_label else ''
        progress = '<span class="toast__progress" aria-hidden="true"></span>' if kind in ("info", "success") and state != "persistent" else ''
        return (f'<div class="toast toast--{kind}">{icon(TOAST_ICONS[kind])}<div class="toast__body"><strong class="toast__title">{esc(title)}</strong><span class="toast__text">{esc(text)}</span>{action}</div>'
                f'<button class="close" type="button" aria-label="Dismiss: {esc(title)}">{icon("close", "icon--sm")}</button>{progress}</div>')
    polite = ''.join(one_toast(k) for k in kinds if k != "danger")
    assertive = ''.join(one_toast(k) for k in kinds if k == "danger")
    return (f'<div class="toast-region" role="status" aria-live="polite">{polite}</div><div class="toast-region toast-region--top" role="alert" aria-live="assertive">{assertive}</div>'
            '<p class="mock-note" style="bottom: var(--space-12); right: var(--space-4);">Info and success messages dismiss after 8 seconds, or 10 seconds when they offer an action, and pause on hover or focus. Warnings, errors and persistent messages stay until dismissed.</p>')


# ---------------------------------------------------------------- documents

def bar(item, kind, state):
    if kind == "dialog":
        screen, title, states = item[0], item[1], item[4]
    elif kind == "notification":
        screen, title, states = item[0], item[1], NOTIFICATION_STATES
    else:
        screen, title, states = item[0], item[1], item[6]
    links = ''.join(f'<li><a href="{esc(s)}.html"{attribute("aria-current", "page", s == state)}>{esc(s)}</a></li>' for s in states)
    return f'<nav class="mock-bar" aria-label="Mock navigation"><a class="mock-bar__home" href="../../index.html" aria-label="All mocks">⌂</a><span class="mock-bar__screen">{esc(title)}</span><ul class="mock-bar__states">{links}</ul><button type="button" data-theme-toggle aria-pressed="false">☾ Dark</button><button type="button" data-chrome-toggle aria-label="Hide mock chrome">×</button></nav>'


def document(kind, item, state):
    screen, title = item[:2]
    source = item[2] if kind != "page" else screen
    body = shell(source, state if kind == "page" else "default", inert=kind == "dialog")
    if kind == "dialog":
        body += dialog_content(item, state)
    if kind == "notification":
        body += notification_content(item, state)
    description = f'{title}: {state} state in the HairPop customer journey.'
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{esc(title)} · {esc(state)} — HairPop mocks</title><meta name="mock:kind" content="{kind}"><meta name="mock:screen" content="{esc(screen)}"><meta name="mock:state" content="{esc(state)}"><meta name="description" content="{esc(description)}"><link rel="stylesheet" href="../../assets/fonts/fonts.css"><link rel="stylesheet" href="../../assets/tokens.css"><link rel="stylesheet" href="../../assets/ui.css"><link rel="stylesheet" href="../../assets/mock.css"></head><body>{body}{bar(item, kind, state)}<script src="../../assets/mock.js"></script></body></html>'''


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def main():
    screens = []
    for folder in ("pages", "dialogs", "notifications"):
        for stale in (ROOT / folder).glob("*/*.html"):
            stale.unlink()
    for p in PAGES:
        screen, title, route, *_, states = p
        na = {}
        if "empty" not in states:
            na["empty"] = "This screen has no collection to become empty."
        if screen in ERROR_PAGES:
            na["loading"] = "An error page is a static response with nothing to load."
            na["error"] = "An error page is itself the error response."
        screens.append({"id": screen, "kind": "page", "title": title, "route": route, "states": states, "not_applicable": na})
        for state in states:
            write(ROOT / "pages" / screen / f"{state}.html", document("page", p, state))
    for d in DIALOGS:
        screen, title, source, _, states, na_invalid = d
        na = {"invalid": na_invalid} if na_invalid else {}
        screens.append({"id": screen, "kind": "dialog", "title": title, "opens_from": source, "states": states, "not_applicable": na})
        for state in states:
            write(ROOT / "dialogs" / screen / f"{state}.html", document("dialog", d, state))
    for n in NOTIFICATIONS:
        screen, title, source = n
        screens.append({"id": screen, "kind": "notification", "title": title, "opens_from": source, "states": NOTIFICATION_STATES})
        for state in NOTIFICATION_STATES:
            write(ROOT / "notifications" / screen / f"{state}.html", document("notification", n, state))
    (ROOT / "manifest.json").write_text(json.dumps({"project": "HairPop", "screens": screens}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
