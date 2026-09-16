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

jest.mock('../src/components/home/DashboardHeroCard', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    DashboardHeroCard: () => React.createElement(View),
  };
});

jest.mock('../src/components/NewMeterFab', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    NewMeterFab: () => React.createElement(View),
  };
});

describe('App Root Component Test Suite', () => {
  it('renders root navigation and screens cleanly', async () => {
    let tree: any;
    await act(async () => {
      tree = ReactTestRenderer.create(<App />);
    });
    expect(tree).toBeDefined();
    expect(tree.toJSON()).toBeDefined();
  });
});
