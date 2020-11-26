"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var React = _interopRequireWildcard(require("react"));

var _usePrevious = _interopRequireDefault(require("./usePrevious"));

var _canUseDOM = _interopRequireDefault(require("./canUseDOM"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const FOCUSABLE_ELEMENT_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, [tabindex="0"], [contenteditable]';

function _default(screenRef, isScreenActive) {
  if (_canUseDOM.default) {
    const cleanFocusLoopListener = React.useRef();
    const wasScreenActive = (0, _usePrevious.default)(isScreenActive);
    React.useEffect(() => {
      if (wasScreenActive && !isScreenActive) {
        var _cleanFocusLoopListen;

        (_cleanFocusLoopListen = cleanFocusLoopListener.current) === null || _cleanFocusLoopListen === void 0 ? void 0 : _cleanFocusLoopListen.call(cleanFocusLoopListener);
        return;
      }

      if (!wasScreenActive && isScreenActive) {
        // @ts-expect-error: We can safely assume that screenRef is containing a HTMLElement, specifically <div />, because we're in web world
        cleanFocusLoopListener.current = loopFocus(screenRef === null || screenRef === void 0 ? void 0 : screenRef.current);
      }
    }, [isScreenActive, screenRef, wasScreenActive]);
  }
} // This function is based on https://gist.github.com/r3lk3r/0030bab99347a2326334e00b23188cab#file-focusloopingutil-js


function loopFocus(rootElement) {
  if (!rootElement) {
    throw new Error('Could not initialize focus-trapping - Root Element Missing');
  }

  const focusableElements = rootElement.querySelectorAll(FOCUSABLE_ELEMENT_SELECTORS); // There can be containers without any focusable element

  if (focusableElements.length > 0) {
    const firstFocusableEl = focusableElements[0];
    const lastFocusableEl = focusableElements[focusableElements.length - 1];
    firstFocusableEl.focus();

    const keyboardHandler = event => {
      // keyCode used for legacy browsers compatibility
      const key = event.key || event.keyCode;

      if (key === 'Tab' || event.keyCode === 9) {
        //Rotate Focus
        if (event.shiftKey && document.activeElement === firstFocusableEl) {
          event.preventDefault();
          lastFocusableEl.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusableEl) {
          event.preventDefault();
          firstFocusableEl.focus();
        } else {// do nothing & let the browser handle tabbing
        }
      }
    };

    rootElement.addEventListener('keydown', keyboardHandler);
    return () => {
      rootElement.removeEventListener('keydown', keyboardHandler);
    };
  } else {
    return () => {};
  }
}
//# sourceMappingURL=useActiveScreenFocusTrap.js.map