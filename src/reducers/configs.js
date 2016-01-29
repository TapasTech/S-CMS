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
    };
  case TYPE.CFG.DRA.SHOW:
    return {
      ...state,
      fields: {
        data: action.payload.fieldConfigs
      }
    };
  case TYPE.CFG.DRA.CREATE:
    return {
      ...state,
      drafts: {
        data: [].concat([...state.drafts.data], [action.payload])
      }
    };
  case TYPE.CFG.FLD.CREATE:
    return {
      ...state,
      fields: {
        data: [].concat([...state.fields.data], [action.payload])
      }
    };
  case TYPE.CFG.FLD.UPDATE:
    return {
      ...state,
      fields: {
        data: state.fields.data.map(e => e.id === action.payload.id ? action.payload : e)
      }
    };
  default:
    return state;
  }
};
