"""Regenerate the static HairPop mock screens from the catalog below."""
from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).parent

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
    ("account-settings", "Account settings", "/settings", "Account settings", "Keep your contact details current so braiders can reach you.", "Save changes", ["default", "loading", "error", "invalid", "submitting", "success", "offline"]),
    ("help", "Help", "/help", "How can we help?", "Find answers about requests, pricing, changes and reviews.", "Contact support", ["default", "loading", "error", "offline"]),
    ("not-found", "Page not found", "/404", "We couldn’t find that page", "The link may be old, or the address may have changed.", "Explore styles", ["default", "loading", "error"]),
    ("forbidden", "Access unavailable", "/403", "You can’t open this page", "Sign in with the account used for this appointment.", "Sign in", ["default", "loading", "error"]),
    ("server-error", "Service error", "/500", "HairPop needs a moment", "We couldn’t load this page. Your booking request has not been resent.", "Try again", ["default", "loading", "error"]),
    ("offline", "Offline", "/offline", "You’re offline", "Saved appointment details remain available. Requests need a connection.", "Try again", ["default", "loading", "error"]),
    ("terms", "Terms of use", "/terms", "Terms of use", "How HairPop helps customers and independent braiders connect.", "Explore styles", ["default", "loading", "error"]),
    ("privacy", "Privacy", "/privacy", "Privacy at HairPop", "What information is used when you browse, request and review.", "Explore styles", ["default", "loading", "error"]),
]

DIALOGS = [
    ("filter-braiders", "Filter braiders", "matching-braiders", "Choose the travel distance and price range that work for you.", ["default", "busy", "invalid", "failed"]),
    ("request-review", "Review request", "booking-request", "Check your details before Nia receives your request.", ["default", "busy", "invalid", "failed"]),
    ("cancel-appointment", "Cancel appointment", "appointment-detail", "Cancel request HP-1048? Nia will see that you no longer need this time.", ["default", "busy", "confirm", "failed"]),
    ("change-appointment", "Request a change", "appointment-detail", "Tell Nia which new time works for you.", ["default", "busy", "invalid", "failed"]),
    ("report-review", "Report a review", "braider-profile", "Tell us why this review needs a closer look.", ["default", "busy", "invalid", "failed"]),
    ("sign-out", "Sign out", "account-settings", "You can return to browse styles at any time.", ["default", "busy", "confirm"]),
    ("cookie-preferences", "Cookie preferences", "style-gallery", "Choose whether HairPop may remember optional usage information.", ["default", "busy", "invalid", "failed"]),
]

NOTIFICATIONS = [
    ("booking-update", "Booking update", "appointment-detail"),
    ("review-feedback", "Review feedback", "care-and-review"),
    ("account-feedback", "Account feedback", "account-settings"),
    ("cookie-consent", "Cookie consent", "style-gallery"),
]

PAGE_MAP = {p[0]: p for p in PAGES}
NAV = [("style-gallery", "Styles"), ("matching-braiders", "Braiders"), ("my-appointments", "Appointments"), ("help", "Help")]

def esc(value):
    return html.escape(str(value), quote=True)

def attribute(name, value, active=True):
    return f' {name}="{esc(value)}"' if active else ''

def href(screen, kind="page"):
    folder = {"page": "pages", "dialog": "dialogs", "notification": "notifications"}[kind]
    return f"../../{folder}/{screen}/default.html"

def anchor(label, target, primary=False):
    return f'<a class="btn{" btn--primary" if primary else ""}" href="{href(target)}">{esc(label)}</a>'

