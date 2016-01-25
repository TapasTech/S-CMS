import TYPE from '#/constants';
import initial from '#/store/initial';

export default (state = initial.productions, action) => {
  switch(action.type) {
    case TYPE.PRO.ALL:
      return {
        ...state,
        dataAll: action.payload.data
      }
    case TYPE.PRO.INDEX:
      return {
        ...state,
        data: action.payload.data
      }
    case TYPE.PRO.CREATE:
      let newData = [...state.data];
      newData.push(action.payload)
      return {
        ...state,
        data: newData
      }
    default:
      return state;
  }
}