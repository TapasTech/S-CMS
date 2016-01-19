import snakeCase from 'lodash/string/snakeCase';
import camelCase from 'lodash/string/camelCase';
import isObject from 'lodash/lang/isObject';
import forEach from 'lodash/collection/forEach';
import fetch from 'isomorphic-fetch';

// todo: remove the custom dependencies.
import { notification } from 'tapas-ui';
import { pushState } from 'redux-router';
import store from '#/store';

let myRoot = '/api';
let myFetch = fetch;
let myHeaders;

function config(options) {
  const {root, fetch, headers} = options;
  if (typeof root === 'string')
    myRoot = root;
  if (typeof fetch === 'function')
    myFetch = fetch;
  if (typeof headers === 'object')
    myHeaders = headers;
}

class Base {
  constructor(root, resourceName) {
    this.url = `${root}/${resourceName}`;
  }
  get(params) {
    return get(this.url, params);
  }
}

class Model extends Base {
  constructor(...args) {
    super(...args);
  }
  resource(name) {
    return new Resource(this.url, name);
  }
  collection(name) {
    return new Collection(this.url, name);
  }
  put(data) {
    return put(this.url, data);
  }
  delete() {
    return del(this.url);
  }
}

class Collection extends Base {
  constructor(...args) {
    super(...args);
  }
  resource(name) {
    return new Resource(this.url, name);
  }
  model(name) {
    return new Model(this.url, name);
  }
  post(data) {
    return post(this.url, data);
  }
}


class Resource extends Base {
  constructor(...args) {
    super(...args);
  }
  post(data) {
    return post(this.url, data);
  }
  put(data) {
    return put(this.url, data);
  }
  delete() {
    return del(this.url);
  }
}

function get(url, params) {
  return request('get', `${url}${handleQueryString(params)}`);
}

function post(url, data) {
  return request('post', url, camelCase2SnakeCase(data));
}

function put(url, data) {
  return request('put', url, camelCase2SnakeCase(data));
}

function del(url) {
  return request('delete', url);
}

function request(method, url, data) {
  let config = {
    method,
    headers: myHeaders,
  };
  if (data)
    config.body = JSON.stringify(data);
  return myFetch(url, config)
  .then(handleResponse)
  .catch(handleBadResponse);
}

function handleResponse(res) {
  if (res.status === 204)
    return {};
  if (res.status >= 200 && res.status < 300)
    return res.json().then(data => {
      return snakeCase2CamelCase(data)
    });
  else
    throw res;
}

function handleBadResponse(res) {
  if (res.status === 401) store.dispatch(pushState(null, '/login'));
  return res.json().then(data => {
    notification.error({
      message: `错误代码：${res.status || '未知'}`,
      description: data.message || JSON.stringify(data),
    });
    return {
      err: res,
      res: {},
    };
  }, () => {
    notification.error({
      message: `错误代码：${res.status || '未知'}`,
      description: res.statusText,
    });
    return {
      err: res,
      res: {},
    };
  });
}

function handleQueryString(params) {
  let result = [];
  for (let key in params) {
    let value = params[key];
    result.push(`${key}=${value}`);
  }
  return result.length ? '?' + result.join('&') : '';
}

/*
 * @param obj {Object|Array}
 */
function camelCase2SnakeCase(obj) {
  let result = {};
  if (Array.isArray(obj))
    result = [];
  forEach(obj, (value, name) => {
    result[snakeCase(name)] = isObject(value) ? camelCase2SnakeCase(value) : value;
  });
  return result;
}

/*
 * @param obj {Object|Array}
 */
function snakeCase2CamelCase(obj) {
  let result = {};
  if (Array.isArray(obj))
    result = [];
  forEach(obj, (value, name) => {
    result[camelCase(name)] = isObject(value) ? snakeCase2CamelCase(value) : value;
  });
  return result;
}

module.exports = {
  config,
  collection: function (name) {
    return new Collection(myRoot, name);
  },
  resource: function (url) {
    return new Resource(myRoot, url);
  },
  //内部方法
  handleQueryString,
  camelCase2SnakeCase,
  snakeCase2CamelCase,
  Model,
  Collection,
  Resource,
  CRUD: {get, post, put, del},
};
