import TYPE from '#/constants';
import initial from '#/store/initial';

export default (state = initial.drafts, action) => {
  switch(action.type) {
    case TYPE.DRA.INDEX:
    default:
      return state;
  }
}