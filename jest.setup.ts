import '@testing-library/jest-dom';

// ResizeObserver Mock
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// DOM-specific Mocks
if (typeof window !== 'undefined') {
  // scrollIntoView Mock
  if (typeof Element !== 'undefined') {
    Element.prototype.scrollIntoView = jest.fn();
  }

  // PointerEvent Mock
  if (!global.PointerEvent) {
    class PointerEvent extends MouseEvent {
      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params);
      }
    }
    // @ts-expect-error - assigning custom PointerEvent to global for test environment compatibility
    global.PointerEvent = PointerEvent;
  }
}
