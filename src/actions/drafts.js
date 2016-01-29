import TYPE from '#/constants';
import { Restful, params } from '#/utils';

export const index = actionCreator(
  (DRA, dispatch) => DRA.get()
  .then(res => {
    let { data } = res;
    dispatch({
      type: TYPE.DRA.INDEX,
      payload: {
        data
      }
    });
  })
);

export const create = actionCreator(
  (DRA, dispatch, args) => DRA
  .post({
    draft: {
      dynamic_field_collection: args.dynamicFieldCollection
    }
  })
  .then(res => {
    dispatch({
      type: TYPE.DRA.CREATE,
      payload: {
        ...res.data
      }
    });
  })
);

export const show = actionCreator(
  (DRA, dispatch, args) => DRA
  .model(args.id)
  .get()
  .then(res => {
    dispatch({
      type: TYPE.DRA.SHOW,
      payload: {
        ...res.data
      }
    });
  })
);

export const update = actionCreator((DRA, dispatch, args) => {
  const {id, ...data} = args;
  return DRA
  .model(id)
  .put({
    draft: {
      dynamic_field_collection: data.dynamicFieldCollection,
    }
  })
  .then(res => {
    dispatch({
      type: TYPE.DRA.UPDATE,
      payload: {
        ...res.data
      }
    });
  });
});

export const destroy = actionCreator(
  (DRA, dispatch, args) => DRA
  .model(args.id)
  .delete()
  .then(() => {
    dispatch({
      type: TYPE.DRA.DESTROY,
      payload: {
        id: args.id
      }
    });
  })
);

export const publish = actionCreator(
  (DRA, dispatch, args) => DRA
  .model(args.id)
  .resource('_publish')
  .post({
    category_id: args.categoryId,
  })
  /*.then(res => {
    dispatch({
      type: TYPE.DRA.PUBLISH,
      payload: {
        id: args.id
      }
    });
  })*/
);

export const clear = () => ({
  type: TYPE.DRA.SHOW,
  payload: {
    dynamicFieldCollection: {},
  },
});

function actionCreator(factory) {
  return ({
    orgId = params.path('orgId'),
    productId = params.path('productId'),
    draftTypeId = params.path('draftTypeId'),
    ...args
  }) => dispatch => {
    const product = Restful
    .collection('organizations').model(orgId)
    .collection('products').model(productId);
    const DRA = draftTypeId
      ? product.collection('dynamic_field_configs').model(draftTypeId).collection('drafts')
      : product.collection('drafts');
    return factory(DRA, dispatch, args);
  };
}
