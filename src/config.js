import { Restful } from './utils';

Restful.config({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Http-Authorization': localStorage.getItem('__AUTH')
  }
});
