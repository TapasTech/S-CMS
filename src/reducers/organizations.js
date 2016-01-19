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
    case TYPE.ORG.SHOW:
      return {
        ...state,
        datum: action.payload.data,
      }
    case TYPE.ORG.UPDATE:
      return {
        ...state,
        data: state.data.map(e => e.id === action.payload.id ? action.payload : e),
        datum: action.payload
      }
    default:
      return state;
  }
}