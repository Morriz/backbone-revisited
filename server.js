ROOT = __dirname + '/public/js/';
PUBROOT = __dirname + '/public/';
LIB = __dirname + '/lib/';
ONSERVER = true;
ONCLIENT = !ONSERVER;

// now load our special jquery first and make it global
var fs = require('fs')
  , cheerio = require('cheerio')
  , layout = fs.readFileSync('./public/layout.html')
  , cache = {}
  ;
global.$ = cheerio.load(layout);

// and continue with the rest
var vm = require('vm')
  , express = require('express')
  , app = express()
  , appServer
  , apiServer = require('./app/services/rest')
  ;

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(express.session({
  secret: 'bladi'
}));
// and serve static files straight away
app.use(express.static(__dirname + '/public', {
  maxAge: 31536000000 // one year
}));
// put the main router last
app.use(app.router);
app.use('/api', apiServer);
app.use(express.errorHandler({
  dumpExceptions: true,
  showStack: true
}));

/**
 * catchall route handled by Backbone
 */

app.all('*', function (req, res, next) {

  global.sendFullHtmlToClient = function() {
    var html = $.html();
    html = html.substr(0, html.lastIndexOf('\n'));
//    cache[route] = html;
    res.end(html);
    return;
  };

  var route = req.url.substr(1)
    , sandbox = {
        console: console,
        require: require,
        ROOT: ROOT,
        LIB: LIB,
        PUBROOT: PUBROOT,
        cheerio: cheerio,
        layout: layout,
        route: route,
        next: next
      }
    ;

  if (cache[route]) {
    res.end(cache[route]);
    return;
  }

  var script = vm.createScript(fs.readFileSync(__dirname + '/sandboxed.js'));
  script.runInNewContext(sandbox);

});

// start listening
appServer = app.listen(8000, function(port) {
  console.log('server running on port ' + 8000);
});

module.exports = appServer;
