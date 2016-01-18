import fetch from 'isomorphic-fetch';
import snakeCase from 'lodash/string/snakeCase';
import camelCase from 'lodash/string/camelCase';
import forEach from 'lodash/collection/forEach';
import isObject from 'lodash/lang/isObject';
import {notification} from 'tapas-ui';

export const itemStatus = {
    pending: 'pending',
    saved: 'saved',
    failed: 'failed'
};

let myHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Http-Authorization': 'eyJ1c2VyX2lkIjoiNTY5NWVlNzA1ZTk4YmU2NWJhMDAwMDExIiwiZXhwaXJlc19hdCI6IjIwMTYtMDEtMjBUMTQ6MzE6MjcuMzk0KzA4OjAwIiwicGFzc3dvcmRfZGlnZXN0IjoiJDJhJDEwJGVEcFlQRGp5QVRIYjBqSEoyR1RXSS5KS1hwaDREQ0JRdUdZcTJneXYxODVQb2suUzFiZmJXIn0=--e1f0ab7c5423e13e6e3225cf3e67796a19af115f'
}
let myRoot = '/api';

export const config = ({headers, root}) => {
  myHeaders = headers;
  myRoot = root;
}

function camelCase2SnakeCase(obj) {
  let result = {};
  if (Array.isArray(obj))
    result = [];
  forEach(obj, (value, name) => {
    result[snakeCase(name)] = isObject(value) ? camelCase2SnakeCase(value) : value;
  });
  return result;
}

function snakeCase2CamelCase(obj) {
  let result = {};
  if (Array.isArray(obj))
    result = [];
  forEach(obj, (value, name) => {
    result[camelCase(name)] = isObject(value) ? snakeCase2CamelCase(value) : value;
  });
  return result;
}

function request(method, url, data) {
  let config = {
    method,
    headers: myHeaders,
  };
  if (data)
    config.body = JSON.stringify(data);
  return fetch(url, config)
  .then(handleResponse)
  .catch(handleBadResponse);
}

function handleResponse(res) {
  if (res.status === 204)
    return {
      res: {}
    };
  if (res.status >= 200 && res.status < 300)
    return res.json().then(data => {
      return {
        res: snakeCase2CamelCase(data)
      };
    });
  else
    throw res;
}

