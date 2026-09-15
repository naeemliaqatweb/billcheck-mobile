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
