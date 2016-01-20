import React from 'react';
import { Provider } from 'react-redux';

// Data
import store from '#/store/index';

const Router = process.env.NODE_ENV === 'production' ? require('#/router') : require('./devRouter');

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}