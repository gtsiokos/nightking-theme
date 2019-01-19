var path        = require('path');
var webpack     = require('webpack');
var express     = require('express');
var config      = require('./webpack.config.dev');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  stats: {
    colors: true
  },
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/static', express.static('dist/static'));

app.get('*', function(req, res, next) {
  var filename = path.join(compiler.outputPath, 'index.html');

  compiler.outputFileSystem.readFile(filename, function(err, result){
    if (err) {
      return next(err);
    }

    res.set('content-type','text/html');
    res.send(result);
  });
});

app.listen(7777, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('[localhost:7777] Listen React');
});
