/* eslint-disable no-undef */

const mockStorage: Record<string, string> = {};

const mockAsyncStorage = {
  setItem: jest.fn((key: string, value: string) => {
    mockStorage[key] = value;
    return Promise.resolve(null);
  }),
  getItem: jest.fn((key: string) => {
    return Promise.resolve(mockStorage[key] || null);
  }),
  removeItem: jest.fn((key: string) => {
    delete mockStorage[key];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
    return Promise.resolve(null);
  }),
  getAllKeys: jest.fn(() => {
    return Promise.resolve(Object.keys(mockStorage));
  }),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: any) => React.createElement(View, null, children),
    SafeAreaView: ({ children, style }: any) => React.createElement(View, { style }, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});


jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, props),
    Svg: (props: any) => React.createElement(View, props),
    Circle: (props: any) => React.createElement(View, props),
    Ellipse: (props: any) => React.createElement(View, props),
    G: (props: any) => React.createElement(View, props),
    Text: (props: any) => React.createElement(View, props),
    TSpan: (props: any) => React.createElement(View, props),
    TextPath: (props: any) => React.createElement(View, props),
    Path: (props: any) => React.createElement(View, props),
    Polygon: (props: any) => React.createElement(View, props),
    Polyline: (props: any) => React.createElement(View, props),
    Line: (props: any) => React.createElement(View, props),
    Rect: (props: any) => React.createElement(View, props),
    Use: (props: any) => React.createElement(View, props),
    Image: (props: any) => React.createElement(View, props),
    Symbol: (props: any) => React.createElement(View, props),
    Defs: (props: any) => React.createElement(View, props),
    LinearGradient: (props: any) => React.createElement(View, props),
    RadialGradient: (props: any) => React.createElement(View, props),
    Stop: (props: any) => React.createElement(View, props),
    ClipPath: (props: any) => React.createElement(View, props),
    Pattern: (props: any) => React.createElement(View, props),
    Mask: (props: any) => React.createElement(View, props),
  };
});

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  const DummyIcon = (props: any) => React.createElement(View, props);
  return new Proxy({}, {
    get: () => DummyIcon,
  });
});

