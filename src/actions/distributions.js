import TYPE from '#/constants';
import { Restful, params } from '#/utils';

export const index = ({ 
  orgId = params.path('orgId'), 
  productId = params.path('productId')
}) => dispatch => {
  const DIS = Restful
  .collection('organizations').model(orgId)
  .collection('products').model(productId)
  .collection('categories');

  DIS
  .get()
  .then(res => {
    let { data } = res;
    dispatch({
      type: TYPE.DIS.INDEX,
      payload: {
        data
      }
    })
  })

}

export const create = ({ 
  orgId = params.path('orgId'), 
  productId = params.path('productId'),
  ...args
}) => dispatch => {
  const DIS = Restful
  .collection('organizations').model(orgId)
  .collection('products').model(productId)
  .collection('categories');

  DIS
  .post({
    category: {
      ...args
    }
  })
  .then(res => {
    dispatch({
      type: TYPE.DIS.CREATE,
      payload: {
        ...res.data
      }
    })
  })

}