// How many instances of each scenario the runner renders in one measurement.
// Calibrate each so one render takes roughly 100–300 ms in Chromium. Never lower an
// iteration count to clear a regression flag. Scenarios not listed render 50 times.
export default {
  Button: 50,
  Gallery: 100,
  ReviewQuote: 120,
  ThemeToggle: 400,
  TopBar: 50,
};
