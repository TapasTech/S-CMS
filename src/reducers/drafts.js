import TYPE from '#/constants';
import initial from '#/store/initial';

export default (state = initial.drafts, action) => {
  switch(action.type) {
    case TYPE.DRA.INDEX:
      return Object.assign({}, state, action.payload);
    case TYPE.DRA.CREATE:
    case TYPE.DRA.SHOW:
    case TYPE.DRA.UPDATE:
      return Object.assign({}, state, {
        current: action.payload,
      });
    default:
      return state;
  }
}
