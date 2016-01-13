import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { ReduxRouter } from 'redux-router';

// Data
import store from './store';

// Component
import Login from './containers/Login/Login';
import Register from './containers/Register/Register';

import Dashboard from './containers/Dashboard/Dashboard';

import Overcoat from './containers/Overcoat/Overcoat';

import Settings from './containers/Settings/Settings';

import Library from './containers/Library';
import Draft from './containers/Draft';
import Distribution from './containers/Distribution';

const Page = {
  Login,
  Register,
  Dashboard,
  Org: {
    Settings,
    Product: {
      Overcoat,
      Library,
      Draft,
      Distribution
    }
  }
};

module.exports = class Router extends React.Component {
  render() {
    return (
      <ReduxRouter>
        <Route path="/">
          /*登陆注册*/
          <Route path="login" component={Page.Login}></Route>
          <Route path="register" component={Page.Register}></Route>

          /*欢迎页*/
          <Route path="dashboard" component={Page.Dashboard}></Route>

          /*产品端*/
          <Route path=":orgId">
            /*管理员配置*/
            <Route path="settings" component={Page.Org.Settings}></Route>
            /*应用*/
            <Route path=":productId" component={Page.Org.Product.Overcoat}>
              <Route path="library">
                <Route path="external">
                  <IndexRoute component={Page.Org.Product.Library.External}></IndexRoute>
                  <Route path=":articleId" component={Page.Org.Product.Library.ArticleView}></Route>
                </Route>
                <Route path="internal" >
                  <IndexRoute component={Page.Org.Product.Library.Internal}></IndexRoute>
                  <Route path=":articleId" component={Page.Org.Product.Library.ArticleView}></Route>
                </Route>
              </Route>
              <Route path="draft">
                <Route path="list" component={Page.Org.Product.Draft.List}></Route>
                <Route path=":draftTypeId/:draftId" component={Page.Org.Product.Draft.Editor}></Route>
              </Route>
              <Route path="distribution">
                <Route path=":blockId" component={Page.Org.Product.Distribution.Block}></Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </ReduxRouter>
    )
  }
}
