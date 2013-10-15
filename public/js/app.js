var routers = require('./routers/index');
var Backbone = require('./backbone-modified');

var startApp = function (backBoneOptions) {

  backBoneOptions = backBoneOptions || {};

  // create view from menu to enable correct push state handling of links
  var menu = new Backbone.AnywhereView({el: $('.layout.fixed')[0]});
  // register routers
  for (var i in routers) {
    new routers[i]();
  }

  if (ONSERVER) {
    return;
  }
  // start listening for path changes
  backBoneOptions.pushState = true;
  Backbone.history.start(backBoneOptions);
}

module.exports = startApp;