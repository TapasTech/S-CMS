import TYPE from '#/constants/WELCOME';

export default function(state = {}, action) {
  switch(action.type) {
    case TYPE.LOG:
      return { 
        name: action.payload.name
      }
    default:
      return state;
  }
}