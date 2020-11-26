import * as React from 'react';
import usePrevious from './usePrevious';
import canUseDOM from './canUseDOM';
const FOCUSABLE_ELEMENT_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, [tabindex="0"], [contenteditable]';
export default function (screenRef, isScreenActive) {
  if (canUseDOM) {
    const cleanFocusLoopListener = React.useRef();
    const wasScreenActive = usePrevious(isScreenActive);
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