function handleBadResponse(res) {
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


export class EndPoint {
  constructor(url) {
    this.url = url;
  }

  _generateUrl(params) {
    if (typeof this.url === 'function') {
      return myRoot + this.url(params);
    }
    if (params != undefined || params != {}) throw 'Endpoint url is not a function, don\'t give params';
    return myRoot + this.url;
  }

  list(params) {
    const url = this._generateUrl(arguments[1]);
    return request('get', `${url}${handleQueryString(params)}`);
  }

  retrieve(id) {
    const url = this._generateUrl(arguments[1]);
    return request('get', `${url}/${id}`);
  }

  create(data) {
    const url = this._generateUrl(arguments[1]);
    return request('post', `${url}`, camelCase2SnakeCase(data));
  }

  update(data, id) {
    const url = this._generateUrl(arguments[2]);
    return request('put', `${url}/${id}`, camelCase2SnakeCase(data));
  }

  delete(id) {
    const url = this._generateUrl(arguments[1]);
    return request('delete', `${url}/${id}`);
  }

}

export class ActionTypes {
  constructor(endpointName) {
    this.endpointName = endpointName;
    ['list', 'retrieve', 'create', 'update', 'delete'].forEach(action => {
      this[`${action}`] = this.getConstant(action);
      ['success', 'failure'].forEach(result => {
        this[`${action}_${result}`] = this.getConstant(action, result);
      });
    });
  }

  getConstant(action, result) {
    let constant = `${this.endpointName}_${action}`;
    if (result) {
      constant = `${constant}_${result}`;
    }
    return constant;
  }
}

export class ActionCreators {
  constructor(endpointName, API, actionTypes) {
    this.actionTypes = actionTypes;
    this._pendingID = 0;
    ['list', 'retrieve', 'create', 'update', 'delete'].forEach(action => {
      this[action] = this._createAction.bind(this, action, API[action].bind(API));
    });
  }

  _createAction(action, apiRequest, payload, objectID) {
    return (dispatch) => {
      let pendingID = this._getPendingID();
      let call = apiRequest(payload, objectID)
          .then(({err, res}) => {
            if (err) {
              return dispatch(this._failure(action, 'error', pendingID));
            } else {
              return dispatch(this._success(action, res, pendingID));
            }
          });
      dispatch(this._pending(action, payload, pendingID));
      return call;
    };
  }

  _success(...args) {
    return this._makeActionObject(...args, 'success');
  }

  _failure(...args) {
    return this._makeActionObject(...args, 'failure');
  }

  _pending(...args) {
    return this._makeActionObject(...args);
  }

  _makeActionObject(action, payload, pendingID, result) {
    let actionType = this.actionTypes.getConstant(action, result);
    return {
      type: actionType,
      payload: payload,
      pendingID: pendingID
    };
  }

  _getPendingID() {
    this._pendingID += 1;
    return this._pendingID;
  }
}


class BaseReducer {
  constructor(actionTypes) {
    this.actionTypes = actionTypes;
  }

  getReducer() {
    return this._reducer.bind(this);
  }

  _getItem(state, key, value) {
    return state.find(item => item[key] === value);
  }

  _replaceItem(state, key, value, newItem) {
    let index = state.findIndex(item => item[key] === value);
    let newState = [...state];
    newState.splice(index, 1, newItem);
    return newState;
  }

  _getIndex(state, key, value) {
    return state.findIndex(item => item[key] === value);
  }

  _deleteItem(state, key, value) {
    const index = this._getIndex(state, key, value);
    state.splice(index,1);
    if(i >= 0) return [...state];
  }
}

export class ItemReducer extends BaseReducer {

  _reducer(state = {}, action) {
    let item;
    switch(action.type) {
      case this.actionTypes.create:
        item = {...action.payload, '@status': itemStatus.pending, '@pendingID': action.pendingID};
        return item;
      case this.actionTypes.create_success:
        item = {...action.payload, '@status': itemStatus.saved};
        return item;
      case this.actionTypes.create_failure:
        item = {...action.payload, '@status': itemStatus.failed};
        return item;
      case this.actionTypes.update:
        item = {...action.payload, '@status': itemStatus.pending, '@pendingID': action.pendingID};
        // TODO shouldn't hardcode 'id' field
        return item;
      case this.actionTypes.update_success:
        item = {...action.payload, '@status': itemStatus.saved};
        // TODO shouldn't hardcode 'id' field
        return item;
      case this.actionTypes.update_failure:
        item = {...action.payload, '@status': itemStatus.failed};
        // TODO shouldn't hardcode 'id' field
        return item;
      case this.actionTypes.delete:
        item = {...action.payload, '@status': itemStatus.pending, '@pendingID': action.pendingID};
        return item;
      case this.actionTypes.delete_success:
        item = {...action.payload, '@status': itemStatus.saved};
        return item;
      case this.actionTypes.delete_failure:
        item = {...action.payload, '@status': itemStatus.failed};
        return item;
      case this.actionTypes.retrieve:
        item = {...action.payload, '@status': itemStatus.pending, '@pendingID': action.pendingID};
        return item;
      case this.actionTypes.retrieve_success:
        item = {...action.payload, '@status': itemStatus.saved};
        return item;
      case this.actionTypes.retrieve_failure:
        item = {...action.payload, '@status': itemStatus.failed};
        return item;
      default:
        return state;
    }
  }
}

export class CollectionReducer extends BaseReducer {

  _reducer(state = {}, action) {
    let item;
    switch (action.type) {
      case this.actionTypes.list:
        item = {...action.payload, '@status': itemStatus.pending, '@pendingID': action.pendingID};
        return item;
      case this.actionTypes.list_success:
        item = {...action.payload, '@status': itemStatus.saved};
        return item;
      case this.actionTypes.list_failure:
        item = {...action.payload, '@status': itemStatus.failed};
        return item;
      default:
        return state;
    }
  }
}

export default class Flux {
  constructor(api) {
    self = this;
    this.API = {};
    this.actionTypes = {};
    this.actionCreators = {};
    this.reducers = {};
    Object.keys(api).forEach(endpointName => {
      const url = api[endpointName];
      self.API[endpointName] = new EndPoint(url);
      self.actionTypes[endpointName] = new ActionTypes(endpointName);
      self.actionCreators[endpointName] = new ActionCreators(endpointName, self.API[endpointName], self.actionTypes[endpointName]);
      self.reducers[`${endpointName}_item`] = new ItemReducer(self.actionTypes[endpointName]).getReducer();
      self.reducers[`${endpointName}_collection`] = new CollectionReducer(self.actionTypes[endpointName]).getReducer();
    })
  }
}
