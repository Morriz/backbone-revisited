var ejsify = require('ejsify')
  , bundle = require('browserify')()
  , file = __dirname + '/public/js/bundle.js'
  , fs = require('fs')
  ;
bundle
  .require('./public/js/clientonly.js', {entry: true})
  .ignore('jquery')
  .require('./public/js/app', {expose: 'app'})
  .transform(ejsify)
  .on('file', function (file, id, parent) {
    console.log(id + ': ' + file);
  })
  .bundle(function (err, src) {
      if (err) return console.error(err);
      console.log('Build succeeded!');
      fs.writeFileSync(file, src);
    })
;
