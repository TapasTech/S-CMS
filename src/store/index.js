import reducers from '#/reducers/index';
import initialState from './initial';

const createStore = process.env.NODE_ENV === 'production' ? require('./production') : require('./development');
const store = createStore(reducers, initialState);

if (module.hot) {
  module.hot.accept('#/reducers', () => {
    const nextRootReducer = require('#/reducers/index');
    store.replaceReducer(nextRootReducer);
  });
}

export default store;