def shell(screen, state, *, inert=False):
    p = PAGE_MAP[screen]
    nav = "".join(f'<a class="nav-link" href="{href(i)}"{attribute("aria-current", "page", i == screen)}>{esc(label)}</a>' for i, label in NAV)
    return f'''<div{attribute("inert", "", inert)}{attribute("aria-hidden", "true", inert)} class="product-shell">
<header class="topbar"><a class="topbar__brand" href="{href('style-gallery')}">✦ HairPop</a><nav class="topbar__nav" aria-label="Primary">{nav}</nav><span class="topbar__spacer"></span><a class="account-link" href="{href('notification-center')}" aria-label="Notifications, 2 unread">Updates <span class="badge badge--count" aria-label="2 unread">2</span></a><a class="account-link" href="{href('account-settings')}">Maya</a></header>
<main id="main" class="container product-main"><div class="page-header"><div><p class="eyebrow">{esc('Discover' if screen in ('style-gallery','style-detail','matching-braiders','braider-profile') else 'Your HairPop')}</p><h1>{esc(p[3])}</h1><p class="subtitle">{esc(p[4])}</p></div></div>{content(screen,state)}</main><footer class="site-footer"><span>HairPop · Made for confident hair decisions</span><span><a href="{href('terms')}">Terms</a> · <a href="{href('privacy')}">Privacy</a></span></footer></div>'''

def card(title, description, target, meta=""):
    photo = '<img class="story-card__photo" src="../../assets/photos/knotless-braids.png" alt="Medium knotless braids shown from the back and side">' if title == "Knotless braids" else '<img class="story-card__photo" src="../../assets/photos/nia.jpg" alt="Portrait of a braider">' if title == "Nia Okafor" else '<div class="story-card__art" aria-hidden="true">✦</div>'
    return f'<article class="card story-card">{photo}<div class="stack"><p class="eyebrow">{esc(meta)}</p><h2 class="card__title">{esc(title)}</h2><p class="text-muted">{esc(description)}</p><a href="{href(target)}">Explore {esc(title)} <span aria-hidden="true">→</span></a></div></article>'

def field(label, name, value="", typ="text", invalid=False, help_text=""):
    err = f'<span id="{name}-error" class="field__error">{esc(help_text or "Enter a valid value to continue.")}</span>' if invalid else ""
    return f'<label class="field" for="{name}"><span class="field__label">{esc(label)}</span><input class="input" id="{name}" name="{name}" type="{typ}" value="{esc(value)}"{attribute("aria-invalid", "true", invalid)}{attribute("aria-describedby", name+"-error", invalid)}>{err}</label>'

def form_content(screen, state):
    invalid = state == "invalid"
    busy = state == "submitting"
    unavailable = state == "offline"
    fields = []
    if screen == "booking-request":
        fields = [field("Service", "service", "Medium knotless braids"), field("Preferred time", "time", "2026-10-24T10:00", "datetime-local", invalid, "Choose an offered time."), field("Your email", "email", "maya.chen@example.com", "email"), field("Hair details", "hair", "Shoulder length; bringing my own extensions")]
    elif screen == "care-and-review":
        fields = [field("Rating, 1 to 5", "rating", "5", "number", invalid, "Choose a rating from 1 to 5."), field("Your review", "review", "Nia explained each step and the braids feel comfortable.")]
    elif screen == "account-settings":
        fields = [field("Name", "name", "Maya Chen"), field("Email", "email", "maya.chen@example.com", "email", invalid, "Enter an email address like name@example.com."), field("Phone", "phone", "416-555-0148", "tel")]
    elif screen == "verify-email":
        fields = []
    elif screen in ("forgot-password",):
        fields = [field("Email", "email", "maya.chen@example.com", "email", invalid, "Enter the email address on your account.")]
    elif screen == "reset-password":
        fields = [field("New password", "password", "", "password", invalid, "Use at least 12 characters."), field("Confirm password", "confirm", "", "password")]
    else:
        fields = ([field("Name", "name", "Maya Chen")] if screen == "sign-up" else []) + [field("Email", "email", "maya.chen@example.com", "email", invalid, "Enter a valid email address."), field("Password", "password", "", "password")]
    summary = '<div class="alert alert--danger form-summary" tabindex="-1" autofocus><div><strong>Check the highlighted field</strong><p>Correct the information below and try again.</p></div></div>' if invalid else ""
    foot = '<p class="text-muted">Estimate: $180–$240 · about 5 hours. Nia confirms the final price and time.</p>' if screen == "booking-request" else ""
    if screen == "care-and-review": foot = '<p class="text-muted">Keep your scalp moisturized, sleep with a satin bonnet, and contact Nia if the braids feel too tight.</p>'
    banner = '<div class="alert alert--warning"><div><strong>You’re offline.</strong> Your details remain here. Connect before sending.</div></div>' if unavailable else ''
    return f'''{banner}<section class="form-panel card"><h2>{esc('Your details' if screen == 'booking-request' else 'Details')}</h2>{summary}<form class="stack" action="{href(screen)}">{''.join(fields)}{foot}<button class="btn btn--primary" type="submit"{attribute("disabled", "", busy or unavailable)}{attribute("aria-busy", "true", busy)}>{esc(PAGE_MAP[screen][5] if not busy else 'Working…')}</button></form></section>'''

