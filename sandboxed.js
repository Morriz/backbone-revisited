ONSERVER = true;
ONCLIENT = !ONSERVER;
console.log(layout);
$ = jQuery = cheerio.load(layout);

var Backbone = require(ROOT + 'backbone-modified')
  , myapp = require(ROOT + 'app')
  ;
// modify the Backbone sync method to use redis
Backbone.sync = require(LIB + 'backbone-store-sync.js');

// start the routers
myapp({
  silent: true
});

// load url fragment directly
var matched = Backbone.history.loadUrl(route);
if (!matched) {
  next();
}
