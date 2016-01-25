import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import welcome from './welcome';
import user from './user';
import organizations from './organizations';
import members from './members';
import productions from './productions';
import distributions from './distributions';
import configs from './configs';
import drafts from './drafts';
import libraries from './libraries';
import Flux from '#/utils/redux-rest';
import { path } from '#/utils/params';

const myAPI = {
  categories: ({orgId, productId} = path()) => `/organizations/${orgId}/products/${productId}/categories`,
  articles: ({orgId, productId, categoryId} = path()) => `/organizations/${orgId}/products/${productId}/categories/${categoryId}/articles`,
  orgArticles: ({orgId} = path()) => `/organizations/${orgId}/articles`,
  dynamicFieldConfigs: ({orgId, productId} = path()) => `/organizations/${orgId}/products/${productId}/dynamic_field_configs`,
  products: ({orgId} = path()) => `/organizations/${orgId}/products`
}

export const flux = new Flux(myAPI);

export default combineReducers({
  ...flux.reducers,
  router: routerStateReducer,
  welcome,
  user,
  organizations,
  members,
  productions,
  libraries,
  drafts,
  distributions,
  configs,
});
