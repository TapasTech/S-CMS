import {notification} from 'tapas-ui';
import fetch from 'isomorphic-fetch';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

const slashRegExp = /\//g;

let ROOT = '/backend';

export class Restful {
  static create(resourceName, fetch) {
    return createModel({
      type: 'normal',
      resource: resourceName,
      root: ROOT
    }, fetch);
  }
  static createSingle(resourceName, fetch) {
    return createModel({
      type: 'single',
      resource: resourceName,
      root: ROOT
    }, fetch);
  }
  static configRoot(root = '/') {
    ROOT = root;
  }
  // 把fetch方法设计成可以从外部注入，以方便测试
  // 在正常使用时，不需要传入`myFetch`参数
  constructor(options, myFetch = fetch) {
    const {url, type} = options;
    this.url = url;
    this.type = type;
    this.fetch = function () {
      return myFetch;
    };
  }
  one(id) {
    if (this.type === 'single')
      throwError('SINGLE_TYPE_NO_METHOD_ERROR');
    this.id = id;
    return this;
  }
  create(resourceName, fetch) {
    const isSingle = this.type === 'single';
    if (!isSingle && !this.id)
      throwError('CREATE_CHILD_MODEL_ERROR');
    const root = isSingle ? this.url : `${this.url}/${this.id}`;
    !isSingle && (this.id = null);
    return createModel({
      type: 'normal',
      resource: resourceName,
      root
    }, fetch);
  }
  createSingle(resourceName, fetch) {
    const isSingle = this.type === 'single';
    if (!isSingle && !this.id)
      throwError('CREATE_CHILD_MODEL_ERROR');
    const root = isSingle ? this.url : `${this.url}/${this.id}`;
    !isSingle && (this.id = null);
    return createModel({
      type: 'single',
      resource: resourceName,
      root
    }, fetch);
  }
  getAll(params) {
    return this.query(`${this.url}${transformSearch(params)}`);
  }
  get(params) {
    const url = this.checkIdAndComposeUrl();
    return this.query(`${url}${transformSearch(params)}`);
  }
  post(data) {
    return this.mutate('post', this.url, data);
  }
  put(data) {
    const url = this.checkIdAndComposeUrl();
    return this.mutate('put', url, data);
  }
  delete() {
    const url = this.checkIdAndComposeUrl();
    return this.mutate('delete', url);
  }
  checkIdAndComposeUrl() {
    if (!this.id)
      return `${this.url}`;
    return `${this.url}/${this.id}`;
  }
  query(url) {
    this.id = null;
    const fetch = this.fetch();
    return fetch(url, {headers})
    .then(this.handleResponse)
    .catch(this.handleBadResponse);
  }
  mutate(method, url, data) {
    this.id = null;
    const fetch = this.fetch();
    return fetch(url, {
      method,
      headers,
      body: JSON.stringify(data)
    })
    .then(this.handleResponse)
    .catch(this.handleBadResponse);
  }
  handleResponse(res) {
    if (res.status === 204)
      return
    if (res.status >= 200 && res.status < 300)
      return res.json();
    else
      throw res;
  }
  handleBadResponse(res) {
    return res.json().then(data => {
      notification.error({
        message: `错误代码：${res.status || '未知'}`,
        description: data.message || '未知错误信息',
      });
      return data;
    });
  }
}

export function createModel(options, fetch) {
  const {resource, root, type} = options;
  if (!resource || slashRegExp.test(resource))
    throwError('INVALID_RESOURCE_NAME_ERROR');
  if (typeof fetch !== 'undefined' && typeof fetch !== 'function')
    throwError('INVALID_FETCH_FUNCTION');
  return new Restful({
    url: `${root === '/' ? '' : root}/${resource}`,
    type
  }, fetch);
}

function transformSearch(params) {
  let result = [];
  for (let key in params) {
    let value = params[key];
    result.push(`${key}=${value}`);
  }
  return result.length ? '?' + result.join('&') : '';
}

function throwError(type, ...args) {
  switch (type) {
  case 'INVALID_RESOURCE_NAME_ERROR':
    throw new Error('invalid resource name when creating an instance of restful model');
  case 'INVALID_FETCH_FUNCTION':
    throw new Error('invalid fetch function');
  case 'UNDEFINED_URL_ERROR':
    throw new Error('undefined url argument when creating an instance of restful model');
  case 'SINGLE_TYPE_NO_METHOD_ERROR':
    throw new Error('this method is not avaliable to single type restful instance');
  case 'CREATE_CHILD_MODEL_ERROR':
    throw new Error('should execute `one` method before creating a child model from a normal-type restful instance');
  }
}
