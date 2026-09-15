import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import App from '../App';

jest.mock('../src/screens/SplashScreen', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SplashScreen: ({ onFinish }: { onFinish: () => void }) => {
      React.useEffect(() => {
        onFinish();
      }, [onFinish]);
      return React.createElement(View);
    },
  };
});

test('renders correctly', async () => {
  let tree: any;
  await act(async () => {
    tree = ReactTestRenderer.create(<App />);
  });
  expect(tree).toBeDefined();
});


