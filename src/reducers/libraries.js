import TYPE from '#/constants';
import initial from '#/store/initial';

export default(state = initial.libraries, action) => {
  switch (action.type) {
    case TYPE.LIB.INTERNAL_ARTICLES_FETCHING:
      return {
        ...state,
        internal: {
          articles: {
            ...state.internal.articles,
            '@status': 'pending'
          }
        }
      };
    case TYPE.LIB.INTERNAL_ARTICLES_FETCHED:
      return {
        ...state,
        internal: {
          articles: {
            data: action.payload,
            '@status': 'saved'
          }
        }
      };
    case TYPE.LIB.INTERNAL_ARTICLES_FETCH_FAILED:
      return {
        ...state,
        internal: {
          articles: {
            ...state.internal.articles,
            '@status': 'failed'
          }
        }
      }
    default:
      return state;
  };
}
