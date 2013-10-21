'use strict';
var routers = require('./routers/index')
  , Backbone = require('./backbone/backbone-modified')
  ;

var startApp = function (backBoneOptions) {

  backBoneOptions = backBoneOptions || {};

  // create view from menu to enable correct push state handling of links
  var menu = new Backbone.AnywhereView({el: global.$('.layout.fixed')[0]});
  // register routers
  for (var i in routers) {
    var dummy = new routers[i]();
  }

  if (global.ONSERVER) {
    return;
  }
  // start listening for path changes
  backBoneOptions.pushState = true;
  Backbone.history.start(backBoneOptions);
}

module.exports = startApp;