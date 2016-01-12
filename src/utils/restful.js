import {notification} from 'tapas-ui';
import fetch from 'isomorphic-fetch';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

const ROOT = '/backend';

export class Restful {
  static create(...args) {
    return new Restful(...args);
  }
  // 把fetch方法设计成可以从外部注入，以方便测试
  // 在正常使用时，不需要传入`myFetch`参数
  constructor(name, myFetch = fetch) {
    if (!name)
      this.throwError('undefinedNameError');
    this.url = `${name}s`;
    this.fetch = function () {
      return myFetch;
    };
  }
  one(id) {
    this.id = id;
    return this;
  }
  create(parentId, name) {
    return new Restful(`${this.url}/${parentId}/${name}`);
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
      this.throwError('undefinedIdError')
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
  throwError(type) {
    switch (type) {
    case 'undefinedNameError':
      throw new Error('undefined name argument when creating an instance of restful model');
    case 'undefinedIdError':
      throw new Error('id is undefined of current restful instance');
    }
  }
}

function transformSearch(params) {
  let result = [];
  for (let key in params) {
    let value = params[key];
    result.push(`${key}=${value}`);
  }
  return result.length ? '?' + result.join('&') : '';
}
