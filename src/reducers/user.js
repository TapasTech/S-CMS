import TYPE from '#/constants';
import initial from '#/store/initial';

export default (state = initial.user, action) => {
  switch(action.type) {
    case TYPE.USER.CREATE:
    case TYPE.AUTH.CREATE:
      return {
        ...state,
        ...action.payload
      }
    case TYPE.USER.SHOW:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
}