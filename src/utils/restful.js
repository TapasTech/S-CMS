import snakeCase from 'lodash/string/snakeCase';
import isPlainObject from 'lodash/lang/isPlainObject';
import {notification} from 'tapas-ui';
import fetch from 'isomorphic-fetch';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

let ROOT = '/backend';
let myFetch = fetch;

export function configRoot(root) {
  ROOT = root;
}

export function configFetch(fetch) {
  myFetch = fetch;
}

export function collection(resourceName) {
  return new Collection(ROOT, resourceName);
}

export function model(resourceName) {
  return new Collection(ROOT, resourceName).model();
}

class Base {
  collection(name) {
    return new Collection(this.url, name);
  }
  model(name) {
    return new Model(this.url, name);
  }
  get(params) {
    return request('get', `${this.url}${handleQueryString(params)}`);
  }
}

export class Model extends Base {
  constructor(root, id) {
    super();
    this.url = id ? `${root}/${id}` : root;
  }
  put(data) {
    return request('put', this.url, camelCase2SnakeCase(data));
  }
  delete() {
    return request('delete', this.url);
  }
}

export class Collection extends Base {
  constructor(root, resourceName) {
    super();
    this.url = `${root}/${resourceName}`;
  }
  post(data) {
    return request('post', this.url, camelCase2SnakeCase(data));
  }
}

function request(method, url, data) {
  let config = {
    method,
    headers,
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
    let description;
    try {
      description = data.message || JSON.stringify(data);
    } catch (e) {
      description = '未知错误信息';
    }
    notification.error({
      message: `错误代码：${res.status || '未知'}`,
      description,
    });
    return data;
  });
}

export function handleQueryString(params) {
  let result = [];
  for (let key in params) {
    let value = params[key];
    result.push(`${key}=${value}`);
  }
  return result.length ? '?' + result.join('&') : '';
}

export function camelCase2SnakeCase(obj) {
  let result = {};
  for (let attr in obj) {
    if (!obj.hasOwnProperty(attr))
      continue;
    let value = obj[attr];
    result[snakeCase(attr)] = isPlainObject(value) ? camelCase2SnakeCase(value) : value;
  }
  return result;
}
