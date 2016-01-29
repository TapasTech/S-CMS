import TYPE from '#/constants';
import initial from '#/store/initial';

export default (state = initial.members, action) => {
  switch(action.type) {
  case TYPE.MEM.INDEX:
    return {
      ...state,
      data: action.payload.data
    };
  case TYPE.MEM.UPDATE:
  case TYPE.MEM.INVITE:
  case TYPE.MEM.REMOVE:
  default:
    return state;
  }
};
