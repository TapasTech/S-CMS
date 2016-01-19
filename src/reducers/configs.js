import TYPE from '#/constants';
import initial from '#/store/initial';

export default (state = initial.configs, action) => {
  switch(action.type) {
    case TYPE.CFG.DRA.INDEX:
      return {
        ...state,
        drafts: {
          data: action.payload.data
        }
      }
    case TYPE.CFG.DRA.CREATE:
      let newData = [...state.drafts.data];
      newData.push(action.payload)
      return {
        ...state,
        drafts: {
          data: newData
        }
      }
    default:
      return state;
  }
}
