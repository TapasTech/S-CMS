import TYPE from '#/constants';
import initial from '#/store/initial';

export default (state = initial.organizations, action) => {
  switch(action.type) {
    case TYPE.ORG.CREATE:
    case TYPE.ORG.INDEX:
      return {
        ...state,
        data: action.payload.data,
      }
    default:
      return state;
  }
}