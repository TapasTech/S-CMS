import TYPE from '#/constants';
import { Restful, params } from '#/utils';


export const allArticles = ({
  orgId,
  productId,
} = params.path()) => dispatch => {
  dispatch({
    type: TYPE.LIB.INTERNAL_ARTICLES_FETCHING
  })
  const categories = Restful.collection('organizations').model(orgId).collection('products').model(productId).collection('categories');
  return categories
  .get()
  .then(res => {
    const categoryIds = res.data.map(category => category.id);
    const allArticles = categoryIds.map(id => categories.model(id).collection('articles').get().then(res => res.data));
    return Promise.all(allArticles)
    .then(res => {
      return res.reduce((prev, curr) => Array.concat(prev, curr), []);
    });
  })
  .then(articlesList => {
    return dispatch({
      type: TYPE.LIB.INTERNAL_ARTICLES_FETCHED,
      payload: articlesList
    })
  })
  .catch(err => {
    return dispatch({
      type: TYPE.LIB.INTERNAL_ARTICLES_FETCH_FAILED
    })
  });
}
