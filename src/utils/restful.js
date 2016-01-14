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

export function create(resourceName) {
  return new Collection(ROOT, resourceName);
}

export function createSingle(resourceName) {
  return new Collection(ROOT, resourceName).one();
}

export class Model {
  constructor(root, id) {
    this.url = id ? `${root}/${id}` : root;
  }
  create(resourceName) {
    return new Collection(this.url, resourceName);
  }
  createSingle(resourceName) {
    return new Model(`${this.url}/${resourceName}`);
  }
  get(params) {
    return request('get', `${this.url}${handleQueryString(params)}`);
  }
  put(data) {
    return request('put', this.url, data);
  }
  delete() {
    return request('delete', this.url);
  }
}

export class Collection {
  constructor(root, resourceName) {
    this.url = `${root}/${resourceName}`;
  }
  one(id) {
    return new Model(this.url, id);
  }
  getAll(params) {
    return request('get', `${this.url}${handleQueryString(params)}`);
  }
  post(data) {
    return request('post', this.url, data);
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
    notification.error({
      message: `错误代码：${res.status || '未知'}`,
      description: data.message || '未知错误信息',
    });
    return data;
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
