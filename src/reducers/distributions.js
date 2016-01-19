import TYPE from '#/constants';
import initial from '#/store/initial';

export default (state = initial.distributions, action) => {
  switch(action.type) {
    case TYPE.DIS.INDEX:
      return {
        ...state,
        data: action.payload.data,
      }
    case TYPE.DIS.CREATE:
      return {
        ...state,
        data: [].concat(state.data, action.payload)
      }
    case TYPE.DIS.UPDATE:
      return {
        ...state,
        data: state.data.map(e => e.id === action.payload.id ? action.payload : e)
      }
    default:
      return state;
  }
}