def content(screen, state):
    p = PAGE_MAP[screen]
    if state == "loading":
        return '<section class="feature-grid" aria-label="Loading content"><div class="card"><span class="skeleton skeleton--title"></span><span class="skeleton skeleton--text"></span><span class="skeleton skeleton--text"></span></div><div class="card"><span class="skeleton skeleton--rect skeleton--hero"></span><span class="skeleton skeleton--text"></span></div><div class="card"><span class="skeleton skeleton--title"></span><span class="skeleton skeleton--text"></span></div></section>'
    if state == "error":
        return f'<section class="empty empty--error"><div class="empty__icon" aria-hidden="true">!</div><h2 class="empty__title">We couldn’t load {esc(p[1].lower())}</h2><p class="empty__text">Check your connection and try again. Your details are safe.</p><div class="empty__actions"><a class="btn btn--primary" href="default.html">Try again</a>{anchor("Explore styles","style-gallery")}</div></section>'
    if state == "empty":
        return f'<section class="empty"><div class="empty__icon" aria-hidden="true">✦</div><h2 class="empty__title">Nothing here yet</h2><p class="empty__text">{esc(empty_message(screen))}</p><div class="empty__actions">{anchor("Explore styles","style-gallery",True)}</div></section>'
    if state == "no-results":
        return f'<div class="filter-row">{search_field(screen)}<span class="badge">Knotless · Toronto · under $150</span></div><section class="empty"><div class="empty__icon" aria-hidden="true">⌕</div><h2 class="empty__title">No matches for these filters</h2><p class="empty__text">Try a wider price range or distance to see more options.</p><div class="empty__actions"><a class="btn btn--primary" href="default.html">Clear filters</a></div></section>'
    if state == "success" and screen in FORM_SCREENS:
        return f'<section class="empty"><div class="empty__icon" aria-hidden="true">✓</div><h2 class="empty__title">{esc(success_message(screen))}</h2><p class="empty__text">{esc(success_detail(screen))}</p><div class="empty__actions">{anchor("View appointment" if screen == "booking-request" else "Explore styles", "appointment-detail" if screen == "booking-request" else "style-gallery",True)}</div></section>'
    if state == "edge":
        example = '<div class="card"><span class="badge">Long names and missing photos</span><h2>Amara Nkiruka Adeyemi-Williams</h2><p>Senior knotless braid specialist serving Etobicoke, North York, Scarborough and surrounding neighbourhoods · 1,284 reviews.</p></div>'
        return example + content(screen,"default")
    if screen in FORM_SCREENS:
        return form_content(screen,state)
    banner = '<div class="alert alert--warning"><div><strong>You’re offline.</strong> Saved details are shown. Actions need a connection.</div></div>' if state == "offline" else ''
    partial = '<div class="alert alert--warning"><div><strong>Some details are unavailable.</strong> Reviews could not load. <a href="default.html">Retry reviews</a>.</div></div>' if state == "partial" else ''
    if screen == "style-gallery":
        return banner + f'<section class="stack"><div class="filter-row">{search_field(screen)}<a class="btn" href="{href("matching-braiders")}">Find braiders</a></div><div class="chip-row"><button type="button" class="chip" aria-pressed="true">All styles</button><button type="button" class="chip">Braids</button><button type="button" class="chip">Twists</button><button type="button" class="chip">Locs</button></div><div class="feature-grid">{card("Knotless braids","Gentle at the root · 4–7 hours · typically $160–$300","style-detail","Most explored")}{card("Passion twists","Soft, textured finish · 3–6 hours · typically $140–$260","style-detail","Protective style")}{card("Cornrows","Clean lines and versatile patterns · 2–4 hours","style-detail","Classic")}</div>{pagination(state)}</section>'
    if screen == "style-detail":
        return banner + partial + f'<div class="detail-grid"><section class="card"><img class="hero-photo" src="../../assets/photos/knotless-braids.png" alt="Long medium knotless braids with neat, visible parting"><h2>What to expect</h2><p>Knotless braids start with your natural hair, then extensions are fed in gradually. The finish is flexible and usually feels lighter at the roots.</p><div class="fact-grid"><div><strong>4–7 hours</strong><span>Typical time</span></div><div><strong>$160–$300</strong><span>Typical price</span></div><div><strong>4–8 weeks</strong><span>Typical wear</span></div></div><p class="text-muted">Length, size, hair density and supplied extensions affect the final quote.</p></section><aside class="card"><h2>Make it yours</h2><p>Choose small, medium or large braids, then talk through length and colour with your braider.</p>{anchor("See braiders for this style","matching-braiders",True)}</aside></div>'
    if screen == "matching-braiders":
        return banner + f'<div class="filter-row">{search_field(screen)}<a class="btn" href="{href("filter-braiders","dialog")}">Filters</a></div><div class="feature-grid">{card("Nia Okafor","4.9 ★ · 86 reviews · Toronto West · knotless braids from $180","braider-profile","Available Sat 24 Oct")}{card("Aisha Mensah","4.8 ★ · 64 reviews · North York · knotless braids from $195","braider-profile","Next week")}{card("Jules Baptiste","4.9 ★ · 41 reviews · Scarborough · knotless braids from $170","braider-profile","Available Sun 25 Oct")}</div>{pagination(state)}'
    if screen == "braider-profile":
        return banner + partial + f'<div class="detail-grid"><section class="stack"><div class="card"><div class="profile-head"><div class="profile-avatar" aria-hidden="true">NO</div><div><h2>Nia Okafor</h2><p>Toronto West · 4.9 ★ from 86 reviews</p></div></div><p>I specialize in comfortable, neat braids. Bring inspiration photos and we’ll confirm the details together.</p><div class="fact-grid"><div><strong>From $180</strong><span>Knotless braids</span></div><div><strong>5 hours</strong><span>Typical duration</span></div></div>{anchor("Request with Nia","booking-request",True)}</div><div class="card"><h2>Customer reviews</h2><blockquote>“The parts were so neat and Nia checked that nothing felt too tight.” <cite>— Maya Chen, 3 Oct</cite></blockquote><a href="{href("report-review","dialog")}">Report a review</a></div></section><aside class="card"><h2>Before you book</h2><p>Service area: Toronto West. Address shared after confirmation. Please arrive with detangled hair.</p><p>Changes and cancellations are subject to Nia’s policy, shown before you send a request.</p></aside></div>'
    if screen == "appointment-detail":
        status = "Confirmed" if state == "success" else "Awaiting reply"
        return banner + partial + f'<div class="detail-grid"><section class="card stack"><span class="badge badge--{"success" if state == "success" else "warning"}">{status}</span><h2>Medium knotless braids</h2><p><strong>Sat 24 Oct · 10:00 am</strong> with Nia Okafor</p><p>{"Confirmed estimate: $210" if state == "success" else "Estimated price: $180–$240. Nia will confirm the final price."}</p><p>{"Studio address: 1246 Bloor Street West, Toronto" if state == "success" else "Location shared after Nia accepts."}</p><div class="cluster"><a class="btn" href="{href("change-appointment","dialog")}">Request a change</a><a class="btn btn--link" href="{href("cancel-appointment","dialog")}">Cancel request</a></div></section><aside class="card"><h2>Prepare for your visit</h2><ol><li>Wash and detangle your hair.</li><li>Bring the extensions discussed with Nia.</li><li>Send any inspiration photos in advance.</li></ol></aside></div>'
    if screen == "my-appointments":
        return banner + f'<section class="stack"><div class="card appointment-row"><div><span class="badge badge--warning">Awaiting reply</span><h2>Nia Okafor · knotless braids</h2><p>Sat 24 Oct · 10:00 am · estimate $180–$240</p></div>{anchor("View request","appointment-detail",True)}</div><div class="card appointment-row"><div><span class="badge badge--success">Completed</span><h2>Nia Okafor · knotless braids</h2><p>Sat 3 Oct · review ready</p></div>{anchor("View care and review","care-and-review")}</div>{pagination(state)}</section>'
    if screen == "notification-center":
        first_badge = 'Read' if state == 'read' else 'Unread'
        return banner + f'<section class="stack"><div class="card"><span class="badge badge--{"info" if state == "read" else "warning"}">{first_badge}</span><h2>Nia received your request</h2><p>Today at 9:42 am · She will confirm the time and final price.</p>'+anchor("View request","appointment-detail",True)+'</div><div class="card"><span class="badge badge--info">Read</span><h2>How to prepare for knotless braids</h2><p>Yesterday · Read Nia’s preparation checklist.</p>'+anchor("View care","care-and-review")+'</div></section>'
    if screen == "help":
        return '<section class="feature-grid">'+card("How requests work","A request becomes an appointment when a braider accepts it.","booking-request","Appointments")+card("Prices and estimates","See what can change a final quote before you request.","style-detail","Pricing")+card("Need a hand?","Email support@hairpop.example with your request number.","account-settings","Support")+'</section>'
    if screen in ("terms","privacy"):
        return f'<section class="card legal-copy"><h2>{esc("Using HairPop" if screen == "terms" else "Your information")}</h2><p>HairPop helps customers discover independent braiders and send appointment requests. A request is pending until the braider accepts it.</p><p>Prices shown before confirmation are estimates. The braider confirms appointment details and policies directly with you.</p><h2>{esc("Your choices" if screen == "privacy" else "Requests and reviews")}</h2><p>You can update contact details and review your appointments in your account. Contact support@hairpop.example for help with your information or an appointment.</p></section>'
    return f'<section class="empty"><div class="empty__icon" aria-hidden="true">✦</div><h2 class="empty__title">{esc(p[3])}</h2><p class="empty__text">{esc(p[4])}</p><div class="empty__actions">{anchor(p[5],"sign-in" if screen == "forbidden" else "style-gallery",True)}</div></section>'

