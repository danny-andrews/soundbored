function() {
  var Provider = require('react-redux').Provider;
  var App = require('./App');

  return <Provider store={context.store}><App /></Provider>
}();
