import snakeCase from 'lodash/string/snakeCase';
import isPlainObject from 'lodash/lang/isPlainObject';
import {notification} from 'tapas-ui';
import fetch from 'isomorphic-fetch';

let myRoot = '/api';
let myFetch = fetch;
let myHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Http-Authorization': localStorage.getItem('__AUTH')
};

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
    return
  if (res.status >= 200 && res.status < 300)
    return res.json();
  else
    throw res;
}

function handleBadResponse(res) {
  return res.json().then(data => {
    notification.error({
      message: `错误代码：${res.status || '未知'}`,
      description: data.message || JSON.stringify(data),
    });
    return data;
  }, () => {
    notification.error({
      message: `错误代码：${res.status || '未知'}`,
      description: res.statusText,
    });
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

function camelCase2SnakeCase(obj) {
  let result = {};
  for (let attr in obj) {
    if (!obj.hasOwnProperty(attr))
      continue;
    let value = obj[attr];
    result[snakeCase(attr)] = isPlainObject(value) ? camelCase2SnakeCase(value) : value;
  }
  return result;
}

module.exports = {
  config,
  collection: function (name) {
    return new Collection(myRoot, name);
  },
  fetch: function (url) {
    return new Resource(myRoot, url);
  },
  //内部方法
  handleQueryString,
  camelCase2SnakeCase,
  Model,
  Collection,
  Resource,
  CRUD: {get, post, put, del},
};
