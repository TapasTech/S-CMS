import TYPE from '#/constants';
import { Restful, params } from '#/utils';

export const index = ({ 
  orgId = params.path('orgId'), 
  productId = params.path('productId'), 
  draftTypeId = params.path('draftTypeId') 
}) => dispatch => {
  const DRA = Restful
  .collection('organizations').model(orgId)
  .collection('products').model(productId)
  .collection('dynamic_field_configs').model(draftTypeId)
  .collection('drafts');

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
  const DRA = Restful
  .collection('organizations').model(orgId)
  .collection('products').model(productId)
  .collection('dynamic_field_configs').model(draftTypeId)
  .collection('drafts');

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
      type: TYPE.DRA.INDEX,
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
  const DRA = Restful
  .collection('organizations').model(orgId)
  .collection('products').model(productId)
  .collection('dynamic_field_configs').model(draftTypeId)
  .collection('drafts');

  DRA
  .model(id)
  .get()
  .then(res => {
    dispatch({
      type: TYPE.DRA.SHOW,
      payload: {
        ...res.data
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
  const DRA = Restful
  .collection('organizations').model(orgId)
  .collection('products').model(productId)
  .collection('dynamic_field_configs').model(draftTypeId)
  .collection('drafts');

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
  const DRA = Restful
  .collection('organizations').model(orgId)
  .collection('products').model(productId)
  .collection('dynamic_field_configs').model(draftTypeId)
  .collection('drafts');

  // todo

}
