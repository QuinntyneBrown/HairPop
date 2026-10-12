# 01 · Discovering styles

HairPop connects customers with professional hair braiders. Before anyone books anything, they need to answer a simpler question: which style do I actually want? This video walks through the style discovery features of the HairPop customer web app, recorded from the real Angular app. You will see the style gallery, its categories and search, paging, what happens when the network lets you down, and the style detail page that hands you over to braiders.

Everything on screen is the built app rendering against the same stubbed API the end-to-end tests use, so the styles, prices and names come from the cast in the mocks.

## The style gallery

The gallery is the home page. Its heading says it plainly: find a style that feels like you. Under it sit a search box, a Find braiders shortcut, and a row of category buttons.

Each card is one published style. It shows a short eyebrow such as Most explored, the style name, and the two facts people ask about first: typical time and typical price. Knotless braids, for example, read four to seven hours typical, typically one hundred sixty to three hundred dollars. When a style has no photo yet, the card shows a soft illustrated panel instead of a stock image, and when a price range is not published, as with cornrows, the card simply leaves it out rather than inventing one. Every card ends with an Explore link to that style. The top bar marks Styles as the current destination.

## Categories and search

The category buttons narrow the gallery without leaving the page. Choose Braids and only knotless braids and cornrows remain. Twists leaves passion twists, Locs leaves starter locs, and All styles brings everything back. The selected button is shown as pressed, both visually and to screen readers, and the choice is written into the address, so a filtered gallery can be bookmarked or shared.

Search works the same way. Type knotless, press Enter, and the gallery shows one card, with a results line that reads one style. Search and category combine: searching for twisted locs inside Locs finds nothing, so the gallery says exactly that, no styles match twisted locs in Locs, and offers a single Clear filters action that resets both the search and the category in one step.

## Paging through results

When there are more styles than fit on one page, a pagination bar appears under the cards and tells you where you are, for example showing one to two of three. Choosing Next loads the following page. Notice that the Braids category stays selected and the address keeps both the category and the page number, so nothing you chose is lost and no card is repeated.

## When things go wrong

Real networks fail, and the gallery is honest about it. If the server cannot answer, the results area is replaced with a clear message, we couldn't load styles, with a reassurance that nothing you entered was lost and a Try again button. Retrying keeps your category, here Twists.

Going offline is handled separately from a server error. If the connection drops while you change category, the gallery shows a You're offline notice explaining that styles need a connection. When the connection returns, Try again loads the braids you asked for.

## The style detail page

Opening a card takes you to the style's own page. For knotless braids you get a large photo, a short explanation of what to expect, and three facts side by side: typical time of four to seven hours, a typical price range, and typical wear of four to eight weeks.

Below that, Variations explain the sizes, small, medium and large, with how long each usually takes. What changes the final quote lists the factors that move the price, like length, hair density, bringing your own extensions, and add-ons. A note underneath makes the promise explicit: prices are typical ranges, and your braider confirms the final price when they accept your request. The Make it yours panel ends with Find a braider, which opens the braiders who offer this style.

## Partial information

Sometimes only part of a style loads. Rather than guess, the page shows what it has and warns about the rest. Here the typical wear fact could not load, so a warning names it and offers Retry. Retrying fills in the missing fact while everything else stays exactly where it was.

## Recap

Things to remember. The gallery shows every published style with typical time and price, and never invents a missing value. Categories, search and pages all live in the address, and Clear filters resets them together. Failures and offline states explain themselves and retry without losing your choices. And every style page ends with a direct path to the braiders who offer it.

Next, we follow that path and look at finding and comparing braiders.
