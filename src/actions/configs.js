import TYPE from '#/constants';
import { Restful, params } from '#/utils';

export const drafts = {

  index: ({
    orgId = params.path('orgId'),
    productId = params.path('productId')
  }) => dispatch => {

    const CFG = Restful.collection(`organizations`)
    .model(orgId)
    .collection(`products`)
    .model(productId)
    .collection('dynamic_field_configs');

    CFG
    .get()
    .then(res => {
      let { data } = res;
      dispatch({
        type: TYPE.CFG.DRA.INDEX,
        payload: {
          data
        }
      })
    })
  },

  create: ({
    orgId = params.path('orgId'),
    productId = params.path('productId'),
    name
  }) => dispatch => {

    const CFG = Restful.collection(`organizations`)
    .model(orgId)
    .collection(`products`)
    .model(productId)
    .collection('dynamic_field_configs');

    CFG
    .post({
      dynamic_field_config: {
        name
      }
    })
    .then(res => {
      dispatch({
        type: TYPE.CFG.DRA.CREATE,
        payload: {
          ...res.data
        }
      })
    })

  },

  show: ({
    orgId = params.path('orgId'),
    productId = params.path('productId'),
    id
  }) => dispatch => {
    const CFG = Restful.collection(`organizations`)
    .model(orgId)
    .collection(`products`)
    .model(productId)
    .collection('dynamic_field_configs');

    CFG
    .model(id)
    .get()
    .then(res => {
      dispatch({
        type: TYPE.CFG.DRA.SHOW,
        payload: {
          ...res.data
        }
      })
    })
  },

  update: ({
    orgId = params.path('orgId'),
    productId = params.path('productId'),
    id,
    ...arg
  }) => dispatch => {
    const CFG = Restful.collection(`organizations`)
    .model(orgId)
    .collection(`products`)
    .model(productId)
    .collection('dynamic_field_configs');

    CFG
    .model(id)
    .put({
      dynamic_field_config: {
        ...arg
      }
    })
    .then(res => {
      dispatch({
        type: TYPE.CFG.DRA.SHOW,
        payload: {
          ...res.data
        }
      })
    })

  },

  destroy: ({
    orgId = params.path('orgId'),
    productId = params.path('productId')
  }) => dispatch => {
    // todo
  }

}
