import { pushState } from 'redux-router';

import TYPE from '#/constants';
import { Restful } from '#/utils';

const USER = Restful.collection('user');
const AUTH = Restful.collection('authentications');

export const register = ({ name, email, password }) => dispatch => {
  USER.post({
    user: {
      name,
      email,
      password
    }
  })
  .then(res => {
    localStorage.setItem('__AUTH', res.data.authToken);
    Restful.config({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Http-Authorization': localStorage.getItem('__AUTH') || ''
      }
    });
    dispatch([{
      type: TYPE.USER.CREATE,
      payload: {
        ...res.data
      }
    }, pushState(null, '/create')]);
  })
}

export const login = ({ email, password }) => dispatch => {
  AUTH.post({
    user: {
      email,
      password
    }
  })
  .then(res => {
    localStorage.setItem('__AUTH', res.data.authToken);
    Restful.config({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Http-Authorization': localStorage.getItem('__AUTH') || ''
      }
    });
    dispatch([{
      type: TYPE.AUTH.CREATE,
      payload: {
        ...res.data
      }
    }, pushState(null, '/dashboard')])
  })
}
