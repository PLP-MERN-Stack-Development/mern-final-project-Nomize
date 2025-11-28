import "@testing-library/jest-dom";

// Mock localStorage
if (typeof globalThis.localStorage === "undefined") {
  // @ts-ignore
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
}

// Mock matchMedia
if (typeof window.matchMedia === "undefined") {
  // @ts-ignore
  window.matchMedia = () => ({
    matches: false,
    media: "",
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    dispatchEvent: () => false,
  });
}
