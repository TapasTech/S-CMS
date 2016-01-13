import React from 'react';
import Router from '../../router';
import DevTools from '../DevTools/DevTools';

module.exports = class Root extends React.Component {
  render() {
    return (
      <div>
        <Router />
        <DevTools />
      </div>
    )
  }
}