FORM_SCREENS = {"booking-request","care-and-review","sign-in","sign-up","forgot-password","reset-password","verify-email","account-settings"}

def empty_message(screen):
    return {"my-appointments":"When you request a visit, you’ll find its status and details here.","notification-center":"Updates about requests and appointments will appear here.","style-gallery":"Styles are being refreshed. Check back shortly or browse braiders.","matching-braiders":"No braiders have listed this style near Toronto yet. Try another style.","braider-profile":"Nia has not shared portfolio work yet. You can still read her services and policies."}.get(screen,"There’s no information to show here yet. Explore styles to keep going.")

def success_message(screen):
    return {"booking-request":"Request sent to Nia","care-and-review":"Your review is posted","account-settings":"Your changes are saved","sign-in":"You’re signed in","sign-up":"Your account is ready","forgot-password":"Check your inbox","reset-password":"Password updated","verify-email":"Email sent again"}.get(screen,"Done")

def success_detail(screen):
    return {"booking-request":"This is a request, not a confirmed appointment. Nia will reply with the final time and price.","care-and-review":"Your review helps others choose a braider with confidence.","forgot-password":"If this email belongs to an account, a reset link is on its way."}.get(screen,"You can continue exploring HairPop.")

def search_field(screen):
    return f'<label class="search-box"><span class="visually-hidden">Search {esc(screen.replace("-"," "))}</span><input class="input" type="search" value="knotless braids" aria-label="Search {esc(screen.replace("-"," "))}"></label>'

