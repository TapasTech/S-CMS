import React from 'react';
import Router from '#/router';
import DevTools from '#/containers/DevTools/DevTools';

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