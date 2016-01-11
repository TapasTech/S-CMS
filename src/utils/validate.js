export default ({name, value}) => {
  switch (name) {
    case 'username':
      return (value.length > 2);
      break;
    case 'email':
      return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
      break;
    case 'password':
      return (value.length > 5);
      break;
    default:
      console.log('no rules for this');
  }
}