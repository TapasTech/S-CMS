import TYPE from '#/constants';
import { Restful } from '#/utils';

const ORG = Restful.collection('organizations');

export const index = () => dispatch => {
  return ORG
  .get()
  .then(res => {
    let { data } = res;
    dispatch({
      type: TYPE.ORG.INDEX,
      payload: {
        data
      }
    })
    return data;
  })
}

export const show = ({ id }) => dispatch => {
  ORG
  .model(id)
  .get()
  .then(res => {
    let { data } = res;
    dispatch({
      type: TYPE.ORG.SHOW,
      payload: {
        data
      }
    })
  })
}

export const create = ({ name, description }) => dispatch => {
  return ORG
  .post({
    organization: {
      name,
      description
    }
  })
  .then(res => {
    dispatch({
      type: TYPE.ORG.CREATE,
      payload: {
        ...res.data
      }
    });
    const orgId = res.data.id;
    return orgId;
  })
}

export const update = ({ id, ...args }) => dispatch => {
  ORG
  .model(id)
  .put({
    organization: {
      ...args
    }
  })
  .then(res => {
    dispatch({
      type: TYPE.ORG.UPDATE,
      payload: {
        ...res.data
      }
    })
  })
}

export const destroy = ({ id }) => dispatch => {
  // todo
}