import { applyMiddleware, compose, createStore } from 'redux';
import { reduxReactRouter } from 'redux-router';
import thunk from 'redux-thunk';
import multi from 'redux-multi';

import history from '#/utils/history';

import { persistState } from 'redux-devtools';
import DevTools from '#/containers/DevTools/DevTools';

module.exports = compose(
  applyMiddleware(thunk, multi),
  reduxReactRouter({
    createHistory: () => {
      return history;
    }
  }),
  DevTools.instrument(),
  persistState(getDebugSessionKey())
)(createStore);

function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}