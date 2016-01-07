const tapasUi = {};

const notification = {};

['success', 'error', 'info', 'warn', 'open', 'close'].forEach(type => {
  notification[type] = function () {};
});

Object.assign(tapasUi, {
  notification
});

module.exports = tapasUi;
