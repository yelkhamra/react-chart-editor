/* jest.setup.js
 * Test framework setup for Enzyme and common jsdom polyfills
 */

/**
 * Force Enzyme to use the root CommonJS cheerio build compatible with Jest.
 * Enzyme 3.x depends on cheerio@^1.0.0-rc which ships ESM/browser bundles that
 * can trip up Jest. We mock cheerio to the root CJS build before requiring Enzyme.
 */

// Configure Enzyme for React 16
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
Enzyme.configure({adapter: new Adapter()});

// Add Jest matcher alias for legacy 'toBeCalled'
if (typeof expect !== 'undefined' && typeof expect.extend === 'function') {
  expect.extend({
    toBeCalled(received) {
      const pass =
        !!received &&
        !!received.mock &&
        Array.isArray(received.mock.calls) &&
        received.mock.calls.length > 0;

      return {
        pass,
        message: () =>
          pass
            ? 'Expected mock not to be called'
            : 'Expected mock to be called at least once',
      };
    },
  });
}

// matchMedia polyfill
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function matchMedia(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function () {}, // deprecated
      removeListener: function () {}, // deprecated
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return false;
      },
    };
  };
}

// ResizeObserver polyfill
if (typeof window !== 'undefined' && typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// document.createRange polyfill (used by Draft.js and others)
if (typeof document !== 'undefined' && !document.createRange) {
  document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: document.documentElement,
    getBoundingClientRect: () => ({right: 0}),
    getClientRects: () => ({length: 0}),
    createContextualFragment: (html) => {
      const template = document.createElement('template');
      template.innerHTML = html;
      return template.content;
    },
    selectNode: () => {},
    selectNodeContents: () => {},
  });
} else if (typeof document !== 'undefined') {
  // ensure createContextualFragment exists
  try {
    const testRange = document.createRange();
    if (typeof testRange.createContextualFragment !== 'function') {
      const originalCreateRange = document.createRange.bind(document);
      document.createRange = () => {
        const r = originalCreateRange();
        r.createContextualFragment = (html) => {
          const template = document.createElement('template');
          template.innerHTML = html;
          return template.content;
        };
        return r;
      };
    }
  } catch (e) {
    // jsdom might throw if not fully initialized yet; ignore
  }
}

// window.scrollTo stub
if (typeof window !== 'undefined' && typeof window.scrollTo !== 'function') {
  window.scrollTo = () => {};
}
