import TYPE from '#/constants';
import initial from '#/store/initial';

export default (state = initial.productions, action) => {
  switch(action.type) {
    case TYPE.PRO.INDEX:
      return {
        ...state,
        data: action.payload.data,
      }
    default:
      return state;
  }
}