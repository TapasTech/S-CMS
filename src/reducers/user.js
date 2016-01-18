import TYPE from '#/constants';
import initial from '#/store/initial';

export default (state = initial.user, action) => {
  switch(action.type) {
    case TYPE.USER.CREATE:
    case TYPE.AUTH.CREATE:
      let { name, email } = action.payload;
      return {
        ...state,
        name,
        email,
      }
    default:
      return state;
  }
}