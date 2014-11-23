'use strict';

var express  = require('express'),
    exphbs   = require('express-handlebars'),
    memwatch = require('memwatch');

var app        = express();
module.exports = app;

//
// Handle memory leaks
//
memwatch.on('leak', function(info) {
  console.log('Memory Leak detected:', info);
});

// you'll need cookies
app.use(express.cookieParser());

//
// Setup Express
//
app.engine('handlebars', exphbs({
  defaultLayout : 'main',
  helpers       : {
    "pluralize" : function() {

      var options, number;

      options = (typeof arguments[0] !== 'object') ? arguments[1] : arguments[0];
      number  = (typeof arguments[0] !== 'object') ? arguments[0] : null; //If not, the number is already in the string

      var o = (number) ? [number,options.fn(this)] : options.fn(this).split(' '),
          l = o[o.length-1].split('|');

      if ((o[0] | 0) === 1 && o.length === 2) {
        return options.fn(this).split(l[0])[0] + ' ' +  l[0];
      } else {
        return options.fn(this).split(l[0])[0] + ' ' +  l[1];
      }
    }
  }
}));
app.set('view engine', 'handlebars');

//
// Setup Routes
//

app.use('/style', express.static('./public/style', { maxAge: 3600e3 }));
app.use('/js',    express.static('./public/js', { maxAge: 3600e3 }));
app.use('/data',  express.static('./public/data', { maxAge: 3600e3 }));
app.use('/js/partials',  express.static('./views/partials', { maxAge: 3600e3 }));

app.get('/', function(req, res, next) {

  require('./controllers/home.js')(req, res, {}, function(err, templateData) {
    if (err) {
      return next(err);
    }
    templateData.view = 'home';

    res.render('home', templateData);

  });
});

app.use(function(req, res, next) {
  res.status(404);

  return res.render('404');
});


//
// Go Go Go
//
app.listen(process.env.PORT || 8080, function() {
  console.log("Listening at http://%s:%d/", this.address().address, this.address().port);
});
