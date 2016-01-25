import TYPE from '#/constants';
import { Restful, params } from '#/utils';

const ORG = Restful.collection('organizations');

export const index = ({ orgId = params.path('orgId') }) => dispatch => {
  ORG
  .model(orgId)
  .collection(`users`)
  .get()
  .then(res => {
    dispatch({
      type: TYPE.MEM.INDEX,
      payload: {
        data: res.data
      }
    })
  })
}

export const invite = ({
  orgId = params.path('orgId'),
  email,
  role = 'member'
}) => dispatch => {
  return ORG
  .model(orgId)
  .collection(`users`)
  .resource(`_invite`)
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
    })
    return res
  })
}

export const update = ({
  orgId = params.path('orgId'),
  id,
  role,
}) => dispatch => {
  ORG
  .model(orgId)
  .collection(`user`)
  .model(id)
  .collection(`role`)
  .post({
    ...args
  })
  .then( res => {
    dispatch({
      type: TYPE.MEM.UPDATE,
      payload: {
        ...res.data
      }
    })
  })
}

export const remove = ({
  orgId = params.path('orgId'),
  id,
}) => dispatch => {
  // todo
}
