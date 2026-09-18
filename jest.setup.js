/* eslint-disable no-undef */
const { NativeModules } = require('react-native');

const mockStorage = {};

const mockAsyncStorage = {
  setItem: jest.fn((key, value) => {
    mockStorage[key] = value;
    return Promise.resolve(null);
  }),
  getItem: jest.fn((key) => {
    return Promise.resolve(mockStorage[key] || null);
  }),
  removeItem: jest.fn((key) => {
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

NativeModules.BillNotificationModule = {
  requestNotificationPermission: jest.fn(() => Promise.resolve(true)),
  showBillNotification: jest.fn(() => Promise.resolve(true)),
  cancelBillNotification: jest.fn(() => Promise.resolve(true)),
  scheduleMonthlyCheck: jest.fn(() => Promise.resolve(true)),
};

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaView: ({ children, style }) => React.createElement(View, { style }, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => React.createElement(View, props),
    Svg: (props) => React.createElement(View, props),
    Circle: (props) => React.createElement(View, props),
    Ellipse: (props) => React.createElement(View, props),
    G: (props) => React.createElement(View, props),
    Text: (props) => React.createElement(View, props),
    TSpan: (props) => React.createElement(View, props),
    TextPath: (props) => React.createElement(View, props),
    Path: (props) => React.createElement(View, props),
    Polygon: (props) => React.createElement(View, props),
    Polyline: (props) => React.createElement(View, props),
    Line: (props) => React.createElement(View, props),
    Rect: (props) => React.createElement(View, props),
    Use: (props) => React.createElement(View, props),
    Image: (props) => React.createElement(View, props),
    Symbol: (props) => React.createElement(View, props),
    Defs: (props) => React.createElement(View, props),
    LinearGradient: (props) => React.createElement(View, props),
    RadialGradient: (props) => React.createElement(View, props),
    Stop: (props) => React.createElement(View, props),
    ClipPath: (props) => React.createElement(View, props),
    Pattern: (props) => React.createElement(View, props),
    Mask: (props) => React.createElement(View, props),
  };
});

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  const DummyIcon = (props) => React.createElement(View, props);
  return new Proxy({}, {
    get: () => DummyIcon,
  });
});

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    WebView: (props) => React.createElement(View, { testID: 'mock-webview', ...props }),
  };
});
