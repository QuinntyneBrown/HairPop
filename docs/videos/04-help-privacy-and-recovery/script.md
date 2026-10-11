# 04 · Help, privacy and recovery

The previous videos followed the main journey: styles, braiders and accounts. This one covers everything around it that makes HairPop trustworthy to use: the privacy choices a first-time visitor is offered, the light and dark themes, help, the terms and privacy pages, the error pages that keep people moving when something goes wrong, and the keyboard support built into every page.

As in the other videos, this is the real customer app recorded against the stubbed API from the end-to-end tests.

## Privacy choices

On a first visit, a banner above the top bar asks one question: your privacy choices, choose whether optional usage data may be stored. Nothing optional is stored before you answer. You can allow optional data, choose essential only, or open Cookie preferences for the details.

The preferences dialog explains that essential storage is always on, because it keeps you signed in and remembers this choice, and that HairPop works the same either way. Nothing is pre-selected. Saving without an answer is refused with a clear message: choose whether to allow optional usage data. Choose Essential only and save, and the banner disappears, the choice is stored, and a toast confirms it, preferences saved, with a Change action to reopen the dialog.

Returning visitors never see the banner again. They can revise their choice at any time from Cookie preferences in the footer. The dialog opens with the saved answer already selected, and after saving, focus returns to the footer link that opened it.

## Light and dark themes

The top bar has a Dark theme toggle. With no saved choice, HairPop follows the system preference. Pressing the toggle switches every surface to dark at once and marks the toggle as pressed. The choice is remembered: it survives navigating to Help and even a full reload. Pressing it again returns to the light theme.

## Help

Help is one of the four primary destinations in the top bar. How can we help shows four topics: how requests work, prices and estimates, changing an appointment, and reviews. Each answers in a sentence, for example, a request becomes an appointment only when the braider accepts it. Email support opens a message to the support address. When Help is opened with a request reference in the address, that reference goes into the email subject, and anything that is not a plain reference code is ignored.

## Terms and privacy

Terms and Privacy are linked from the footer of every page and need no account. Each shows the approved text with its effective date, here the first of October twenty twenty-six, organised under clear headings such as prices and appointments. If the text cannot load, the page says so instead of inventing any policy wording.

## Error pages

Every error page gives an honest message and a safe next step. An unknown address shows we couldn't find that page, explains the link may be old, and offers Explore styles.

A page you are not allowed to open says you can't open this page and offers Sign in. A server failure says HairPop needs a moment, reassures you that your booking request has not been resent, shows a support reference with the time it happened, and offers Contact support and Try again. And when the device is offline, a dedicated page explains that saved appointment details remain available while requests need a connection.

## Keyboard and screen readers

HairPop works without a mouse. The first press of Tab on any page reveals a Skip to content link, and Enter on it moves focus straight to the main content. From there, Tab walks through the search box, Find braiders, the category buttons and the cards, each with a visible focus ring. Opening a card moves focus to the new page's heading and announces the page title to screen readers, so nobody is left at the top of a page they cannot see.

## Recap

Things to remember. First-time visitors choose about optional data before anything optional is stored, and can change their mind from the footer. The theme follows the system until you choose, then remembers. Help, terms and privacy are always one click away and never invent text. Error pages explain what happened and offer a safe next step. And every page supports keyboard and screen reader users from the first Tab.

That completes the tour of the HairPop customer web app.
