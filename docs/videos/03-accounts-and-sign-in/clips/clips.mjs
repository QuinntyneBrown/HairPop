// Screen captures for video 03, recorded with tools/video-record/record-clips.mjs.
// Each clip drives the built customer app against the e2e stub API, so the cast and copy
// come from e2e/fixtures (docs/mocks/README.md).

const MAYA = {
  name: 'Maya Chen',
  email: 'maya.chen@example.com',
  password: 'correct horse battery',
};

export default [
  {
    name: 'sign-up-validation',
    pace: 2.05,
    async setup({ page, pages }) {
      await new pages.SignUpPage(page).open();
    },
    async run({ page, act, pages }) {
      const signUp = new pages.SignUpPage(page);
      await act.wait(1000);
      await act.moveTo(signUp.heading);
      await act.wait(1200);
      await act.click(signUp.submit, 2000);
      await act.moveTo(signUp.summary);
      await act.wait(1500);
      await act.type(signUp.name, MAYA.name);
      await act.type(signUp.email, 'maya.chen@');
      await act.type(signUp.password, 'short');
      await act.click(signUp.submit, 2000);
      await act.moveTo(signUp.fieldErrors.first());
      await act.wait(1500);
      await act.moveTo(signUp.fieldErrors.last());
      await act.wait(1500);
      await act.moveTo(signUp.terms);
      await act.wait(1200);
    },
  },
  {
    name: 'sign-up-success',
    pace: 2.2,
    async setup({ page, api, fixtures, pages }) {
      const { registerAccepted } = fixtures.session;
      await api.given(
        registerAccepted(MAYA.email),
        fixtures.errors.serverError('POST', '/api/auth/register', { times: 1 }),
      );
      await new pages.SignUpPage(page).open();
    },
    async run({ page, act, pages }) {
      const signUp = new pages.SignUpPage(page);
      await act.wait(800);
      await act.type(signUp.name, MAYA.name);
      await act.type(signUp.email, MAYA.email);
      await act.type(signUp.password, MAYA.password);
      await act.click(signUp.submit, 2200);
      await act.moveTo(signUp.failure);
      await act.wait(2000);
      await act.click(signUp.submit, 2200);
      await act.moveTo(signUp.done);
      await act.wait(2000);
      await act.moveTo(signUp.verifyEmail);
      await act.wait(1500);
    },
  },
  {
    name: 'sign-in-problems',
    pace: 1.54,
    async setup({ page, api, fixtures, pages }) {
      const { signInRateLimited, signInRefused } = fixtures.session;
      await api.given(signInRateLimited(120), { ...signInRefused(), times: 1 });
      await new pages.SignInPage(page).open();
    },
    async run({ page, act, pages }) {
      const signIn = new pages.SignInPage(page);
      await act.wait(1000);
      await act.moveTo(signIn.heading);
      await act.wait(1000);
      await act.type(signIn.email, 'maya.chen@');
      await act.click(signIn.submit, 2000);
      await act.moveTo(signIn.summary);
      await act.wait(1800);
      await act.type(signIn.email, 'example.com');
      await act.type(signIn.password, 'wrong password');
      await act.click(signIn.submit, 2200);
      await act.moveTo(signIn.failure);
      await act.wait(2000);
      await act.moveTo(signIn.password);
      await act.wait(1200);
      await act.type(signIn.password, 'whatever it was');
      await act.click(signIn.submit, 2200);
      await act.moveTo(signIn.rateLimited);
      await act.wait(2000);
    },
  },
  {
    name: 'sign-in-success',
    pace: 0.71,
    async setup({ page, api, fixtures, pages }) {
      const { signInAccepted, maya } = fixtures.session;
      const { listStyles, gallery } = fixtures.styles;
      await api.given(signInAccepted(maya), listStyles(gallery));
      await new pages.StyleGalleryPage(page).open();
    },
    async run({ page, act, pages }) {
      const shell = new pages.Shell(page);
      const signIn = new pages.SignInPage(page);
      await act.wait(800);
      await act.click(shell.accountLink, 2000);
      await act.moveTo(signIn.forgotPassword);
      await act.wait(1200);
      await act.moveTo(signIn.createAccount);
      await act.wait(1200);
      await act.type(signIn.email, MAYA.email);
      await act.type(signIn.password, MAYA.password);
      await act.click(signIn.submit, 2500);
      await act.moveTo(shell.accountLink);
      await act.wait(2500);
    },
  },
];
