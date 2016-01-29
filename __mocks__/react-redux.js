import {
  connect as _connect,
  Provider,
} from '../node_modules/react-redux';

const connect = function (mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
  Object.assign(options, {withRef: true});
  return _connect(mapStateToProps, mapDispatchToProps, mergeProps, options);
};

module.exports = {
  connect,
  Provider,
};
