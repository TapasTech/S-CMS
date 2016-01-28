import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from '#/store/index';
import {
  renderIntoDocument,
} from 'react-addons-test-utils';
import Restful from './restful';

export function mockFetch(fn) {
  Restful.config({fetch: fn});
  return fn;
}

export function renderComponent(ReactElement) {
  const instance = renderIntoDocument(
    ReactElement
  );
  const node = ReactDOM.findDOMNode(instance);
  return {instance, node};
}

export function renderConnectComponent(ReactElement) {
  let {instance} = renderComponent(ReactElement);
  instance = instance.refs.main.getWrappedInstance();
  const node = ReactDOM.findDOMNode(instance);
  return {instance, node};
}
