import { ROUTER_STATE_SELECTOR } from 'redux-router/lib/constants';
import { PropTypes } from 'react';
import { pushState } from 'redux-router';

export default {
  contextTypes: {
    store: PropTypes.object
  },
  componentWillMount: function() {
    this.store = this.context.store;
    this.getRouter = () => this.store[ROUTER_STATE_SELECTOR](this.store.getState());
    this.getUrlQuery = (key) => key ? this.getRouter().location.query[key] : this.getRouter().location.query;
    this.getPathname = () => this.getRouter().location.pathname;
    this.getUrlParams = () => this.getRouter().params;
    this.dispatch = this.store.dispatch;
    this.pushState = (state, path, query) => this.dispatch(pushState(state, path, query));
    this.addQuery = query => this.pushState(
      null,
      this.getPathname(),
      Object.assign({}, this.getUrlQuery(), query)
    );
  }
}