def pagination(state):
    return '<nav class="pagination-row" aria-label="Results pages"><span>Showing 1–3 of 126</span><a href="default.html">Previous</a><a href="default.html" aria-current="page">1</a><a href="long.html">2</a><a href="long.html">Next</a></nav>' if state == "long" else ""

def dialog_content(item, state):
    screen,title,source,description,_ = item
    invalid = state == "invalid"
    fields = ""
    if screen == "filter-braiders": fields = field("Maximum price", "price", "150", "number", invalid, "Enter a price of at least $160 for this style.") + field("Distance from Toronto", "distance", "10 km")
    elif screen == "request-review": fields = field("Preferred time", "preferred", "Sat 24 Oct, 10:00 am", invalid=invalid, help_text="Choose an offered time.")
    elif screen == "change-appointment": fields = field("New preferred time", "new-time", "Sun 25 Oct, 11:00 am", invalid=invalid, help_text="Enter a time Nia has offered.")
    elif screen == "report-review": fields = field("Reason", "reason", "Inaccurate service details", invalid=invalid, help_text="Tell us what needs review.")
    elif screen == "cookie-preferences": fields = '<label class="choice"><input type="checkbox" checked><span>Remember my optional usage choices</span></label>'
    if state == "failed": fields = '<div class="alert alert--danger"><div><strong>We couldn’t save this change.</strong> Your details remain here. Please try again.</div></div>' + fields
    if state == "confirm": fields = '<div class="alert alert--warning"><div><strong>Check before continuing.</strong> This action updates your account and cannot be undone here.</div></div>' + fields
    if invalid: fields = '<div class="alert alert--danger form-summary" tabindex="-1" autofocus><div><strong>Check the highlighted field</strong><p>Correct it before continuing.</p></div></div>' + fields
    action = {"filter-braiders":"Show braiders","request-review":"Send request","cancel-appointment":"Cancel request","change-appointment":"Send change request","report-review":"Send report","sign-out":"Sign out","cookie-preferences":"Save preferences"}[screen]
    return f'''<div class="backdrop"></div><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title" aria-describedby="dlg-desc" data-dismiss-on-escape><div class="dialog__panel"><div class="dialog__header"><div><h2 class="dialog__title" id="dlg-title">{esc(title)}</h2><p id="dlg-desc" class="text-muted">{esc(description)}</p></div><button class="btn btn--ghost btn--icon" type="button" aria-label="Close dialog">×</button></div><div class="dialog__body stack">{fields or '<p>Review these details, then choose how you want to continue.</p>'}</div><div class="dialog__footer"><a class="btn" href="{href(source)}" autofocus>Keep browsing</a><button class="btn {"btn--danger" if screen in ("cancel-appointment","sign-out") else "btn--primary"}" type="button"{attribute("disabled", "", state == "busy")}{attribute("aria-busy", "true", state == "busy")}>{esc('Working…' if state == 'busy' else action)}</button></div></div></div>'''

