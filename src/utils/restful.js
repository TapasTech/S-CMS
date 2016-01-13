import {notification} from 'tapas-ui';
import fetch from 'isomorphic-fetch';

const headers = {
 'Accept': 'application/json',
 'Content-Type': 'application/json',
 'Http-Authorization': 'eyJ1c2VyX2lkIjoiNTY5NDdiZGM1ZTk4YmUxNzBjMDAwMDAwIiwiZXhwaXJlc19hdCI6IjIwMTYtMDEtMjBUMTE6MTQ6NDguNzQxKzA4OjAwIiwicGFzc3dvcmRfZGlnZXN0IjoiJDJhJDEwJEouT0VHVkNTbTBtVHlpNmRFNGMwQ09HTTQ4OXpSVlJ0WDNWSmkxbXU1ODNhTE5JcUgzYXRhIn0=--5f9217095e084eb19155b20bba80b12ac17e6922'
};

const ROOT = '/backend';

export class Restful {
  static create(...args) {
    const {fetch, url} = handleArgs(...args);
    if (!url)
      throwError('UNDEFINED_URL_ERROR');
    let defaultRestful = new Restful(`${url}s`, fetch);
    defaultRestful.type = 'normal';
    return defaultRestful;
  }
  static createSingle(...args) {
    const {fetch, url} = handleArgs(...args);
    if (!url)
      throwError('UNDEFINED_URL_ERROR');
    let singleRestful = new Restful(url, fetch);
    singleRestful.type = 'single';
    return singleRestful;
  }
  // 把fetch方法设计成可以从外部注入，以方便测试
  // 在正常使用时，不需要传入`myFetch`参数
  constructor(url, myFetch = fetch) {
    this.url = url;
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
  create(...args) {
    return Restful.create(this.url, ...args);
  }
  createSingle(...args) {
    return Restful.createSingle(this.url, ...args);
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
    return fetch(this.prefixRoot(url), {headers})
    .then(this.handleResponse)
    .catch(this.handleBadResponse);
  }
  mutate(method, url, data) {
    this.id = null;
    const fetch = this.fetch();
    return fetch(this.prefixRoot(url), {
      method,
      headers,
      body: JSON.stringify(data)
    })
    .then(this.handleResponse)
    .catch(this.handleBadResponse);
  }
  prefixRoot(url) {
    return `${ROOT}/${url}`;
  }
  handleResponse(res) {
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

function handleArgs(...args) {
  let fetch, url;
  if (typeof args[args.length -1] === 'function') {
    fetch = args[args.length -1];
    url = args.slice(0, -1).join('/');
    return {fetch, url};
  }
  return {
    url: args.join('/')
  };
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
  case 'UNDEFINED_URL_ERROR':
    throw new Error('undefined url argument when creating an instance of restful model');
  case 'SINGLE_TYPE_NO_METHOD_ERROR':
    throw new Error('this method is not avaliable to single type restful instance');
  }
}
