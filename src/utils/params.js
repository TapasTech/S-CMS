import store from '#/store';

export const path = (key) => key ? store.getState().router.params[key] : store.getState().router.params;
export const query = (key) => key ? store.getState().router.location.query[key] : store.getState().router.location.query;
