import TYPE from '#/constants';
import { Restful, params } from '#/utils';

const ORG = Restful.collection('organizations');

export const index = ({ orgId = params.path('orgId') }) => dispatch => {
  return ORG
  .model(orgId)
  .collection(`users`)
  .get()
  .then(res => {
    dispatch({
      type: TYPE.MEM.INDEX,
      payload: {
        data: res.data
      }
    });
    return res.data;
  });
};

export const invite = ({
  orgId = params.path('orgId'),
  email,
  role = 'member'
}) => dispatch => {
  return Restful
  .fetch(`organizations/${orgId}/users/_invite`)
  .post({
    email,
    role
  })
  .then( res => {
    dispatch({
      type: TYPE.MEM.INVITE,
      payload: {
        ...res.data
      }
    });
    return res;
  });
};

export const update = ({
  orgId = params.path('orgId'),
  id,
  role,
}) => dispatch => {
  return Restful
    .fetch(`organizations/${orgId}/users/${id}/role`)
    .put({
      id,
      role
    })
  .then( res => {
    dispatch({
      type: TYPE.MEM.UPDATE,
      payload: {
        ...res.data
      }
    });
    return res;
  });
};

export const remove = ({
  orgId = params.path('orgId'),
  id,
}) => dispatch => {
  // todo
};
