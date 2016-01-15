import store from '#/store';

export const path = (key) => store.getState().router.params[key];
export const query = (key) => store.getState().router.location.query[key];
