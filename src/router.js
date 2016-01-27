import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import { ReduxRouter } from 'redux-router';

// Data
import store from './store';
import Page from './containers';

module.exports = class Router extends React.Component {
  render() {
    return (
      <ReduxRouter>
        <Route path="/" component={Page.Base}>

          <IndexRedirect to="/dashboard" />

          /*登陆注册*/
          <Route path="login" component={Page.Login}></Route>
          <Route path="register" component={Page.Register}></Route>

          /*创建企业*/
          <Route path="create" component={Page.CreateOrg}></Route>

          /*欢迎页*/
          <Route path="dashboard" component={Page.Dashboard}></Route>

          /*产品端*/
          <Route path=":orgId">
            /*管理员配置*/
            <Route path="settings" component={Page.Org.Settings.SettingContainer}>
              /* 产品端设置 */
              <Route path="product">
                <IndexRoute component={Page.Org.Settings.ProductList}></IndexRoute>
                <Route path=":productId" component={Page.Org.Settings.ProductItem}></Route>
              </Route>
              /* 企业设置 */
              <Route path="organization" component={Page.Org.Settings.Organization}></Route>
              /* 成员管理 */
              <Route path="member" component={Page.Org.Settings.Member}></Route>
            </Route>
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
                <IndexRoute component={Page.Org.Product.Draft.List} />
                <Route path=":draftTypeId" component={Page.Org.Product.Draft.List} />
                <Route path=":draftTypeId/:draftId" component={Page.Org.Product.Edit.Draft}></Route>
              </Route>
              <Route path="distribution">
                <Route path=":categoryId" component={Page.Org.Product.Distribution.Category}></Route>
                <Route path=":categoryId/:articleId/edit" component={Page.Org.Product.Edit.Article}></Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </ReduxRouter>
    )
  }
}
