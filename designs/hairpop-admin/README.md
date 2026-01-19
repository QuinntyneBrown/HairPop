# HairPop Admin (Mockups)

These HTML pages are static mockups for **HairPop Admin**, intentionally using the same dark Material-like styleguide as the existing NGMAT mockups under the root `designs/` folder.

## Start here

- Open `index.html` in a browser.

## Pages

- `index.html` — Dashboard (KPIs + quick actions)
- `braiders.html` / `braider-detail.html` — Braider CRUD concept (profile, services, availability)
- `users.html` / `user-detail.html` — UserProfile CRUD concept (preferences, favorites)
- `bookings.html` / `booking-detail.html` — Booking CRUD concept (status, scheduling)
- `reviews.html` / `review-detail.html` — Review moderation / CRUD concept
- `media.html` / `media-detail.html` — Media library CRUD concept

## Notes

- These are design-only mockups; they don’t call APIs.
- Field names and sections for Braiders and Users were derived from the domain entities:
  - `src/Braiders/Braiders.Core/Entities/*`
  - `src/Users/Users.Core/Entities/*`
- Booking/Reviews/Media entity folders currently appear scaffolded; mockups include common CRUD fields that can be aligned once those entities land.
