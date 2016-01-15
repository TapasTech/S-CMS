import TYPE from '#/constants';
import { Restful } from '#/utils';

const ORG = Restful.collection('organizations');

export const index = () => dispatch => {
  ORG
  .get()
  .then(res => {
    let { data } = res;
    console.log(data)
    dispatch({
      type: TYPE.ORG.INDEX,
      payload: {
        data
      }
    })
  })
}

export const show = ({ id }) => dispatch => {
  ORG
  .model(id)
  .get()
  .then(res => dispatch({
    type: TYPE.ORG.SHOW,
    payload: {
      ...res.data
    }
  }))
}

export const create = ({ name, description }) => dispatch => {
  ORG
  .post({
    organization: {
      name,
      description
    }
  })
  .then(res => {
    let { data } = res;
    dispatch({
      type: TYPE.ORG.CREATE,
      payload: {
        data
      }
    })
  })
}

export const update = ({ id, name, description }) => dispatch => {
  ORG
  .model(id)
  .put({
    organization: {
      name,
      description
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