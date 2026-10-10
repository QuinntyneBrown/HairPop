"""Regenerate the static HairPop mock screens from the catalog below.

The markup mirrors what the components library renders (frontend/projects/components) and the
design system's stylesheet (docs/design-system/assets/components.css). Two products share it:
the customer web app and the braider management app.
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
ICON_SOURCE = ROOT.parent.parent / "frontend/projects/components/src/lib/icon/icons.ts"


def load_icons() -> dict[str, str]:
    text = ICON_SOURCE.read_text(encoding="utf-8")
    body = text[text.index("ICONS = {") : text.index("} as const")]
    return {m.group(1): m.group(2) for m in re.finditer(r"'?([a-z-]+)'?:\s*'([^']+)'", body)}


ICONS = load_icons()

# (id, title, route, eyebrow, h1, subtitle, states, requirements)
PAGES = [
    ("style-gallery", "Style gallery", "/", "Discover", "Find a style that feels like you", "Browse protective styles, compare typical time and price, and see real work.", ["default", "loading", "empty", "error", "no-results", "long", "edge", "offline"], ["L2-001", "L2-002", "L2-035"]),
    ("style-detail", "Knotless braids", "/styles/knotless-braids", "Discover", "Knotless braids, your way", "A lighter feel at the root, with room to choose length and size.", ["default", "loading", "empty", "error", "partial", "edge", "offline"], ["L2-003"]),
    ("matching-braiders", "Matching braiders", "/styles/knotless-braids/braiders", "Discover", "Braiders for knotless braids", "3 braiders offer this style near Toronto · prices and availability vary.", ["default", "loading", "empty", "error", "no-results", "long", "edge", "offline"], ["L2-004", "L2-005", "L2-006", "L2-008"]),
    ("braider-profile", "Nia’s profile", "/braiders/nia-okafor", "Braider", "Nia Okafor", "Knotless braids and twists in Toronto West.", ["default", "loading", "empty", "error", "partial", "edge", "offline"], ["L2-007", "L2-008", "L2-009"]),
    ("booking-request", "Booking request", "/book/nia-okafor", "Request", "Request your appointment", "Nia will review your details and confirm the time and final price.", ["default", "loading", "empty", "error", "invalid", "submitting", "success", "offline"], ["L2-015", "L2-016", "L2-017"]),
    ("appointment-detail", "Appointment detail", "/appointments/hp-1048", "Request HP-1048", "Your appointment with Nia", "Sat 24 Oct at 10:00 am · awaiting Nia’s reply.", ["default", "loading", "empty", "error", "partial", "success", "offline"], ["L2-019", "L2-021", "L2-022", "L2-024"]),
    ("my-appointments", "My appointments", "/appointments", "Your HairPop", "My appointments", "1 request awaiting a reply · 1 completed appointment.", ["default", "loading", "empty", "error", "no-results", "long", "edge", "offline"], ["L2-018", "L2-023"]),
    ("care-and-review", "Care and review", "/appointments/hp-0992/care", "Visit HP-0992", "Care for your knotless braids", "Your visit with Nia was on Sat 3 Oct · share how it went.", ["default", "loading", "empty", "error", "invalid", "submitting", "success", "offline"], ["L2-023", "L2-024", "L2-025"]),
    ("sign-in", "Sign in", "/sign-in", "Account", "Welcome back", "Sign in to manage requests, appointments and reviews.", ["default", "loading", "error", "invalid", "submitting", "success"], ["L2-011", "L2-040"]),
    ("sign-up", "Create account", "/sign-up", "Account", "Join HairPop", "Keep your appointments and trusted braiders in one place.", ["default", "loading", "error", "invalid", "submitting", "success"], ["L2-010"]),
    ("forgot-password", "Forgot password", "/forgot-password", "Account", "Reset your password", "We’ll send a secure link to the email on your account.", ["default", "loading", "error", "invalid", "submitting", "success"], ["L2-012"]),
    ("reset-password", "Reset password", "/reset-password", "Account", "Choose a new password", "Use at least 12 characters for your HairPop account.", ["default", "loading", "error", "invalid", "submitting", "success"], ["L2-012"]),
    ("verify-email", "Verify email", "/verify-email", "Account", "Check your email", "We sent a verification link to maya.chen@example.com.", ["default", "loading", "error", "submitting", "success"], ["L2-013"]),
    ("notification-center", "Notifications", "/notifications", "Your HairPop", "Notifications", "2 unread updates about your appointments.", ["default", "loading", "empty", "error", "unread", "read", "offline"], ["L2-029", "L2-030"]),
    ("account-settings", "Account settings", "/settings", "Your HairPop", "Account settings", "Keep your contact details current so braiders can reach you.", ["default", "loading", "error", "invalid", "submitting", "success", "offline"], ["L2-014", "L2-011"]),
    ("help", "Help", "/help", "Support", "How can we help?", "Find answers about requests, pricing, changes and reviews.", ["default", "loading", "error", "offline"], ["L2-032"]),
    ("not-found", "Page not found", "/404", "Error 404", "We couldn’t find that page", "The link may be old, or the address may have changed.", ["default", "loading", "error"], ["L2-037"]),
    ("forbidden", "Access unavailable", "/403", "Error 403", "You can’t open this page", "Sign in with the account used for this appointment.", ["default", "loading", "error"], ["L2-037"]),
    ("server-error", "Service error", "/500", "Error 500", "HairPop needs a moment", "We couldn’t load this page. Your booking request has not been resent.", ["default", "loading", "error"], ["L2-037"]),
    ("offline", "Offline", "/offline", "Offline", "You’re offline", "Saved appointment details remain available. Requests need a connection.", ["default", "loading", "error"], ["L2-036", "L2-045"]),
    ("terms", "Terms of use", "/terms", "Legal", "Terms of use", "How HairPop helps customers and independent braiders connect.", ["default", "loading", "error"], ["L2-033"]),
    ("privacy", "Privacy", "/privacy", "Legal", "Privacy at HairPop", "What information is used when you browse, request and review.", ["default", "loading", "error"], ["L2-033", "L2-034"]),
    # Braider management app
    ("braider-sign-in", "Braider sign in", "/manage/sign-in", "HairPop for braiders", "Sign in to manage your bookings", "For braiders who offer services on HairPop.", ["default", "loading", "error", "invalid", "submitting", "denied"], ["L2-046"]),
    ("braider-requests", "Braider requests", "/manage/requests", "HairPop for braiders", "Requests", "2 requests and 1 change request need your reply.", ["default", "loading", "empty", "error", "offline"], ["L2-020", "L2-021", "L2-047"]),
    ("braider-services", "Braider services", "/manage/services", "HairPop for braiders", "Services", "What customers can request from you, with starting prices and typical time.", ["default", "loading", "empty", "error", "offline"], ["L2-026", "L2-047"]),
    ("braider-profile-content", "Braider profile content", "/manage/profile", "HairPop for braiders", "Your public profile", "What customers see before they request an appointment.", ["default", "loading", "empty", "error", "invalid", "submitting", "success", "offline", "conflict"], ["L2-027", "L2-047"]),
    ("braider-availability", "Braider availability", "/manage/availability", "HairPop for braiders", "Availability", "Offered times customers can request. Times are in Toronto time.", ["default", "loading", "empty", "error", "offline"], ["L2-028", "L2-047"]),
]

# (id, title, source page, description, states, requirements)
DIALOGS = [
    ("filter-braiders", "Filter braiders", "matching-braiders", "Choose the price and travel distance that work for you.", ["default", "busy", "invalid", "failed"], ["L2-005"]),
    ("request-review", "Review request", "booking-request", "Check your details before Nia receives your request.", ["default", "busy", "invalid", "failed"], ["L2-016", "L2-017"]),
    ("cancel-appointment", "Cancel request HP-1048?", "appointment-detail", "Nia will see that you no longer need Sat 24 Oct at 10:00 am. You can send a new request later.", ["default", "busy", "failed"], ["L2-022"]),
    ("change-appointment", "Request a change", "appointment-detail", "Choose a new time from Nia’s offered times. Your current time stays booked until Nia accepts.", ["default", "busy", "invalid", "failed"], ["L2-021"]),
    ("report-review", "Report a review", "braider-profile", "Tell us why this review needs a closer look. The review stays visible while we check it.", ["default", "busy", "invalid", "failed"], ["L2-009"]),
    ("sign-out", "Sign out of HairPop?", "account-settings", "Saved appointment details are removed from this browser. You can browse styles at any time.", ["default", "busy", "failed"], ["L2-011", "L2-045"]),
    ("cookie-preferences", "Cookie preferences", "style-gallery", "Essential storage keeps you signed in. Optional usage data helps us improve HairPop.", ["default", "busy", "invalid", "failed"], ["L2-034"]),
    # Braider management app
    ("respond-to-request", "Respond to request HP-1048", "braider-requests", "Maya Chen asked for medium knotless braids on Sat 24 Oct at 10:00 am.", ["default", "busy", "invalid", "failed", "conflict"], ["L2-020", "L2-021"]),
    ("edit-service", "Edit service", "braider-services", "Customers see these details when they find you and when they request.", ["default", "busy", "invalid", "failed", "conflict"], ["L2-026", "L2-047"]),
    ("remove-service", "Remove Boho knotless braids?", "braider-services", "Customers can no longer request it. Past appointments keep their details.", ["default", "busy", "failed"], ["L2-026"]),
    ("add-portfolio-item", "Add a portfolio photo", "braider-profile-content", "Show work customers can expect. Photos appear on your public profile.", ["default", "busy", "invalid", "failed"], ["L2-027"]),
    ("add-slot", "Add an offered time", "braider-availability", "Customers can request this time for any published service.", ["default", "busy", "invalid", "failed"], ["L2-028"]),
    ("withdraw-slot", "Withdraw Sun 25 Oct at 11:00 am?", "braider-availability", "Customers can no longer request this time. Existing requests are not changed.", ["default", "busy", "failed"], ["L2-028"]),
    ("braider-sign-out", "Sign out of HairPop for braiders?", "braider-profile-content", "You’ll need to sign in again to reply to requests.", ["default", "busy", "failed"], ["L2-046"]),
]

NOTIFICATION_STATES = ["info", "success", "warning", "danger", "with-action", "stacked", "persistent"]
# (id, title, source page, requirements)
NOTIFICATIONS = [
    ("booking-update", "Booking update", "appointment-detail", ["L2-029", "L2-031"]),
    ("review-feedback", "Review feedback", "care-and-review", ["L2-029", "L2-031"]),
    ("account-feedback", "Account feedback", "account-settings", ["L2-029", "L2-031"]),
    ("cookie-consent", "Cookie consent", "style-gallery", ["L2-031", "L2-034"]),
    ("braider-feedback", "Braider feedback", "braider-requests", ["L2-047"]),
]

PAGE_MAP = {p[0]: p for p in PAGES}
NAV = [("style-gallery", "Styles"), ("matching-braiders", "Braiders"), ("my-appointments", "Appointments"), ("help", "Help")]
BRAIDER_NAV = [("braider-requests", "Requests"), ("braider-services", "Services"), ("braider-profile-content", "Profile"), ("braider-availability", "Availability")]
NAV_SECTION = {"style-detail": "style-gallery", "braider-profile": "matching-braiders", "booking-request": "matching-braiders", "appointment-detail": "my-appointments", "care-and-review": "my-appointments"}
SIGNED_OUT = {"sign-in", "sign-up", "forgot-password", "reset-password", "braider-sign-in"}
FORM_SCREENS = {"booking-request", "care-and-review", "sign-in", "sign-up", "forgot-password", "reset-password", "verify-email", "account-settings", "braider-sign-in", "braider-profile-content"}
COLLECTION_SCREENS = {"style-gallery", "matching-braiders", "my-appointments", "notification-center", "help", "braider-requests", "braider-services", "braider-availability"}


def is_braider(screen: str) -> bool:
    return screen.startswith("braider-") and screen != "braider-profile"


def esc(value) -> str:
    return html.escape(str(value), quote=True)


def attribute(name, value, active=True) -> str:
    return f' {name}="{esc(value)}"' if active else ""


def icon(name: str, extra: str = "") -> str:
    return f'<svg class="icon{(" " + extra) if extra else ""}" viewBox="0 0 24 24" aria-hidden="true"><path d="{ICONS[name]}"/></svg>'


def href(screen: str, kind: str = "page", state: str = "default") -> str:
    folder = {"page": "pages", "dialog": "dialogs", "notification": "notifications"}[kind]
    return f"../../{folder}/{screen}/{state}.html"


def anchor(label, target, primary=False, kind="page") -> str:
    return f'<a class="btn{" btn--primary" if primary else ""}" href="{href(target, kind)}">{esc(label)}</a>'


def dialog_button(label, dialog, variant="") -> str:
    """A button that opens a dialog; in the static mocks it links to the dialog file."""
    return f'<a class="btn{(" btn--" + variant) if variant else ""}" href="{href(dialog, "dialog")}" aria-haspopup="dialog">{esc(label)}</a>'


# ---------------------------------------------------------------------------
# Shell
# ---------------------------------------------------------------------------

def theme_toggle() -> str:
    return '<button class="btn btn--ghost btn--sm theme-toggle" type="button" aria-pressed="false" data-product-theme-toggle>Dark theme</button>'


def topbar(screen: str) -> str:
    braider = is_braider(screen)
    items = BRAIDER_NAV if braider else NAV
    current = NAV_SECTION.get(screen, screen)
    nav = "".join(f'<a class="nav-link" href="{href(i)}"{attribute("aria-current", "page", i == current)}>{esc(label)}</a>' for i, label in items)
    brand_target = "braider-requests" if braider else "style-gallery"
    brand = "HairPop for braiders" if braider else "HairPop"
    signed_out = screen in SIGNED_OUT
    updates = "" if signed_out or braider else f'<a class="account-link" href="{href("notification-center")}">Updates <span class="badge badge--count">2</span><span class="visually-hidden">, 2 unread</span></a>'
    if braider:
        account = "" if signed_out else f'<a class="account-link topbar__account" href="{href("braider-profile-content")}">Nia</a>'
    else:
        account = f'<a class="account-link topbar__account" href="{href("sign-in" if signed_out else "account-settings")}">{"Sign in" if signed_out else "Maya"}</a>'
    nav_html = "" if (braider and signed_out) else f'<nav class="topbar__nav" id="primary-nav" aria-label="Primary">{nav}</nav>'
    menu = "" if (braider and signed_out) else f'<button class="btn btn--ghost btn--icon topbar__menu" type="button" aria-label="Menu" aria-expanded="false" aria-controls="primary-nav">{icon("menu")}</button>'
    return f'<header class="topbar"><a class="topbar__brand" href="{href(brand_target)}">{icon("sparkle")}{esc(brand)}</a>{nav_html}<span class="topbar__spacer"></span>{updates}{theme_toggle()}{menu}{account}</header>'


def footer(screen: str) -> str:
    if is_braider(screen):
        links = [("Help", href("help")), ("Terms", href("terms")), ("Privacy", href("privacy"))]
        line = "HairPop for braiders · Keep your bookings current"
    else:
        links = [("Help", href("help")), ("Terms", href("terms")), ("Privacy", href("privacy"))]
        line = "HairPop · Made for confident hair decisions"
    items = "".join(f'<li><a href="{h}">{esc(label)}</a></li>' for label, h in links)
    if not is_braider(screen):
        items += f'<li><a href="{href("cookie-preferences", "dialog")}" aria-haspopup="dialog">Cookie preferences</a></li>'
    return f'<footer class="site-footer"><p>{esc(line)}</p><ul class="site-footer__links">{items}</ul></footer>'


def page_header(screen: str, state: str) -> str:
    p = PAGE_MAP[screen]
    actions = ""
    if screen == "braider-services" and state not in ("loading", "error"):
        actions = f'<div class="page-header__actions">{dialog_button("Add service", "edit-service", "primary")}</div>'
    if screen == "braider-availability" and state not in ("loading", "error"):
        actions = f'<div class="page-header__actions">{dialog_button("Add offered time", "add-slot", "primary")}</div>'
    if screen == "braider-profile-content" and state not in ("loading", "error"):
        actions = f'<div class="page-header__actions"><a class="btn" href="{href("braider-profile")}">View public profile</a>{dialog_button("Sign out", "braider-sign-out")}</div>'
    if screen == "account-settings" and state not in ("loading", "error"):
        actions = f'<div class="page-header__actions">{dialog_button("Sign out", "sign-out")}</div>'
    if screen == "notification-center" and state in ("default", "unread"):
        actions = '<div class="page-header__actions"><button class="btn" type="button">Mark all as read</button></div>'
    return f'<div class="page-header"><div><p class="eyebrow">{esc(p[3])}</p><h1>{esc(p[4])}</h1><p class="subtitle">{esc(p[5])}</p></div>{actions}</div>'


def shell(screen: str, state: str, *, inert: bool = False, banner: str = "") -> str:
    return f'''<div{attribute("inert", "", inert)}{attribute("aria-hidden", "true", inert)} class="product-shell">
{banner}{topbar(screen)}
<main id="main" class="container product-main">{page_header(screen, state)}{content(screen, state)}</main>{footer(screen)}</div>'''


# ---------------------------------------------------------------------------
# Building blocks (mirrors of library components)
# ---------------------------------------------------------------------------

def alert(tone: str, title: str, text: str = "", actions: str = "", icon_name: str | None = None, extra: str = "", dismiss: bool = False) -> str:
    icon_name = icon_name or {"info": "info", "success": "check-circle", "warning": "warning", "danger": "alert-circle"}[tone]
    tone_class = "" if tone == "info" else f" alert--{tone}"
    body = f'<p class="alert__title">{esc(title)}</p>' + (f"<p>{text}</p>" if text else "") + (f'<div class="alert__actions">{actions}</div>' if actions else "")
    close = f'<button class="close" type="button" aria-label="Dismiss: {esc(title)}">{icon("close", "icon--sm")}</button>' if dismiss else ""
    role = ' role="alert"' if tone == "danger" else ""
    return f'<div class="alert{tone_class}{extra}"{role}>{icon(icon_name)}<div>{body}</div>{close}</div>'


def offline_banner(text: str = "Saved details are shown. Actions need a connection.") -> str:
    return alert("warning", "You’re offline", esc(text), icon_name="wifi-off")


def rating(value: str | None, count: int | None, size: str = "") -> str:
    if value is None:
        return '<span class="rating rating--unrated">Not yet rated</span>'
    return f'<span class="rating{(" " + size) if size else ""}"><span aria-hidden="true" class="rating__visual">{icon("star", "icon--sm icon--fill rating__star")}<span class="rating__value">{esc(value)}</span> <span class="rating__count">· {count} reviews</span></span><span class="visually-hidden">Rated {esc(value)} out of 5 from {count} reviews</span></span>'


def review(score: str, date: str, text: str, author: str, service: str, report: bool = True) -> str:
    report_html = f'<div class="review__actions"><a class="btn btn--link btn--sm" href="{href("report-review", "dialog")}" aria-haspopup="dialog">Report review<span class="visually-hidden"> by {esc(author)}</span></a></div>' if report else ""
    return f'<figure class="review"><div class="review__header"><span class="rating"><span aria-hidden="true" class="rating__visual">{icon("star", "icon--sm icon--fill rating__star")}<span class="rating__value">{esc(score)}</span></span><span class="visually-hidden">Rated {esc(score)} out of 5</span></span><time class="review__date" datetime="2026-10-03">{esc(date)}</time></div><blockquote class="review__quote"><p>{esc(text)}</p></blockquote><figcaption class="review__author">{esc(author)} · {esc(service)}</figcaption>{report_html}</figure>'


def gallery(items, removable: bool = False) -> str:
    out = []
    for photo, alt, caption in items:
        media = f'<img class="gallery__photo" src="../../assets/photos/{photo}" alt="{esc(alt)}">' if photo else f'<div class="gallery__art" aria-hidden="true">{icon("sparkle", "icon--lg")}</div>'
        actions = f'<div class="gallery__actions"><button class="btn btn--sm btn--ghost" type="button">{icon("trash")}Remove<span class="visually-hidden"> {esc(caption)}</span></button></div>' if removable else ""
        out.append(f'<li class="gallery__item"><figure>{media}<figcaption class="gallery__caption">{esc(caption)}</figcaption></figure>{actions}</li>')
    return f'<ul class="gallery">{"".join(out)}</ul>'


PORTFOLIO = [
    ("knotless-braids.png", "Medium knotless braids shown from the back, with neat square parts", "Medium knotless braids · Oct 2026"),
    ("nia.jpg", "Nia Okafor smiling in her studio", "Nia at the studio · Sep 2026"),
    (None, "", "Passion twists · Sep 2026"),
]


def field(label, name, value="", typ="text", *, error="", help_text="", autocomplete="", optional=False, multiline=False, counter="", addon="", options=None, disabled=False) -> str:
    described = " ".join(x for x in ((f"{name}-help" if help_text else ""), (f"{name}-count" if counter else ""), (f"{name}-error" if error else "")) if x)
    attrs = attribute("aria-invalid", "true", bool(error)) + attribute("aria-describedby", described, bool(described)) + attribute("autocomplete", autocomplete, bool(autocomplete)) + attribute("disabled", "", disabled)
    if options is not None:
        opts = "".join(f'<option{attribute("selected", "", o == value)}>{esc(o)}</option>' for o in options)
        control = f'<select class="select" id="{name}" name="{name}"{attrs}>{opts}</select>'
    elif multiline:
        control = f'<textarea class="textarea" id="{name}" name="{name}"{attrs}>{esc(value)}</textarea>'
    else:
        control = f'<input class="input" id="{name}" name="{name}" type="{typ}" value="{esc(value)}"{attrs}>'
    if addon:
        control = f'<div class="input-group"><span class="addon" aria-hidden="true">{esc(addon)}</span>{control}</div>'
    opt = ' <span class="optional">(optional)</span>' if optional else ""
    help_html = f'<span class="field__help" id="{name}-help">{esc(help_text)}</span>' if help_text else ""
    count_html = f'<span class="field__counter" id="{name}-count">{esc(counter)}</span>' if counter else ""
    err_html = f'<span class="field__error" id="{name}-error">{icon("alert-circle", "icon--sm")}{esc(error)}</span>' if error else ""
    return f'<div class="field"><label class="field__label" for="{name}">{esc(label)}{opt}</label>{control}{help_html}{count_html}{err_html}</div>'


def choices(legend, name, items, *, checked=None, cards=False, inline=False, error="", help_text="") -> str:
    """Radio group: items are (label, detail) pairs."""
    described = " ".join(x for x in ((f"{name}-help" if help_text else ""), (f"{name}-error" if error else "")) if x)
    out = []
    for i, (label, detail) in enumerate(items):
        text = f'<span class="choice__text"><span>{esc(label)}</span><small>{esc(detail)}</small></span>' if detail else f"<span>{esc(label)}</span>"
        out.append(f'<label class="choice{" choice--card" if cards else ""}"><input type="radio" name="{name}"{attribute("checked", "", checked == i)}>{text}</label>')
    group = f'<div class="choice-group{" choice-group--inline" if inline else ""}">{"".join(out)}</div>'
    help_html = f'<span class="field__help" id="{name}-help">{esc(help_text)}</span>' if help_text else ""
    err_html = f'<span class="field__error" id="{name}-error">{icon("alert-circle", "icon--sm")}{esc(error)}</span>' if error else ""
    return f'<fieldset class="field" id="{name}"{attribute("aria-describedby", described, bool(described))}{attribute("aria-invalid", "true", bool(error))}><legend class="field__label">{esc(legend)}</legend>{help_html}{group}{err_html}</fieldset>'


def checkbox(label, name, checked=False, detail="") -> str:
    text = f'<span class="choice__text"><span>{esc(label)}</span><small>{esc(detail)}</small></span>' if detail else f"<span>{esc(label)}</span>"
    return f'<label class="choice"><input type="checkbox" name="{name}"{attribute("checked", "", checked)}>{text}</label>'


def summary(errors) -> str:
    """Error summary: one link per invalid field, focused by script on submit."""
    links = "".join(f'<li><a href="#{target}">{esc(message)}</a></li>' for target, message in errors)
    count = len(errors)
    return f'<div class="alert alert--danger form-summary" tabindex="-1" role="alert" aria-labelledby="summary-title">{icon("alert-circle")}<div><p class="alert__title" id="summary-title">Check {count} answer{"s" if count != 1 else ""}</p><ul>{links}</ul></div></div>'


def submit(label: str, busy: bool, *, variant: str = "primary") -> str:
    status = f'<p class="visually-hidden" role="status">{esc(busy_text(label))}</p>' if busy else ""
    return f'<button class="btn btn--{variant}" type="submit"{attribute("aria-busy", "true", busy)}>{esc(label)}</button>{status}'


def busy_text(label: str) -> str:
    return {"Send request": "Sending your request…", "Post review": "Posting your review…", "Save changes": "Saving your changes…", "Sign in": "Signing you in…", "Create account": "Creating your account…", "Send reset link": "Sending the reset link…", "Save password": "Saving your new password…", "Resend email": "Sending a new link…", "Review request": "Checking your details…"}.get(label, "Working…")


def dl(rows) -> str:
    return '<dl class="dl">' + "".join(f"<dt>{esc(k)}</dt><dd>{v}</dd>" for k, v in rows) + "</dl>"


def story_card(title, summary_text, target, meta, *, photo=None, alt="", link_label=None, extra="") -> str:
    media = f'<img class="story-card__photo" src="../../assets/photos/{photo}" alt="{esc(alt)}">' if photo else f'<div class="story-card__art" aria-hidden="true">{icon("sparkle", "icon--lg")}</div>'
    label = link_label or f"Explore {title}"
    return f'<article class="card story-card">{media}<div class="stack"><p class="eyebrow">{esc(meta)}</p><h2 class="card__title">{esc(title)}</h2>{extra}<p class="text-muted">{esc(summary_text)}</p><a class="link--standalone" href="{href(target)}">{esc(label)}{icon("arrow-right", "icon--sm")}</a></div></article>'


def search_box(label: str, value: str = "knotless braids") -> str:
    ident = "search-" + re.sub(r"[^a-z]+", "-", label.lower()).strip("-")
    return f'<div class="search search-box"><label class="visually-hidden" for="{ident}">{esc(label)}</label>{icon("search")}<input class="input" id="{ident}" type="search" value="{esc(value)}"></div>'


def pagination(state: str, total: str = "126", noun: str = "styles") -> str:
    if state != "long":
        return ""
    return f'<nav class="pagination" aria-label="Results pages"><p class="pagination__summary">Showing 1–12 of {total} {noun}</p><a class="btn btn--ghost btn--sm" href="default.html" aria-disabled="true">{icon("chevron-left", "icon--sm")}Previous</a><a class="btn btn--ghost btn--sm" href="long.html" aria-current="page">1</a><a class="btn btn--ghost btn--sm" href="long.html">2</a><a class="btn btn--ghost btn--sm" href="long.html">3</a><a class="btn btn--ghost btn--sm" href="long.html">Next{icon("chevron-right", "icon--sm")}</a></nav>'


def empty(title, text, actions, icon_name="sparkle", tone="", reference="") -> str:
    tone_class = f" empty--{tone}" if tone else ""
    ref = f'<p class="empty__reference">Reference {esc(reference)}</p>' if reference else ""
    return f'<section class="empty{tone_class}" aria-labelledby="empty-title"><div class="empty__icon" aria-hidden="true">{icon(icon_name, "icon--lg")}</div><h2 class="empty__title" id="empty-title">{esc(title)}</h2><p class="empty__text">{esc(text)}</p>{ref}<div class="empty__actions">{actions}</div></section>'


# ---------------------------------------------------------------------------
# Generic states
# ---------------------------------------------------------------------------

def loading(screen: str) -> str:
    title = PAGE_MAP[screen][1]
    label = f'<p class="visually-hidden" role="status">Loading {esc(title.lower())}…</p>'
    if screen in COLLECTION_SCREENS:
        cards = "".join('<div class="card story-card"><span class="skeleton skeleton--rect skeleton--hero"></span><span class="skeleton skeleton--title"></span><span class="skeleton skeleton--text"></span></div>' for _ in range(3))
        return f'<section class="feature-grid" aria-busy="true" aria-label="Loading {esc(title.lower())}">{label}{cards}</section>'
    if screen in FORM_SCREENS:
        rows = "".join('<span class="skeleton skeleton--text"></span><span class="skeleton skeleton--rect"></span>' for _ in range(3))
        return f'<section class="form-panel card stack" aria-busy="true" aria-label="Loading {esc(title.lower())}">{label}<span class="skeleton skeleton--title"></span>{rows}</section>'
    return f'<div class="detail-grid" aria-busy="true" aria-label="Loading {esc(title.lower())}">{label}<section class="card stack"><span class="skeleton skeleton--rect skeleton--hero"></span><span class="skeleton skeleton--title"></span><span class="skeleton skeleton--text"></span><span class="skeleton skeleton--text"></span></section><aside class="card stack"><span class="skeleton skeleton--title"></span><span class="skeleton skeleton--text"></span></aside></div>'


def error_state(screen: str) -> str:
    title = PAGE_MAP[screen][1]
    explore = anchor("Go to requests", "braider-requests") if is_braider(screen) else anchor("Explore styles", "style-gallery")
    return empty(f"We couldn’t load {title.lower()}", "Check your connection and try again. Nothing you entered was lost.", f'<a class="btn btn--primary" href="default.html">{icon("refresh")}Try again</a>{explore}', "alert-circle", "error")


EMPTY = {
    "style-gallery": ("No styles to show yet", "We’re adding styles to the gallery. Check back soon, or browse braiders directly.", lambda: anchor("Browse braiders", "matching-braiders", True)),
    "style-detail": ("Details are on their way", "We haven’t published the details for this style yet. Other styles are ready to explore.", lambda: anchor("Explore styles", "style-gallery", True)),
    "matching-braiders": ("No braiders offer this style yet", "No braiders near Toronto list knotless braids right now. Try a related style.", lambda: anchor("Explore styles", "style-gallery", True)),
    "booking-request": ("Nia has no open times right now", "Nia hasn’t offered any times for this service yet. Check back soon or choose another braider.", lambda: anchor("See other braiders", "matching-braiders", True)),
    "appointment-detail": ("This appointment has no details yet", "We’re still preparing the details for HP-1048. Check back in a few minutes.", lambda: anchor("My appointments", "my-appointments", True)),
    "my-appointments": ("No appointments yet", "When you request a visit, you’ll find its status and details here.", lambda: anchor("Explore styles", "style-gallery", True)),
    "care-and-review": ("No care guidance for this visit", "Nia hasn’t shared care guidance for this style. You can still review your visit.", lambda: anchor("My appointments", "my-appointments", True)),
    "notification-center": ("You’re all caught up", "Updates about requests, appointments and reviews will appear here.", lambda: anchor("My appointments", "my-appointments", True)),
    "braider-requests": ("No requests waiting", "New requests and change requests appear here. Keep your availability current so customers can book.", lambda: anchor("Manage availability", "braider-availability", True)),
    "braider-services": ("Add your first service", "Customers can only find and request you for styles you list as services.", lambda: dialog_button("Add service", "edit-service", "primary")),
    "braider-availability": ("No offered times", "Add the times you can take appointments. Customers can only request offered times.", lambda: dialog_button("Add offered time", "add-slot", "primary")),
}


def no_results(screen: str) -> str:
    if screen == "my-appointments":
        criteria, chip, text = "Search my appointments", "Passion twists", "No appointments match “passion twists”. Clear the search to see all of them."
    else:
        criteria = "Search matching braiders" if screen == "matching-braiders" else "Search style gallery"
        chip = "Under $150 · within 5 km" if screen == "matching-braiders" else "Locs"
        text = "No braiders match these filters. Try a wider price range or distance." if screen == "matching-braiders" else "No styles match “twisted locs” in Locs. Clear the search or choose another category."
    return f'<div class="filter-row">{search_box(criteria, "twisted locs" if screen == "style-gallery" else "knotless braids" if screen == "matching-braiders" else "passion twists")}<span class="chip chip--static">{esc(chip)}</span></div>' + empty("No matches", text, '<a class="btn btn--primary" href="default.html">Clear filters</a>', "search")


def edge_card(screen: str) -> str:
    if screen in ("style-gallery",):
        return '<div class="feature-grid">' + story_card("Extra-long feed-in boho knotless braids with curly ends", "Typical time not listed · typically $280–$420", "style-detail", "New style") + "</div>"
    if screen in ("matching-braiders", "braider-profile"):
        return f'<div class="card stack"><p class="eyebrow">Long name and no photo</p><h2 class="card__title">Amara Nkiruka Adeyemi-Williams</h2>{rating("4.7", 1284)}<p class="text-muted">Senior knotless braid specialist serving Etobicoke, North York, Scarborough and surrounding neighbourhoods.</p></div>'
    if screen == "my-appointments":
        return f'<div class="card appointment-row"><div class="stack stack--sm"><span class="badge badge--danger">Declined</span><h2 class="card__title">Jules Baptiste · extra-long boho knotless braids with curly ends</h2><p class="text-muted">Fri 16 Oct · 9:00 am · Jules couldn’t take this request</p></div>{anchor("Find another braider", "matching-braiders")}</div>'
    if screen == "style-detail":
        return alert("info", "Some facts aren’t published for this style", "Typical wear isn’t listed yet, so it’s left out rather than guessed.")
    return ""


def content(screen: str, state: str) -> str:
    if state == "loading":
        return loading(screen)
    if state == "error":
        return error_state(screen)
    if state == "empty" and screen in EMPTY:
        title, text, act = EMPTY[screen]
        return empty(title, text, act())
    if state == "no-results":
        return no_results(screen)
    if screen in FORM_SCREENS:
        return form_content(screen, state)
    banner = offline_banner() if state == "offline" else ""
    if state == "edge":
        return edge_card(screen) + content(screen, "default")
    return banner + page_body(screen, state)


# ---------------------------------------------------------------------------
# Screens
# ---------------------------------------------------------------------------

def page_body(screen: str, state: str) -> str:
    partial = state == "partial"
    if screen == "style-gallery":
        chips = "".join(f'<button type="button" class="chip" aria-pressed="{"true" if i == 0 else "false"}">{esc(c)}</button>' for i, c in enumerate(["All styles", "Braids", "Twists", "Locs"]))
        cards = (
            story_card("Knotless braids", "4–7 hours typical · typically $160–$300", "style-detail", "Braids", photo="knotless-braids.png", alt="Medium knotless braids shown from the back and side")
            + story_card("Passion twists", "3–6 hours typical · typically $140–$260", "style-detail", "Twists")
            + story_card("Cornrows", "2–4 hours typical · price varies by pattern", "style-detail", "Braids")
        )
        return f'<section class="stack" aria-label="Style gallery"><div class="filter-row">{search_box("Search styles")}<a class="btn" href="{href("matching-braiders")}">Find braiders</a></div><div class="chip-row" role="group" aria-label="Style category">{chips}</div><div class="feature-grid">{cards}</div>{pagination(state)}</section>'
    if screen == "style-detail":
        warn = alert("warning", "Some details are unavailable", "Typical wear couldn’t load. Time and price are up to date.", '<a href="default.html">Retry</a>') if partial else ""
        wear = "" if partial else '<div class="fact"><span class="fact__value">4–8 weeks</span><span class="fact__label">Typical wear</span></div>'
        variations = '<ul class="list"><li class="list__item"><div class="list__body"><span class="list__title">Small</span><span class="list__meta">Finer braids, about 6–7 hours</span></div></li><li class="list__item"><div class="list__body"><span class="list__title">Medium</span><span class="list__meta">The most requested size, about 5 hours</span></div></li><li class="list__item"><div class="list__body"><span class="list__title">Large</span><span class="list__meta">Quicker install, about 4 hours</span></div></li></ul>'
        factors = '<ul><li>Length and braid size</li><li>Hair density and current length</li><li>Whether you bring extensions</li><li>Add-ons such as curly ends or colour</li></ul>'
        return warn + f'<div class="detail-grid"><section class="card"><img class="hero-photo" src="../../assets/photos/knotless-braids.png" alt="Long medium knotless braids with neat, visible parting"><h2>What to expect</h2><p>Knotless braids start with your natural hair, then extensions are fed in gradually. The finish is flexible and usually feels lighter at the roots.</p><div class="fact-grid"><div class="fact"><span class="fact__value">4–7 hours</span><span class="fact__label">Typical time</span></div><div class="fact"><span class="fact__value">$160–$300</span><span class="fact__label">Typical price</span></div>{wear}</div><h2>Variations</h2>{variations}<h2>What changes the final quote</h2>{factors}<p class="text-muted">Prices are typical ranges. Your braider confirms the final price when they accept your request.</p></section><aside class="card stack"><h2>Make it yours</h2><p>Choose small, medium or large braids, then talk through length and colour with your braider.</p>{anchor("Find a braider", "matching-braiders", True)}</aside></div>'
    if screen == "matching-braiders":
        cards = (
            story_card("Nia Okafor", "Toronto West · knotless braids from $180", "braider-profile", "Available Sat 24 Oct", photo="nia.jpg", alt="Nia Okafor smiling in her studio", link_label="View Nia’s profile", extra=rating("4.9", 86))
            + story_card("Aisha Mensah", "North York · knotless braids from $195", "braider-profile", "No times offered yet", link_label="View Aisha’s profile", extra=rating("4.8", 64))
            + story_card("Jules Baptiste", "Scarborough · knotless braids from $170", "braider-profile", "Available Sun 25 Oct", link_label="View Jules’s profile", extra=rating(None, None))
        )
        return f'<section class="stack" aria-label="Matching braiders"><div class="filter-row">{search_box("Search matching braiders", "")}{dialog_button("Filters", "filter-braiders")}</div><div class="chip-row" role="group" aria-label="Active filters"><span class="chip chip--static">Knotless braids</span></div><div class="feature-grid">{cards}</div>{pagination(state, "41", "braiders")}</section>'
    if screen == "braider-profile":
        reviews_empty = state == "empty"
        if partial:
            reviews = alert("warning", "Reviews couldn’t load", "Nia’s services, prices and policies are up to date.", '<a href="default.html">Retry reviews</a>')
        elif reviews_empty:
            reviews = empty("No reviews yet", "Nia hasn’t received a published review yet. Her services and policies are below.", "", "star")
        else:
            reviews = rating("4.9", 86) + review("5", "3 Oct 2026", "The parts were so neat and Nia checked that nothing felt too tight.", "Maya Chen", "Medium knotless braids") + review("5", "26 Sep 2026", "Quick, gentle and my braids lasted seven weeks.", "Kemi Adebayo", "Passion twists")
        portfolio = empty("No portfolio photos yet", "Nia hasn’t added portfolio work yet. You can still read her services and policies.", "", "sparkle") if reviews_empty else gallery(PORTFOLIO)
        services = '<ul class="list"><li class="list__item"><div class="list__body"><span class="list__title">Medium knotless braids</span><span class="list__meta">From $180 · about 5 hours</span></div></li><li class="list__item"><div class="list__body"><span class="list__title">Passion twists</span><span class="list__meta">From $160 · about 4 hours</span></div></li></ul>'
        head = f'<div class="profile-head"><span class="avatar avatar--xl" aria-hidden="true">NO</span><div class="stack stack--sm"><h2>Nia Okafor</h2>{rating(None, None) if reviews_empty else rating("4.9", 86)}<p class="text-muted">Toronto West · travels up to 10 km</p></div></div>'
        return f'<div class="detail-grid"><div class="stack"><section class="card" aria-labelledby="about">{head}<h2 id="about" class="visually-hidden">About Nia</h2><p>I specialize in comfortable, neat braids. Bring inspiration photos and we’ll confirm the details together.</p>{anchor("Request an appointment", "booking-request", True)}</section><section class="card" aria-labelledby="services-title"><h2 id="services-title">Services</h2>{services}</section><section class="card" aria-labelledby="work-title"><h2 id="work-title">Recent work</h2>{portfolio}</section><section class="card" aria-labelledby="reviews-title"><h2 id="reviews-title">Customer reviews</h2>{reviews}</section></div><aside class="card stack" aria-labelledby="before"><h2 id="before">Before you book</h2>{dl([("Service area", "Toronto West. Studio address shared after Nia accepts."), ("Preparation", "Arrive with washed, detangled hair."), ("Changes", "Request a change at least 48 hours before."), ("Cancellation", "Free up to 48 hours before; later cancellations may be charged $40.")])}</aside></div>'
    if screen == "appointment-detail":
        confirmed = state == "success"
        badge = '<span class="badge badge--success">Confirmed</span>' if confirmed else '<span class="badge badge--warning">Awaiting reply</span>'
        rows = [
            ("When", "Sat 24 Oct · 10:00 am (Toronto time) · about 5 hours" if confirmed else "Sat 24 Oct · 10:00 am requested (Toronto time) · about 5 hours"),
            ("Price", "$210 agreed with Nia" if confirmed else "Estimate $180–$240 · not confirmed"),
            ("Location", "1246 Bloor Street West, Toronto" if confirmed else "Toronto West · address shared after Nia accepts"),
            ("Contact", "Nia can reach you at 416-555-0148"),
            ("Policy", "Free changes and cancellations up to 48 hours before"),
        ]
        prep = alert("warning", "Preparation checklist unavailable", "We couldn’t load Nia’s checklist. Your appointment details are current.", '<a href="default.html">Retry checklist</a>') if partial else '<ol class="list"><li class="list__item">Wash and detangle your hair.</li><li class="list__item">Bring the extensions you discussed with Nia.</li><li class="list__item">Arrive 10 minutes early.</li></ol>'
        actions = f'<div class="cluster">{dialog_button("Request a change", "change-appointment")}{dialog_button("Cancel request" if not confirmed else "Cancel appointment", "cancel-appointment", "link")}<a class="btn btn--ghost" href="{href("help")}">Get help with HP-1048</a></div>'
        return f'<div class="detail-grid"><section class="card stack" aria-labelledby="summary-heading">{badge}<h2 id="summary-heading">Medium knotless braids with Nia Okafor</h2>{dl(rows)}{actions}</section><aside class="card stack" aria-labelledby="prep-title"><h2 id="prep-title">Prepare for your visit</h2>{prep}</aside></div>'
    if screen == "my-appointments":
        chips = "".join(f'<button type="button" class="chip" aria-pressed="{"true" if i == 0 else "false"}">{esc(c)}</button>' for i, c in enumerate(["All", "Upcoming", "Past"]))
        rows = (
            f'<div class="card appointment-row"><div class="stack stack--sm"><span class="badge badge--warning">Awaiting reply</span><h2 class="card__title">Nia Okafor · medium knotless braids</h2><p class="text-muted">Sat 24 Oct · 10:00 am · estimate $180–$240 · HP-1048</p></div><a class="btn btn--primary" href="{href("appointment-detail")}">View request<span class="visually-hidden"> HP-1048</span></a></div>'
            + f'<div class="card appointment-row"><div class="stack stack--sm"><span class="badge">Completed</span><h2 class="card__title">Nia Okafor · medium knotless braids</h2><p class="text-muted">Sat 3 Oct · 10:00 am · $205 paid at the studio · HP-0992</p></div><div class="cluster"><a class="btn" href="{href("care-and-review")}">Care and review<span class="visually-hidden"> HP-0992</span></a><a class="btn btn--ghost" href="{href("booking-request")}">Book again<span class="visually-hidden"> with Nia</span></a></div></div>'
        )
        return f'<section class="stack" aria-label="My appointments"><div class="filter-row">{search_box("Search my appointments", "")}<div class="chip-row" role="group" aria-label="Show">{chips}</div></div>{rows}{pagination(state, "28", "appointments")}</section>'
    if screen == "notification-center":
        first_unread = state != "read"
        def row(title, meta, target, unread):
            marker = '<span class="visually-hidden">Unread: </span>' if unread else ""
            mark = f'<button class="btn btn--ghost btn--sm" type="button">Mark as read<span class="visually-hidden"> {esc(title)}</span></button>' if unread else ""
            modifier = " list__item--unread" if unread else ""
            return f'<li><div class="list__item{modifier}"><div class="list__body"><a class="list__title" href="{href(target)}">{marker}{esc(title)}</a><span class="list__meta">{esc(meta)}</span></div>{mark}</div></li>'
        items = row("Nia received your request", "Today at 9:42 am · She will confirm the time and final price.", "appointment-detail", first_unread) + row("Review your visit with Nia", "Yesterday at 6:10 pm · Share how your knotless braids turned out.", "care-and-review", first_unread) + row("Your email is verified", "Thu 8 Oct · maya.chen@example.com is confirmed.", "account-settings", False)
        stale = alert("warning", "Showing updates from 9:42 am", "You’re offline, so newer updates may be missing.", icon_name="wifi-off") if state == "offline" else ""
        return stale + f'<section class="card card--flush" aria-label="Updates"><ul class="list">{items}</ul></section>'
    if screen == "help":
        offline = offline_banner("Help articles saved in this browser are shown. Email support needs a connection.") if state == "offline" else ""
        topics = (
            story_card("How requests work", "A request becomes an appointment only when the braider accepts it.", "help", "Requests", link_label="Read about requests")
            + story_card("Prices and estimates", "Typical ranges guide you; your braider confirms the final price.", "help", "Estimates", link_label="Read about estimates")
            + story_card("Changing an appointment", "Request a new offered time; your current time stays until accepted.", "help", "Changes", link_label="Read about changes")
            + story_card("Reviews", "Review a completed visit once. Report a review that breaks the rules.", "help", "Reviews", link_label="Read about reviews")
        )
        contact = '<section class="card stack" aria-labelledby="contact"><h2 id="contact">Contact support</h2><p>Email us with your request number, like HP-1048, and we’ll reply within one business day.</p><a class="btn btn--primary" href="mailto:support@hairpop.example?subject=Help%20with%20HP-1048">Email support</a></section>'
        return offline + f'<div class="feature-grid">{topics}</div>{contact}'
    if screen in ("terms", "privacy"):
        if screen == "terms":
            body = "<h2>Using HairPop</h2><p>HairPop helps customers discover independent braiders and send appointment requests. A request is pending until the braider accepts it.</p><h2>Prices and appointments</h2><p>Prices shown before acceptance are estimates. The braider confirms the time, place and final price when they accept.</p><h2>Reviews</h2><p>Reviews describe real, completed visits. We may remove reviews that break these terms after moderation.</p>"
        else:
            body = "<h2>Your information</h2><p>We use your name, email and phone to manage requests and let your braider reach you. Hair details are shared only with the braider you request.</p><h2>Cookies and storage</h2><p>Essential storage keeps you signed in. Optional usage data is stored only if you allow it, and you can change that choice in Cookie preferences.</p><h2>Your choices</h2><p>Update your contact details in Account settings. Contact support@hairpop.example for help with your information.</p>"
        return f'<article class="card legal-copy"><p class="text-muted">Effective 1 Oct 2026</p>{body}</article>'
    if screen == "not-found":
        return empty("Page not found", "Check the address, or start again from the style gallery.", anchor("Explore styles", "style-gallery", True), "search")
    if screen == "forbidden":
        return empty("Access unavailable", "This page belongs to another account, or it isn’t available any more.", anchor("Sign in", "sign-in", True) + anchor("My appointments", "my-appointments"), "lock")
    if screen == "server-error":
        return empty("Something went wrong on our side", "Nothing was resent. Try again in a moment, or check My appointments to see what was saved.", f'<a class="btn btn--primary" href="default.html">{icon("refresh")}Try again</a>{anchor("My appointments", "my-appointments")}', "alert-circle", "error", "ERR-7F3K2")
    if screen == "offline":
        saved = '<section class="card stack" aria-labelledby="saved"><h2 id="saved">Saved in this browser</h2><div class="appointment-row"><div class="stack stack--sm"><span class="badge badge--warning">Awaiting reply</span><p><strong>Nia Okafor · medium knotless braids</strong></p><p class="text-muted">Sat 24 Oct · 10:00 am · last updated today at 9:42 am</p></div><a class="btn" href="' + href("appointment-detail", state="offline") + '">View saved details</a></div></section>'
        return empty("No connection", "New requests, changes and reviews need a connection. Your saved appointment is below.", f'<a class="btn btn--primary" href="default.html">{icon("refresh")}Try again</a>', "wifi-off", "warning") + saved
    if screen == "braider-requests":
        def req(ref, who, what, when, est, detail, kind="request"):
            badge = '<span class="badge badge--info">Change requested</span>' if kind == "change" else '<span class="badge badge--warning">Awaiting your reply</span>'
            return f'<article class="card stack" aria-labelledby="{ref}">{badge}<h2 class="card__title" id="{ref}">{esc(who)} · {esc(what)}</h2>{dl([("Reference", ref.upper()), ("Requested time", when), ("Estimate", est), ("Hair details", detail)])}<div class="cluster"><a class="btn btn--primary" href="{href("respond-to-request", "dialog")}" aria-haspopup="dialog">Respond<span class="visually-hidden"> to {ref.upper()}</span></a></div></article>'
        items = (
            req("hp-1048", "Maya Chen", "medium knotless braids", "Sat 24 Oct · 10:00 am · about 5 hours", "$180–$240", "Shoulder length; bringing my own extensions")
            + req("hp-1052", "Kemi Adebayo", "passion twists", "Sun 25 Oct · 1:00 pm · about 4 hours", "$160–$220", "Mid-back length; no extensions")
            + req("hp-1031", "Zara Ali", "medium knotless braids", "Sat 17 Oct · 9:00 am (was Fri 16 Oct · 9:00 am)", "$210 agreed", "Wants a change of day", "change")
        )
        return f'<section class="stack" aria-label="Requests">{items}</section>'
    if screen == "braider-services":
        def svc(name, style, price, hours, published):
            badge = '<span class="badge badge--success">Published</span>' if published else '<span class="badge">Unpublished</span>'
            toggle = "Unpublish" if published else "Publish"
            return f'<li><div class="list__item"><div class="list__body"><span class="list__title">{esc(name)}</span><span class="list__meta">{esc(style)} · {esc(price)} · about {esc(hours)}</span></div>{badge}<div class="cluster"><a class="btn" href="{href("edit-service", "dialog")}" aria-haspopup="dialog">Edit<span class="visually-hidden"> {esc(name)}</span></a><button class="btn btn--ghost" type="button">{toggle}<span class="visually-hidden"> {esc(name)}</span></button><a class="btn btn--ghost" href="{href("remove-service", "dialog")}" aria-haspopup="dialog">Remove<span class="visually-hidden"> {esc(name)}</span></a></div></div></li>'
        items = svc("Medium knotless braids", "Knotless braids", "from $180", "5 hours", True) + svc("Passion twists", "Passion twists", "from $160", "4 hours", True) + svc("Boho knotless braids", "Knotless braids", "from $220", "6 hours", False)
        return f'<section class="card card--flush" aria-label="Services"><ul class="list">{items}</ul></section>'
    if screen == "braider-availability":
        def slot(when, note, requested=False):
            badge = '<span class="badge badge--warning">Requested · HP-1048</span>' if requested else '<span class="badge">Open</span>'
            action = "" if requested else f'<a class="btn btn--ghost" href="{href("withdraw-slot", "dialog")}" aria-haspopup="dialog">Withdraw<span class="visually-hidden"> {esc(when)}</span></a>'
            return f'<li><div class="list__item"><div class="list__body"><span class="list__title">{esc(when)}</span><span class="list__meta">{esc(note)}</span></div>{badge}{action}</div></li>'
        items = slot("Sat 24 Oct · 10:00 am", "Up to 6 hours", True) + slot("Sun 25 Oct · 11:00 am", "Up to 6 hours") + slot("Sun 25 Oct · 1:00 pm", "Up to 4 hours") + slot("Sat 31 Oct · 10:00 am", "Up to 6 hours")
        return f'<section class="card card--flush" aria-label="Offered times"><ul class="list">{items}</ul></section>'
    return ""


def form_content(screen: str, state: str) -> str:
    invalid = state == "invalid"
    busy = state == "submitting"
    offline = state == "offline"
    if state == "success":
        return success(screen)
    if screen == "braider-sign-in" and state == "denied":
        go = f'<a href="{href("style-gallery")}">Go to HairPop</a>'
        denied = alert("danger", "This app is for braider accounts", "Sign in with the email you use to manage your HairPop services. Customers can book from the main HairPop site.", go)
        return f'<section class="form-panel card stack" aria-labelledby="form-title"><h2 id="form-title">Sign in</h2>{denied}<form class="stack" action="default.html" novalidate>{auth_fields(screen, False)}<div class="form-actions">{submit("Sign in", False)}</div></form></section>'
    errors = []
    body = ""
    title = "Your details"
    cta = PAGE_MAP_CTA.get(screen, "Save changes")
    aside = ""
    if screen == "booking-request":
        title = "Your request"
        errors = [("time", "Choose one of Nia’s offered times"), ("hair", "Describe your hair so Nia can prepare")] if invalid else []
        body = (
            choices("Service", "service", [("Medium knotless braids", "From $180 · about 5 hours"), ("Passion twists", "From $160 · about 4 hours")], checked=0, cards=True)
            + choices("Preferred time", "time", [("Sat 24 Oct · 10:00 am", "Offered by Nia"), ("Sun 25 Oct · 11:00 am", "Offered by Nia"), ("Sat 31 Oct · 10:00 am", "Offered by Nia")], checked=None if invalid else 0, cards=True, error="Choose one of Nia’s offered times." if invalid else "", help_text="Times are in Toronto time.")
            + field("Your email", "email", "maya.chen@example.com", "email", autocomplete="email")
            + field("Phone", "phone", "416-555-0148", "tel", autocomplete="tel", optional=True, help_text="Nia may text you about timing.")
            + field("Hair details", "hair", "" if invalid else "Shoulder length; bringing my own extensions", multiline=True, error="Describe your hair, for example its length and whether you’re bringing extensions." if invalid else "", counter="0 / 500" if invalid else "43 / 500")
        )
        body += alert("info", "Estimate $180–$240 · about 5 hours", "This is an estimate. Nia confirms the final price and time when she accepts. Free cancellation up to 48 hours before. Read the <a href=\"" + href("terms") + "\">Terms of use</a>.")
        aside = '<p class="text-muted">You’ll review everything before Nia receives your request.</p>'
        cta = "Review request"
    elif screen == "care-and-review":
        title = "Review your visit"
        errors = [("rating", "Choose a rating from 1 to 5"), ("review", "Write a few words about your visit")] if invalid else []
        care = '<section class="card stack" aria-labelledby="care-title"><h2 id="care-title">Care guidance from Nia</h2><ol class="list"><li class="list__item">Keep your scalp moisturized with a light oil twice a week.</li><li class="list__item">Sleep with a satin bonnet or pillowcase.</li><li class="list__item">Book a take-down within 8 weeks.</li></ol><p class="text-muted">Source: Nia Okafor, for medium knotless braids.</p><a class="btn" href="' + href("booking-request") + '">Book again with Nia</a></section>'
        body = (
            choices("Rating", "rating", [("1", ""), ("2", ""), ("3", ""), ("4", ""), ("5 (excellent)", "")], checked=None if invalid else 4, inline=True, error="Choose a rating from 1 to 5." if invalid else "")
            + field("Your review", "review", "" if invalid else "Nia explained each step and the braids feel comfortable.", multiline=True, error="Write a few words about your visit, like how the braids feel." if invalid else "", counter="0 / 1000" if invalid else "56 / 1000")
        )
        return (offline_banner("Your review stays here. Connect to post it.") if offline else "") + f'<div class="detail-grid">{care}<section class="card stack" aria-labelledby="form-title"><h2 id="form-title">{esc(title)}</h2>{summary(errors) if errors else ""}<form class="stack" action="{href(screen, state="success")}" novalidate>{body}<div class="form-actions">{submit("Post review", busy)}</div></form></section></div>'
    elif screen == "account-settings":
        errors = [("email", "Enter an email address like name@example.com")] if invalid else []
        body = (
            field("Name", "name", "Maya Chen", autocomplete="name")
            + field("Email", "email", "maya.chen@example" if invalid else "maya.chen@example.com", "email", autocomplete="email", help_text="If you change it, we’ll ask you to verify the new address.", error="Enter an email address like name@example.com." if invalid else "")
            + field("Phone", "phone", "416-555-0148", "tel", autocomplete="tel", optional=True)
        )
    elif screen == "verify-email":
        title = "Verify your email"
        body = '<p>Open the link we sent to <strong>maya.chen@example.com</strong>. The link works once and expires in 24 hours.</p><p class="text-muted">Didn’t get it? Check your spam folder, then send a new link.</p>'
        cta = "Resend email"
    elif screen == "forgot-password":
        title = "Reset link"
        errors = [("email", "Enter the email address on your account")] if invalid else []
        body = field("Email", "email", "maya.chen@" if invalid else "maya.chen@example.com", "email", autocomplete="email", error="Enter the email address on your account, like name@example.com." if invalid else "")
    elif screen == "reset-password":
        title = "New password"
        errors = [("password", "Use at least 12 characters"), ("confirm", "Make the passwords match")] if invalid else []
        body = field("New password", "password", "", "password", autocomplete="new-password", help_text="Use at least 12 characters.", error="Use at least 12 characters." if invalid else "") + field("Confirm password", "confirm", "", "password", autocomplete="new-password", error="Enter the same password again." if invalid else "")
    elif screen == "braider-profile-content":
        title = "Profile details"
        errors = [("area", "Enter the area you serve")] if invalid else []
        conflict = alert("warning", "Your profile changed in another window", "Your edits are kept here. Refresh to see the latest version, then save again.", '<a href="default.html">Refresh profile</a>') if state == "conflict" else ""
        blank = state == "empty"
        body = (
            field("About you", "bio", "I specialize in comfortable, neat braids. Bring inspiration photos and we’ll confirm the details together.", multiline=True, counter="104 / 600")
            + field("Service area", "area", "" if invalid else "Toronto West · travels up to 10 km", error="Enter the area you serve, like Toronto West." if invalid else "")
            + field("Studio address", "address", "1246 Bloor Street West, Toronto", autocomplete="street-address", help_text="Private. Shared only with customers after you accept their request.")
            + field("Preparation guidance", "prep", "Arrive with washed, detangled hair. Bring the extensions we discussed.", multiline=True)
            + field("Change policy", "changes", "Request a change at least 48 hours before.", multiline=True)
            + field("Cancellation policy", "cancellation", "Free up to 48 hours before; later cancellations may be charged $40.", multiline=True, help_text="New requests show this policy. Existing requests keep the policy they were sent with.")
        )
        work = empty("No portfolio photos yet", "Add photos of your work so customers can see what to expect.", dialog_button("Add photo", "add-portfolio-item", "primary"), "sparkle") if blank else gallery(PORTFOLIO, removable=True)
        if blank:
            body = field("About you", "bio", "", multiline=True, counter="0 / 600", help_text="Introduce yourself and the styles you love.") + field("Service area", "area", "", help_text="For example, Toronto West.") + field("Studio address", "address", "", autocomplete="street-address", help_text="Private. Shared only with customers after you accept their request.") + field("Preparation guidance", "prep", "", multiline=True) + field("Change policy", "changes", "", multiline=True) + field("Cancellation policy", "cancellation", "", multiline=True)
        portfolio = f'<section class="card stack" aria-labelledby="portfolio-title"><div class="card__header"><h2 id="portfolio-title">Portfolio</h2>{"" if blank else dialog_button("Add photo", "add-portfolio-item")}</div>{work}</section>'
        return (offline_banner("Your edits stay here. Connect to save them.") if offline else "") + conflict + f'<div class="stack"><section class="card stack" aria-labelledby="form-title"><h2 id="form-title">{esc(title)}</h2>{summary(errors) if errors else ""}<form class="stack" action="{href(screen, state="success")}" novalidate>{body}<div class="form-actions">{submit("Save changes", busy)}</div></form></section>{portfolio}</div>'
    else:
        title = "Sign in" if screen in ("sign-in", "braider-sign-in") else "Create your account"
        errors = [("email", "Enter a full email address"), ("password", "Use at least 12 characters" if screen == "sign-up" else "Enter your password")] if invalid else []
        body = auth_fields(screen, invalid)
    banner = offline_banner("Your details stay here. Connect before sending.") if offline else ""
    links = ""
    if screen == "sign-in":
        links = f'<p><a href="{href("forgot-password")}">Forgot your password?</a></p><p class="text-muted">New to HairPop? <a href="{href("sign-up")}">Create an account</a></p>'
    elif screen == "sign-up":
        links = f'<p class="text-muted">Already have an account? <a href="{href("sign-in")}">Sign in</a>. By creating an account you agree to the <a href="{href("terms")}">Terms</a> and <a href="{href("privacy")}">Privacy</a>.</p>'
    elif screen == "braider-sign-in":
        links = f'<p><a href="{href("forgot-password")}">Forgot your password?</a></p>'
    elif screen in ("forgot-password", "reset-password"):
        links = f'<p><a href="{href("sign-in")}">Back to sign in</a></p>'
    action_target = href("request-review", "dialog") if screen == "booking-request" else href(screen, state="success")
    return banner + f'<section class="form-panel card stack" aria-labelledby="form-title"><h2 id="form-title">{esc(title)}</h2>{summary(errors) if errors else ""}<form class="stack" action="{action_target}" novalidate>{body}{aside}<div class="form-actions">{submit(cta, busy)}</div></form>{links}</section>'


PAGE_MAP_CTA = {"booking-request": "Review request", "sign-in": "Sign in", "braider-sign-in": "Sign in", "sign-up": "Create account", "forgot-password": "Send reset link", "reset-password": "Save password", "verify-email": "Resend email", "account-settings": "Save changes", "care-and-review": "Post review", "braider-profile-content": "Save changes"}


def auth_fields(screen: str, invalid: bool) -> str:
    out = ""
    if screen == "sign-up":
        out += field("Name", "name", "Maya Chen", autocomplete="name")
    out += field("Email", "email", "maya.chen@" if invalid else ("nia.okafor@example.com" if screen == "braider-sign-in" else "maya.chen@example.com"), "email", autocomplete="email", error="Enter a full email address, like name@example.com." if invalid else "")
    if screen == "sign-up":
        out += field("Password", "password", "", "password", autocomplete="new-password", help_text="Use at least 12 characters.", error="Use at least 12 characters." if invalid else "")
    else:
        out += field("Password", "password", "", "password", autocomplete="current-password", error="Enter your password." if invalid else "")
    return out


def success(screen: str) -> str:
    data = {
        "booking-request": ("Request HP-1048 sent to Nia", "This is a request, not a confirmed appointment. Nia will reply with the final time and price.", anchor("View request HP-1048", "appointment-detail", True)),
        "care-and-review": ("Your review is posted", "Thank you. Your review helps others choose a braider with confidence.", anchor("Book again with Nia", "booking-request", True) + anchor("My appointments", "my-appointments")),
        "account-settings": ("Your changes are saved", "Braiders will use your new details for upcoming appointments.", anchor("My appointments", "my-appointments", True)),
        "sign-in": ("You’re signed in", "Welcome back, Maya.", anchor("My appointments", "my-appointments", True)),
        "sign-up": ("Your account is ready", "We sent a verification link to maya.chen@example.com.", anchor("Verify email", "verify-email", True)),
        "forgot-password": ("Check your inbox", "If this email belongs to an account, a reset link is on its way. The link expires in 1 hour.", anchor("Back to sign in", "sign-in", True)),
        "reset-password": ("Password updated", "Sign in with your new password.", anchor("Sign in", "sign-in", True)),
        "verify-email": ("Your email is verified", "maya.chen@example.com is confirmed for appointment updates.", anchor("Explore styles", "style-gallery", True)),
        "braider-profile-content": ("Your profile is updated", "Customers see the new details on your public profile now.", anchor("View public profile", "braider-profile", True)),
    }[screen]
    return empty(data[0], data[1], data[2], "check-circle", "success")


# ---------------------------------------------------------------------------
# Dialogs
# ---------------------------------------------------------------------------

DESTRUCTIVE = {"cancel-appointment", "sign-out", "remove-service", "withdraw-slot", "braider-sign-out"}


def dialog_content(item, state: str) -> str:
    screen, title, source, description, _, _ = item
    invalid = state == "invalid"
    busy = state == "busy"
    fields = ""
    errors = []
    size = ""
    if screen == "filter-braiders":
        errors = [("price", "Enter a maximum price of at least $160")] if invalid else []
        fields = field("Maximum price", "price", "120" if invalid else "250", "number", addon="$", error="Enter a maximum price of at least $160, the lowest price for this style." if invalid else "") + field("Distance from Toronto", "distance", "Within 10 km", options=["Within 5 km", "Within 10 km", "Within 25 km", "Any distance"])
    elif screen == "request-review":
        size = " dialog__panel--lg"
        if invalid:
            fields = alert("warning", "Nia changed this time", "Sat 24 Oct at 10:00 am is no longer offered. Choose another time on the form, then review again.")
        fields += dl([("Service", "Medium knotless braids"), ("Time", "Sat 24 Oct · 10:00 am (Toronto time) · not confirmed"), ("Estimate", "$180–$240 · about 5 hours · not confirmed"), ("Location", "Toronto West · address shared after Nia accepts"), ("Cancellation", "Free up to 48 hours before; later cancellations may be charged $40"), ("Contact", "maya.chen@example.com · 416-555-0148"), ("Hair details", "Shoulder length; bringing my own extensions")])
    elif screen == "cancel-appointment":
        fields = dl([("Request", "HP-1048 · medium knotless braids"), ("Time", "Sat 24 Oct · 10:00 am"), ("Terms", "Free cancellation up to 48 hours before. No charge applies today.")])
    elif screen == "change-appointment":
        errors = [("new-time", "Choose one of Nia’s offered times")] if invalid else []
        fields = '<p><strong>Current time:</strong> Sat 24 Oct · 10:00 am</p>' + choices("New time", "new-time", [("Sun 25 Oct · 11:00 am", "Offered by Nia"), ("Sat 31 Oct · 10:00 am", "Offered by Nia")], checked=None if invalid else 0, cards=True, error="Choose one of Nia’s offered times." if invalid else "") + field("Note for Nia", "note", "Saturday morning no longer works for me.", multiline=True, optional=True)
    elif screen == "report-review":
        errors = [("reason", "Choose a reason")] if invalid else []
        fields = review("5", "3 Oct 2026", "Quick, gentle and my braids lasted seven weeks.", "Kemi Adebayo", "Passion twists", report=False) + choices("Reason", "reason", [("It isn’t about a real visit", ""), ("It’s offensive or harassing", ""), ("It shares private information", ""), ("Something else", "")], checked=None if invalid else 0, error="Choose why this review needs a closer look." if invalid else "") + field("Details", "details", "", multiline=True, optional=True)
    elif screen == "sign-out":
        fields = "<p>You’ll stay signed in on your other devices.</p>"
    elif screen == "cookie-preferences":
        size = " dialog__panel--lg"
        errors = [("optional-data", "Choose whether to allow optional usage data")] if invalid else []
        fields = '<p><strong>Essential storage</strong> · always on. Keeps you signed in and remembers this choice.</p>' + choices("Optional usage data", "optional-data", [("Allow optional usage data", "Helps us understand which styles people explore."), ("Essential only", "HairPop works the same either way.")], checked=None if invalid else 1, cards=True, error="Choose whether to allow optional usage data." if invalid else "")
    elif screen == "respond-to-request":
        size = " dialog__panel--lg"
        errors = [("amount", "Enter the agreed amount")] if invalid else []
        fields = dl([("Customer", "Maya Chen"), ("Time", "Sat 24 Oct · 10:00 am · about 5 hours"), ("Estimate", "$180–$240"), ("Hair details", "Shoulder length; bringing my own extensions")]) + choices("Your reply", "reply", [("Accept", "Confirms the time and shares your studio address with Maya."), ("Decline", "Maya is told you can’t take this request.")], checked=0, cards=True) + field("Agreed amount", "amount", "" if invalid else "210", "number", addon="$", help_text="Within or close to the estimate. Maya sees this as the agreed amount.", error="Enter the agreed amount, like 210." if invalid else "")
        if state == "conflict":
            fields = alert("warning", "This request changed", "Maya cancelled HP-1048 after you opened it, so your reply wasn’t saved. Refresh to see current requests.", '<a href="' + href("braider-requests") + '">Refresh requests</a>') + fields
    elif screen == "edit-service":
        size = " dialog__panel--lg"
        errors = [("starting-price", "Enter a starting price of $0 or more"), ("duration", "Enter a typical time longer than 0 hours")] if invalid else []
        fields = (
            field("Style", "style", "Knotless braids", options=["Knotless braids", "Passion twists", "Cornrows", "Locs"])
            + field("Service name", "service-name", "Medium knotless braids")
            + field("Starting price", "starting-price", "-20" if invalid else "180", "number", addon="$", error="Enter a starting price of $0 or more." if invalid else "")
            + field("Typical time (hours)", "duration", "0" if invalid else "5", "number", error="Enter a typical time longer than 0 hours." if invalid else "")
            + field("Preparation for this service", "service-prep", "Bring 6 packs of pre-stretched extensions in your colour.", multiline=True, optional=True)
            + checkbox("Published", "published", True, "Customers can find and request this service.")
        )
        if state == "conflict":
            fields = alert("warning", "This service changed in another window", "Your edits are kept. Refresh to load the latest version before saving.", '<a href="' + href("braider-services") + '">Refresh services</a>') + fields
    elif screen == "remove-service":
        fields = "<p>Boho knotless braids is unpublished, so no customer can request it right now.</p>"
    elif screen == "add-portfolio-item":
        errors = [("photo", "Upload a JPG, PNG or WebP image")] if invalid else []
        fields = field("Photo", "photo", "", "file", help_text="JPG, PNG or WebP, up to 5 MB.", error="nia-braids.gif is a GIF. Upload a JPG, PNG or WebP image up to 5 MB." if invalid else "") + field("Caption", "caption", "Medium knotless braids · Oct 2026", counter="34 / 120") + field("Style", "photo-style", "Knotless braids", options=["Knotless braids", "Passion twists", "Cornrows", "Locs"])
    elif screen == "add-slot":
        errors = [("slot-date", "Choose a date from today onwards")] if invalid else []
        fields = field("Date", "slot-date", "2026-10-09" if invalid else "2026-11-01", "date", error="Choose a date from today, Sat 10 Oct, onwards." if invalid else "") + field("Start time", "slot-time", "10:00 am", options=["9:00 am", "10:00 am", "11:00 am", "1:00 pm", "3:00 pm"]) + field("Up to", "slot-length", "6 hours", options=["2 hours", "4 hours", "6 hours", "8 hours"], help_text="Customers can request services that fit in this time.")
    elif screen == "withdraw-slot":
        fields = "<p>No customer has requested this time yet.</p>"
    elif screen == "braider-sign-out":
        fields = "<p>Your services and availability stay published while you’re signed out.</p>"
    if state == "failed":
        failed_text = {"request-review": "No request was created. Your details are still here, so you can try again.", "sign-out": "You’re still signed in. Try again in a moment.", "braider-sign-out": "You’re still signed in. Try again in a moment.", "cancel-appointment": "HP-1048 is still active. Try again, or contact support if this keeps happening."}.get(screen, "Nothing was changed. Your entries are still here, so you can try again.")
        fields = alert("danger", "We couldn’t save this", failed_text) + fields
    if errors:
        fields = summary(errors) + fields
    action = {"filter-braiders": "Show braiders", "request-review": "Send request", "cancel-appointment": "Cancel request", "change-appointment": "Send change request", "report-review": "Send report", "sign-out": "Sign out", "cookie-preferences": "Save preferences", "respond-to-request": "Send reply", "edit-service": "Save service", "remove-service": "Remove service", "add-portfolio-item": "Add photo", "add-slot": "Add time", "withdraw-slot": "Withdraw time", "braider-sign-out": "Sign out"}[screen]
    safe = {"request-review": "Edit details", "cancel-appointment": "Keep request", "sign-out": "Stay signed in", "braider-sign-out": "Stay signed in", "remove-service": "Keep service", "withdraw-slot": "Keep time"}.get(screen, "Cancel")
    destructive = screen in DESTRUCTIVE
    role = "alertdialog" if destructive else "dialog"
    head_icon = f'<span class="dialog__icon dialog__icon--danger">{icon("alert-circle")}</span>' if destructive else ""
    status = f'<p class="visually-hidden" role="status">Saving…</p>' if busy else ""
    return f'''<div class="backdrop"></div><div class="dialog" role="{role}" aria-modal="true" aria-labelledby="dlg-title" aria-describedby="dlg-desc" data-dismiss-on-escape><div class="dialog__panel{size}"><div class="dialog__header">{head_icon}<div><h2 class="dialog__title" id="dlg-title">{esc(title)}</h2><p id="dlg-desc" class="text-muted">{esc(description)}</p></div><button class="btn btn--ghost btn--icon" type="button" aria-label="Close dialog">{icon("close")}</button></div><div class="dialog__body stack">{fields}</div><div class="dialog__footer"><button class="btn" type="button" data-close-dialog>{esc(safe)}</button><button class="btn {"btn--danger" if destructive else "btn--primary"}" type="button"{attribute("aria-busy", "true", busy)}>{esc(action)}</button>{status}</div></div></div>'''


# ---------------------------------------------------------------------------
# Notifications
# ---------------------------------------------------------------------------

MESSAGES = {
    "booking-update": {"info": ("Request received", "Nia has HP-1048 and will reply soon.", "View request"), "success": ("Time confirmed", "Nia confirmed Sat 24 Oct at 10:00 am.", "View appointment"), "warning": ("Nia suggested a new time", "Sun 25 Oct at 11:00 am. Your current time stays until you decide.", "View suggestion"), "danger": ("Change request not sent", "Your current time is unchanged. Try again when you’re connected.", "Retry")},
    "review-feedback": {"info": ("Review your visit", "Share how your visit with Nia went.", "Write review"), "success": ("Review posted", "Thank you for helping others choose.", "View review"), "warning": ("Review held for checks", "It appears once our team has checked it.", "Learn more"), "danger": ("Review not posted", "Your words are saved here. Please try again.", "Retry")},
    "account-feedback": {"info": ("Verification email sent", "Open the link sent to maya.chen@example.com.", "Resend"), "success": ("Details updated", "Nia can reach you at 416-555-0148.", "View settings"), "warning": ("Verify your new email", "Updates go to your old address until you do.", "Resend link"), "danger": ("Changes not saved", "Your edits are still here. Please try again.", "Retry")},
    "cookie-consent": {"info": ("Your privacy choices", "Choose whether optional usage data may be stored.", "Cookie preferences"), "success": ("Preferences saved", "Essential only. You can change this in Cookie preferences.", "Change"), "warning": ("Choice not saved yet", "We’ll keep asking until you choose.", "Choose"), "danger": ("Preferences not saved", "Your choice wasn’t stored. Please try again.", "Retry")},
    "braider-feedback": {"info": ("Request declined", "Maya will see that you can’t take HP-1048.", "View requests"), "success": ("Request accepted", "HP-1048 is confirmed for Sat 24 Oct at 10:00 am.", "View availability"), "warning": ("Request changed", "Zara asked to move HP-1031 to Sat 17 Oct.", "Respond"), "danger": ("Reply not saved", "HP-1048 still needs a reply. Try again.", "Retry")},
}
TOAST_ICONS = {"info": "info", "success": "check-circle", "warning": "warning", "danger": "alert-circle"}


def notification_content(item, state: str) -> tuple[str, str]:
    """Returns (banner above the shell, overlay after it)."""
    screen = item[0]
    if screen == "cookie-consent" and state in ("info", "warning", "persistent"):
        kind = "warning" if state == "warning" else "info"
        title, text, _ = MESSAGES[screen][kind]
        tone = "" if kind == "info" else " alert--warning"
        banner = f'<div class="alert alert--info{tone} banner" role="region" aria-label="Privacy choices">{icon(TOAST_ICONS[kind])}<div><strong>{esc(title)}</strong><span>{esc(text)}</span><div class="alert__actions"><button class="btn btn--sm btn--primary" type="button">Allow optional data</button><button class="btn btn--sm" type="button">Essential only</button><a href="{href("cookie-preferences", "dialog")}" aria-haspopup="dialog">Cookie preferences</a></div></div></div>'
        note = '<p class="mock-note" style="top: var(--space-16); right: var(--space-4);">The banner stays until a choice is saved. No optional storage is used before then.</p>'
        return banner, note
    if state == "stacked":
        kinds = ["info", "success", "danger"]
    elif state == "with-action":
        kinds = ["warning"]
    elif state == "persistent":
        kinds = ["danger"]
    else:
        kinds = [state]

    def one_toast(kind: str) -> str:
        title, text, action_label = MESSAGES[screen][kind]
        action = f'<button class="toast__action" type="button">{esc(action_label)}</button>' if kind != "info" or state == "with-action" else ""
        return f'<div class="toast toast--{kind}">{icon(TOAST_ICONS[kind])}<div class="toast__body"><strong class="toast__title">{esc(title)}</strong><span class="toast__text">{esc(text)}</span>{action}</div><button class="close" type="button" aria-label="Dismiss: {esc(title)}">{icon("close", "icon--sm")}</button></div>'

    polite = "".join(one_toast(k) for k in kinds if k != "danger")
    assertive = "".join(one_toast(k) for k in kinds if k == "danger")
    regions = f'<div class="toast-region" role="status" aria-live="polite">{polite}</div>' + (f'<div class="toast-region toast-region--top" role="alert" aria-live="assertive">{assertive}</div>' if assertive else "")
    note = '<p class="mock-note" style="bottom: var(--space-12); left: var(--space-4);">Info and success dismiss after 8 seconds (10 with an action) and pause on hover or focus. Warning and danger stay until dismissed.</p>'
    return "", regions + note


# ---------------------------------------------------------------------------
# Document
# ---------------------------------------------------------------------------

def bar(kind: str, item, state: str) -> str:
    title = item[1]
    states = item[4] if kind == "dialog" else NOTIFICATION_STATES if kind == "notification" else item[6]
    links = "".join(f'<li><a href="{esc(s)}.html"{attribute("aria-current", "page", s == state)}>{esc(s)}</a></li>' for s in states)
    return f'<nav class="mock-bar" aria-label="Mock navigation"><a class="mock-bar__home" href="../../index.html" aria-label="All mocks">⌂</a><span class="mock-bar__screen">{esc(title)}</span><ul class="mock-bar__states">{links}</ul><button type="button" data-theme-toggle aria-pressed="false">☾ Dark</button><button type="button" data-chrome-toggle aria-label="Hide mock chrome">×</button></nav>'


def document(kind: str, item, state: str, requirements) -> str:
    screen, title = item[0], item[1]
    if kind == "page":
        body = shell(screen, state)
        product = "braider management app" if is_braider(screen) else "HairPop customer journey"
    elif kind == "dialog":
        body = shell(item[2], "default", inert=True) + dialog_content(item, state)
        product = "braider management app" if is_braider(item[2]) else "HairPop customer journey"
    else:
        banner, overlay = notification_content(item, state)
        body = shell(item[2], "default", banner=banner) + overlay
        product = "braider management app" if is_braider(item[2]) else "HairPop customer journey"
    description = f"{title}: {state} state in the {product}."
    reqs = ", ".join(requirements)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{esc(title)} · {esc(state)} — HairPop mocks</title><meta name="mock:kind" content="{kind}"><meta name="mock:screen" content="{esc(screen)}"><meta name="mock:state" content="{esc(state)}"><meta name="mock:requirements" content="{esc(reqs)}"><meta name="description" content="{esc(description)}"><link rel="stylesheet" href="../../assets/fonts/fonts.css"><link rel="stylesheet" href="../../assets/tokens.css"><link rel="stylesheet" href="../../assets/ui.css"><link rel="stylesheet" href="../../assets/mock.css"></head><body><a class="skip-link" href="#main">Skip to content</a>{body}{bar(kind, item, state)}<script src="../../assets/mock.js"></script></body></html>'''


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


def main() -> None:
    screens = []
    for folder in ("pages", "dialogs", "notifications"):
        for old in (ROOT / folder).glob("*/*.html"):
            old.unlink()
    for p in PAGES:
        screen, title, route, *_, states, reqs = p
        na = {}
        if "empty" not in states:
            na["empty"] = "This screen has no collection to become empty."
        screens.append({"id": screen, "kind": "page", "title": title, "route": route, "requirements": reqs, "states": states, "not_applicable": na})
        for state in states:
            write(ROOT / "pages" / screen / f"{state}.html", document("page", p, state, reqs))
    for d in DIALOGS:
        screen, title, source, _, states, reqs = d
        na = {}
        if "invalid" not in states:
            na["invalid"] = "This confirmation dialog has no inputs."
        screens.append({"id": screen, "kind": "dialog", "title": title, "opens_from": source, "requirements": reqs, "states": states, "not_applicable": na})
        for state in states:
            write(ROOT / "dialogs" / screen / f"{state}.html", document("dialog", d, state, reqs))
    for n in NOTIFICATIONS:
        screen, title, source, reqs = n
        screens.append({"id": screen, "kind": "notification", "title": title, "opens_from": source, "requirements": reqs, "states": NOTIFICATION_STATES})
        for state in NOTIFICATION_STATES:
            write(ROOT / "notifications" / screen / f"{state}.html", document("notification", n, state, reqs))
    for folder in ("pages", "dialogs", "notifications"):
        for d in (ROOT / folder).iterdir():
            if d.is_dir() and not any(d.iterdir()):
                d.rmdir()
    write(ROOT / "manifest.json", json.dumps({"project": "HairPop", "screens": screens}, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
