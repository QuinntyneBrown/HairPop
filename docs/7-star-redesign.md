# HairPop 7-Star Redesign — Screen Inventory

HairPop should make it easy to choose a hairstyle and a braider with confidence, then get through the appointment without surprises. This is a focused product direction, not a promise to build every possible part of the hair journey at once.

---

## Where the product is today

- The Angular app centers on search, a braider directory, braider profiles, and a hairstyle catalog.
- The backend has Identity, Braiders, Users, and Reviews services. Booking and scheduling are not yet built.
- Customers can find a braider, but they must still piece together whether that braider can do their chosen style, what it will cost, and how to arrange the appointment.

The redesign connects those decisions into one clear path.

---

## The 7-star bar

- **5★:** I find a competent braider and can contact or book them.
- **7★:** I start with the style I want, see relevant work and reviews, understand the expected price and time, and request a suitable appointment with clear next steps.

The experience should earn trust through useful information and a dependable flow. It does not depend on AI, predictive personalization, or a concierge service.

---

## Proposed screens, by journey phase

### 1. Choose a style

| Screen | Purpose |
|---|---|
| **Style Gallery** | Browse styles with search and simple filters. Each card shows a photo, name, and typical time or price range when available. |
| **Style Detail** | See variations, upkeep, expected time and price range, and braiders who offer the style. Explain what affects the final quote. |

The gallery replaces the flat hairstyle catalog as the main starting point. It uses curated, browsable content rather than an endless video feed or a personalized quiz.

### 2. Choose a braider

| Screen | Purpose |
|---|---|
| **Matching Braiders** | Show braiders who offer the selected style, with location, availability information when provided, price range, rating, and a relevant portfolio example. Let customers adjust filters and see why a result appears. |
| **Braider Profile** | Show services, relevant portfolio photos, customer reviews, location or service area, policies, and a clear booking action. |

Matching is based on explicit service and location data. Portfolio photos and reviews help customers judge fit without claiming a personalized or verified match that the product cannot substantiate.

### 3. Request and prepare for an appointment

| Screen | Purpose |
|---|---|
| **Booking Request** | Choose a service and an offered time, provide essential hair and contact details, and review the expected price, duration, location, and cancellation policy before submitting. Make the request status clear until the braider confirms it. |
| **Appointment Detail** | Show the confirmed time, place, service, price or agreed estimate, contact details, and any changes or cancellation options. Include a short preparation checklist from the braider. |

An estimate must be labeled as an estimate. HairPop should only call a price or appointment confirmed once the braider has accepted it.

### 4. Follow up

| Screen | Purpose |
|---|---|
| **Care and Review** | Give concise care instructions for the booked style, then offer a simple rating and written review after the appointment. Provide a way to request the same service again. |
| **My Appointments** | Show upcoming and past appointments, their status, and links to details, reviews, and rebooking. |

### 5. Braider essentials

Braiders need a straightforward way to keep services, prices, portfolio photos, service area, and availability current, and to accept or decline booking requests. These tasks can fit into existing management screens; a new studio dashboard is outside this redesign.

---

## Scope decisions

- Replace the standalone search landing page and flat hairstyle catalog with the Style Gallery and Style Detail.
- Keep a braider list as the Matching Braiders screen, filtered by the chosen style. Keep direct braider profile links for customers who already know whom they want.
- Reuse the current reviews and braider information where possible. Add booking and appointment data only for the screens that need it.
- Defer AI try-on, personalized feeds, video reviews, calendar integration, live arrival tracking, chair features, push-driven care plans, loyalty, group booking, and income forecasting.

---

## First journey slice

Prototype and validate one complete path:

> **Style Gallery → Style Detail → Matching Braiders → Braider Profile → Booking Request → Appointment Detail**

Test whether customers can identify a suitable braider, understand the cost and time, and tell whether their appointment is requested or confirmed. Add Care and Review and My Appointments once that core path works.
