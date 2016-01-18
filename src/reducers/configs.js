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
    default:
      return state;
  }
}