def notification_content(item,state):
    screen,_,source = item
    messages = {
        "booking-update": {"info":("Request received","Nia has your request and will reply soon."),"success":("Time confirmed","Nia confirmed Sat 24 Oct at 10:00 am."),"warning":("Time needs a change","Nia suggested Sun 25 Oct at 11:00 am."),"danger":("Update could not be sent","Your request is still saved. Retry when connected.")},
        "review-feedback": {"info":("Review ready","Share how your visit with Nia went."),"success":("Review posted","Thank you for helping others choose."),"warning":("Review needs attention","Please add a rating before posting."),"danger":("Review not posted","Your words are saved. Please try again.")},
        "account-feedback": {"info":("Details saved locally","We’ll sync your changes when connected."),"success":("Details updated","Nia can reach you at your new number."),"warning":("Verify your email","Open the link sent to maya.chen@example.com."),"danger":("Changes not saved","Your edits are still here. Please try again.")},
        "cookie-consent": {"info":("Your privacy choices","Choose whether optional usage data may be stored."),"success":("Preferences saved","You can change them any time."),"warning":("Choice needed","Select a preference to continue."),"danger":("Preferences not saved","Please retry before leaving this page.")},
    }
    if state == "stacked": kinds = ["info","success","danger"]
    elif state == "with-action": kinds = ["warning"]
    elif state == "persistent": kinds = ["info"]
    else: kinds = [state]
    def one_toast(kind):
        action = f'<button class="toast__action" type="button">{"Undo" if kind == "success" else "View update"}</button>' if kind in ("success","warning") or state == "with-action" else ""
        return f'<div class="toast toast--{kind}"{attribute("role", "alert", kind == "danger")}><div class="toast__body"><strong class="toast__title">{esc(messages[screen][kind][0])}</strong><span class="toast__text">{esc(messages[screen][kind][1])}</span>{action}</div><button class="close" type="button" aria-label="Dismiss notification">×</button></div>'
    toast = ''.join(one_toast(kind) for kind in kinds)
    return f'<div class="toast-region" role="status" aria-live="polite">{toast}</div><p class="mock-note" style="bottom: var(--space-12); right: var(--space-4);">Success messages dismiss after 8 seconds and pause on focus. Errors persist until dismissed.</p>'

