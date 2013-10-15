var express = require('express')
  , app = express()
  , songRouter = require('./rest/songs')
  , tracksRouter = require('./rest/tracks')
  ;
app.configure(function () {
  // used to parse JSON object given in the body request
  app.use(express.bodyParser());
  // add routes
  songRouter(app);
  tracksRouter(app);
  app.all('*', function (req, res) {
    res.status(404);
  });
});

module.exports = app;

//app.listen(8080, function () {
//  console.log('rest server listening on port ' + 8080);
//});