import '@testing-library/jest-dom';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
(process.env as any).NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
(process.env as any).NEXT_PUBLIC_SUPABASE_ANON_KEY = 'example-key';

// window.location mock 설정
const mockLocation = {
  href: 'http://localhost/',
  pathname: '/',
  search: '',
  hash: '',
  origin: 'http://localhost',
  protocol: 'http:',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  toString: jest.fn(() => 'http://localhost/'),
};

delete (window as unknown as Record<string, unknown>).location;
(window as unknown as Record<string, unknown>).location = mockLocation;

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
