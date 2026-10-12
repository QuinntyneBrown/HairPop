# 02 · Finding a braider

Choosing a style is only half the decision. The other half is choosing the person who will spend five hours on your hair. This video covers the braider features of the HairPop customer web app: the matching braiders list, searching it, the filter dialog with its validation and failure handling, the Braiders destination, and the public braider profile with its portfolio and reviews.

As before, this is the real app recorded against the stubbed API used by the end-to-end tests. The braiders are the cast from the mocks: Nia Okafor, Aisha Mensah and Jules Baptiste.

## Matching braiders

Find a braider on a style page opens the braiders who offer that style. The heading names the style, braiders for knotless braids, and the line underneath says how many offer it near Toronto. A chip shows the style these results are for.

Each card answers the questions people ask before they click. At the top is availability: Nia is available Saturday the twenty-fourth of October, while Aisha has no times offered yet, and the card says exactly that instead of hiding the gap. Then the rating, four point nine from eighty-six reviews, which screen readers hear as one sentence. Then the area and the matching service with its starting price, Toronto West, knotless braids from one hundred eighty dollars. Jules has no published reviews, so the card says not yet rated rather than showing a number that means nothing. Every card links to that braider's profile.

## Searching braiders

The search box narrows the list by name without losing the style. Search for nia and one card remains, still under braiders for knotless braids, and the search term goes into the address. Search for something that matches nobody and the page says no braiders match that term, with a Clear filters action that brings back every braider for the style.

## Filtering by price and distance

Filters opens a dialog rather than an inline form. It asks two things: a maximum price, and a distance from Toronto. Enter two hundred dollars, choose within ten kilometres, and press Show braiders. The dialog closes, the list narrows to Nia and Jules, and a second chip summarises what is applied, under two hundred dollars within ten kilometres. Reopening Filters shows the values you already chose, and Cancel closes it without changing anything.

## When a filter is not right

The dialog checks answers before it sends anything. A maximum price of one hundred twenty dollars is below the cheapest knotless braids, so an error summary at the top says check one answer, links to the field, and the field itself explains: enter a maximum price of at least one hundred sixty dollars, the lowest price for this style. Your entries stay where they are.

Correct the price to two hundred and try again. This time the server fails, and the dialog is honest about it: we couldn't save this, nothing was changed, your entries are still here, so you can try again. Pressing Show braiders a second time applies the filters.

If valid filters simply match nobody, say under one hundred sixty five dollars within five kilometres, the page shows no matches, suggests a wider price range or distance, and offers Clear filters to restore every braider for the style.

## The Braiders destination

You do not have to start from a style. Braiders in the top bar lists braiders near Toronto without a style selected, using the same cards. Opening a card takes you to that braider's profile.

## The braider profile

The profile starts with identity. Nia's name and initials, her rating with its review count, her area and how far she travels, up to ten kilometres, and a short introduction in her own words. The main action is Request an appointment, which keeps this braider's identity for the booking.

Services lists what she offers with a starting price and typical length, medium knotless braids from one hundred eighty dollars at about five hours, and passion twists from one hundred sixty. Beside it, Before you book collects the practical terms: the service area, preparation, changes, and cancellation, free up to forty-eight hours before. Note what is missing on purpose. The studio address is never shown publicly. It is shared only after Nia accepts a request.

Recent work shows the portfolio in order with captions. An item whose photo is missing gets a placeholder panel instead of a broken image. Customer reviews follow, each with its score, its date, the words of the review and who wrote it for which service. Reviews are always rendered as text, so markup in a review cannot run.

## Partial and empty profiles

If reviews fail to load, the profile does not fall over. A single warning says reviews couldn't load and reassures you that Nia's services, prices and policies are up to date. Retry reviews loads them in place.

A braider who is just starting out gets honest empty states. With no published reviews, the rating says not yet rated, recent work says no portfolio photos yet, and reviews says none have been published yet, while services and policies stay visible.

## Recap

Things to remember. Matching cards show availability, an honest rating, the area and the service price, and never a made-up number. Search and filters narrow the list without losing the style, and filters live in a dialog that validates, survives failures and keeps your entries. Profiles show identity, services, terms, work and reviews, keep the studio address private until a request is accepted, and degrade gracefully when part of the data is missing.

Next, we look at accounts: creating one and signing in.
