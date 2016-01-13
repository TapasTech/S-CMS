import TYPE from '../constants/WELCOME';

export const hello = name => dispatch => {
  setTimeout(() => {
    dispatch({
      type: TYPE.LOG,
      payload: {
        name
      }
    })
  }, 1000)
}