def bar(item,kind,state):
    screen,title,_,_,states = item if kind == "dialog" else (item[0],item[1],item[2],"",["info","success","warning","danger","with-action","stacked","persistent"]) if kind == "notification" else (item[0],item[1],item[2],item[3],item[6])
    links = ''.join(f'<li><a href="{esc(s)}.html"{attribute("aria-current", "page", s == state)}>{esc(s)}</a></li>' for s in states)
    return f'<nav class="mock-bar" aria-label="Mock navigation"><a class="mock-bar__home" href="../../index.html" aria-label="All mocks">⌂</a><span class="mock-bar__screen">{esc(title)}</span><ul class="mock-bar__states">{links}</ul><button type="button" data-theme-toggle aria-pressed="false">☾ Dark</button><button type="button" data-chrome-toggle aria-label="Hide mock chrome">×</button></nav>'

def document(kind,item,state):
    screen,title = item[:2]
    source = item[2] if kind != "page" else screen
    body = shell(source,state if kind == "page" else "default",inert=kind == "dialog")
    if kind == "dialog": body += dialog_content(item,state)
    if kind == "notification": body += notification_content(item,state)
    description = f'{title}: {state} state in the HairPop customer journey.'
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{esc(title)} · {esc(state)} — HairPop mocks</title><meta name="mock:kind" content="{kind}"><meta name="mock:screen" content="{esc(screen)}"><meta name="mock:state" content="{esc(state)}"><meta name="description" content="{esc(description)}"><link rel="stylesheet" href="../../assets/fonts/fonts.css"><link rel="stylesheet" href="../../assets/tokens.css"><link rel="stylesheet" href="../../assets/ui.css"><link rel="stylesheet" href="../../assets/mock.css"></head><body><a class="skip-link" href="#main">Skip to content</a>{body}{bar(item,kind,state)}<script src="../../assets/mock.js"></script></body></html>'''

def main():
    screens=[]
    for p in PAGES:
        screen,title,route,*_,states=p
        na={}
        if "empty" not in states: na["empty"]="This screen has no collection to become empty."
        screens.append({"id":screen,"kind":"page","title":title,"route":route,"states":states,"not_applicable":na})
        for state in states:
            path=ROOT/"pages"/screen/f"{state}.html"; path.parent.mkdir(parents=True,exist_ok=True); path.write_text(document("page",p,state),encoding="utf-8")
    for d in DIALOGS:
        screen,title,source,_,states=d
        na={}
        if "invalid" not in states: na["invalid"]="This confirmation dialog has no inputs."
        screens.append({"id":screen,"kind":"dialog","title":title,"opens_from":source,"states":states,"not_applicable":na})
        for state in states:
            path=ROOT/"dialogs"/screen/f"{state}.html";path.parent.mkdir(parents=True,exist_ok=True);path.write_text(document("dialog",d,state),encoding="utf-8")
    for n in NOTIFICATIONS:
        screen,title,source=n
        states=["info","success","warning","danger","with-action","stacked","persistent"]
        screens.append({"id":screen,"kind":"notification","title":title,"opens_from":source,"states":states})
        for state in states:
            path=ROOT/"notifications"/screen/f"{state}.html";path.parent.mkdir(parents=True,exist_ok=True);path.write_text(document("notification",n,state),encoding="utf-8")
    (ROOT/"manifest.json").write_text(json.dumps({"project":"HairPop","screens":screens},indent=2,ensure_ascii=False)+"\n",encoding="utf-8")

if __name__ == "__main__": main()
