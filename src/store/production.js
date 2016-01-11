import { applyMiddleware, compose, createStore } from 'redux';
import { reduxReactRouter } from 'redux-router';
import thunk from 'redux-thunk';
import multi from 'redux-multi';

import history from '#/utils/history';

module.exports = compose(
  applyMiddleware(thunk, multi),
  reduxReactRouter({
    createHistory: () => {
      return history;
    }
  })
)(createStore);