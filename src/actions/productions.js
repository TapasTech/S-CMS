import TYPE from '#/constants';
import { Restful, params } from '#/utils';

export const all = () => dispatch => {
  const ORG = Restful.collection('organizations');
  ORG
  .get()
  .then(res => {
    Promise.all(
      res.data.map(e => Restful
        .collection('organizations').model(e.id)
        .collection('products').get()
      )
    )
    .then(responds => dispatch({
      type: TYPE.PRO.INDEX,
      payload: {
        data: responds.map((e, i) => ({
          id: res.data[i].id,
          name: res.data[i].name,
          list: e.data
        }))
      }
    }))
  })
}

export const index = ({ orgId = params.path('orgId') }) => dispatch => {
  const PRO = Restful.collection('organizations').model(orgId).collection('products');

  PRO
  .get()
  .then(res => {
    let { data } = res;
    dispatch({
      type: TYPE.PRO.INDEX,
      payload: {
        data
      }
    })
  })

}

export const show = ({ orgId = params.path('orgId'), id }) => dispatch => {
  const PRO = Restful.collection('organizations').model(orgId).collection('products');

  PRO
  .model(id)
  .get()
  .then(res => {
    dispatch({
      type: TYPE.PRO.SHOW,
      payload: {
        ...res.data
      }
    })
  })
}

export const create = ({ orgId = params.path('orgId'), name, description }) => dispatch => {
  const PRO = Restful.collection('organizations').model(orgId).collection('products');

  PRO
  .post({
    product: {
      name,
      description
    }
  })
  .then(res => {
    dispatch({
      type: TYPE.PRO.CREATE,
      payload: {
        ...res.data
      }
    })
  })

}

export const update = ({ orgId = params.path('orgId'), id, name, description }) => dispatch => {
  const PRO = Restful.collection('organizations').model(orgId).collection('products');

  PRO
  .model(id)
  .put({
    product: {
      name,
      description
    }
  })
  .then(res => {
    dispatch({
      type: TYPE.PRO.UPDATE,
      payload: {
        ...res.data
      }
    })
  })
}

export const destroy = ({ orgId, id }) => dispatch => {
  // todo
}