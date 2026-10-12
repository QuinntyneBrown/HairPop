# 03 · Accounts and signing in

You can browse styles and braiders on HairPop without an account. To keep your appointments and trusted braiders in one place, you need one. This video shows the account features of the customer web app: creating an account, how the form validates and recovers from failures, signing in, what HairPop deliberately does not tell you when a sign-in fails, and how the session shows up across the app.

Everything is recorded from the real app against the stubbed API. The customer is Maya Chen, maya dot chen at example dot com, from the mock cast.

## Creating an account

The create account page is titled Join HairPop. The form asks for three things: a name, an email, and a password of at least twelve characters, with that rule stated under the field before you type.

Submitting an empty form sends nothing. An error summary at the top counts the answers to check and links to each field. Fill in a name, a malformed email like maya dot chen at, and a password that is too short, and each field says exactly what it needs: enter a full email address, like name at example dot com, and use at least twelve characters. Again, nothing is sent to the server until the answers are valid. Below the form, links lead to sign in, the terms and the privacy information.

## When creating an account fails

With valid details, Maya presses Create account, and this time the server fails. The page says we couldn't create your account, asks her to check her connection and try again, and tells her that nothing she entered was lost. Every field, including the password, is still filled in.

Pressing Create account again succeeds. The page confirms that her account is ready and that a verification link was sent to her email address, with a Verify email action. Behind the scenes, the retry reuses the same request key as the failed attempt, so a slow network can never create two accounts. And the answer is the same whether or not that email was already registered, so the form never reveals who has an account.

## Signing in

The sign in page greets returning customers with Welcome back. Like account creation, it validates before it sends anything. An incomplete email and an empty password produce a summary that says check two answers, and a message on each field.

When the email and password are well formed but wrong, HairPop says we couldn't sign you in, check your email and password and try again. It never says which of the two was wrong, because that would tell an attacker which email addresses have accounts. The email stays filled in, and the password is cleared.

After too many attempts the server rate limits sign in, and the page says so plainly, too many sign-in attempts, and tells Maya when she can try again, here in two minutes, while keeping her email.

## A successful sign in

From any page, Sign in in the top bar opens the sign in form. It also offers Forgot your password and Create an account. With the right email and password, Maya is signed in and lands on the style gallery. The top bar now shows her first name, Maya, in place of Sign in, linking to her account settings.

Two details are worth knowing. When the sign in page is opened with a return address, a successful sign in returns there, but only to pages on HairPop itself; an address that leaves the site is ignored. And an existing session is recognised on any page, so a returning customer sees her name without signing in again.

## Recap

Things to remember. Account creation asks for a name, an email and a password of at least twelve characters, and validates before sending. Failures keep every entry, and retries reuse a request key so only one account is ever made. Sign in never reveals which credential was wrong, explains rate limits with a time, and only returns to addresses on HairPop. Once signed in, the top bar shows the customer's first name on every page.

Next, we look at help, legal pages, privacy choices, themes and the error pages that keep people moving.
