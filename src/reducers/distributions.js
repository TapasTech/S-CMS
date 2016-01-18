import TYPE from '#/constants';
import initial from '#/store/initial';

export default (state = initial.distributions, action) => {
  switch(action.type) {
    case TYPE.DIS.INDEX:
      return {
        ...state,
        data: action.payload.data,
      }
    default:
      return state;
  }
}