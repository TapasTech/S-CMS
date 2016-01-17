import TYPE from '#/constants';
import { Restful, params } from '#/utils';

function getDrafts(orgId, productId, draftTypeId) {
  const product = Restful
  .collection('organizations').model(orgId)
  .collection('products').model(productId);
  return draftTypeId
  ? product.collection('dynamic_field_configs').model(draftTypeId).collection('drafts')
  : product.collection('drafts');
}

export const index = ({
  orgId = params.path('orgId'),
  productId = params.path('productId'),
  draftTypeId = params.path('draftTypeId')
}) => dispatch => {
  const DRA = getDrafts(orgId, productId, draftTypeId);

  DRA
  .get()
  .then(res => {
    let { data } = res;
    dispatch({
      type: TYPE.DRA.INDEX,
      payload: {
        data
      }
    })
  })

}

export const create = ({
  orgId = params.path('orgId'),
  productId = params.path('productId'),
  draftTypeId = params.path('draftTypeId'),
  ...arg
}) => dispatch => {
  const DRA = getDrafts(orgId, productId, draftTypeId);

  DRA
  .post({
    draft: {
      dynamic_field_collection: {
        ...arg
      }
    }
  })
  .then(res => {
    dispatch({
      type: TYPE.DRA.CREATE,
      payload: {
        ...res.data
      }
    })
  })

}

export const show = ({
  orgId = params.path('orgId'),
  productId = params.path('productId'),
  draftTypeId = params.path('draftTypeId'),
  id
}) => dispatch => {
  const DRA = getDrafts(orgId, productId, draftTypeId);

  DRA
  .model(id)
  .get()
  .then(res => {
    dispatch({
      type: TYPE.DRA.SHOW,
      payload: {
        ...res.data.dynamicFieldCollection
      }
    })
  })

}

export const update = ({
  orgId = params.path('orgId'),
  productId = params.path('productId'),
  draftTypeId = params.path('draftTypeId'),
  id,
  ...arg
}) => dispatch => {
  const DRA = getDrafts(orgId, productId, draftTypeId);

  DRA
  .model(id)
  .put({
    draft: {
      dynamic_field_collection: {
        ...arg
      }
    }
  })
  .then(res => {
    dispatch({
      type: TYPE.DRA.UPDATE,
      payload: {
        ...res.data
      }
    })
  })

}

export const destroy = ({
  orgId = params.path('orgId'),
  productId = params.path('productId'),
  draftTypeId = params.path('draftTypeId'),
  id,
}) => dispatch => {
  const DRA = getDrafts(orgId, productId, draftTypeId);

  // todo

}
