'use strict';

var express        = require('express'),
    exphbs         = require('express-handlebars'),
    memwatch       = require('memwatch'),
    env            = require("require-env"),
    pg             = require("pg"),
    escape         = require('pg-escape'),
    passport       = require("passport"),
    FlickrStrategy = require("passport-flickr").Strategy,
    fs             = require("fs");

    var User;

User = {
  findOrCreate : function(params, callback) {

    if (User.info) {
      callback(null, params);
    } else {
      User.info = params;
      callback(null, params);
    }

  }
};

var app        = express();
module.exports = app;

app.set("userMessage", "This version of Geotagger is for mobile and is read only.");

app.use(express.cookieParser());
app.use(express.session({secret: env.require("SESSION_SECRET")}));

//
// Handle memory leaks
//
memwatch.on('leak', function(info) {
  console.log('Memory Leak detected:', info);
});

// you'll need cookies
app.use(express.cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new FlickrStrategy({
  consumerKey: env.require("FLICKR_KEY"),
  consumerSecret: env.require("FLICKR_SECRET"),
  callbackURL: "http://127.0.0.1:"+process.env.PORT+"/auth/flickr/callback"
},
function(token, tokenSecret, profile, done) {

  User.token = token;
  User.tokenSecret = tokenSecret;
  User.findOrCreate(profile, function (err, user) {
    user.token = User.token;
    user.tokenSecret = User.tokenSecret;
    return done(err, user);
  });
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

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
    },
    "json" : function(options) {

      if (options && options.fn) {
        return JSON.stringify(options.fn(this));
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

  require('./controllers/home.js')(req, res, {
    user:User.info
  }, function(err, templateData) {
    if (err) {
      return next(err);
    }
    templateData.view = 'home';

    res.render('home', templateData);

  });
});

app.get('/js/partials.json', function(req,res, next) {

  var out = {};

  fs.readdirSync("./views/partials").forEach(function(partialName) {
    out[partialName.split(".")[0]] = fs.readFileSync("./views/partials/" + partialName, {"encoding":"utf8"});
  });

  res.json(out);

});

app.get('/js/helpers/:name.js', function(req,res, next) {

  res.contentType('text/javascript');
  //AMD-ify helpers
  res.send([
    "define([\"require\",\"exports\",\"module\",\"handlebars\"], function(require,exports,module,Handlebars) {\"use strict\";",
    fs.readFileSync("./helpers/" + req.params.name + ".js", {"encoding":"utf8"}),
    "Handlebars.registerHelper(\""+req.params.name+"\",module.exports)",
    "});"
    ].join(""));

});

app.get('/js/lib/:name.js', function(req,res, next) {

  res.contentType('text/javascript');
  //AMD-ify helpers
  res.send([
    "define([\"require\",\"exports\",\"module\"], function(require,exports,module,Handlebars) {\"use strict\";",
    fs.readFileSync("./lib/" + req.params.name + ".js", {"encoding":"utf8"}),
    "});"
    ].join(""));

});

app.get('/credit', function(req, res, next) {

  res.render('credit', {
    "view" : "photo",
    "user" : "guest"
  });
});

app.get('/photo/:id', function(req, res, next) {

  require('./controllers/photo.js')(req, res, {
    user:User.info
  }, function(err, templateData) {
    if (err) {
      return next(err);
    }
    templateData.view = 'photo';

    res.render('photo', templateData);

  });
});

app.get('/auth/flickr',
passport.authenticate('flickr'),
function(req, res){
  // The request will be redirected to Flickr for authentication, so this
  // function will not be called.
});

app.get('/auth/flickr/callback',
passport.authenticate('flickr', { failureRedirect: '/' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
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
