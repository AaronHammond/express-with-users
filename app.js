/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('./util/passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var app = express();



var connStr = 'mongodb://localhost:27017/6470';
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

// all environments
app.set('port', process.env.PORT || 2000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser('herpaderpaderp'));

app.use(express.session({ secret: 'herpaderpaderp', key: 'express.sid'}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('*', function(req, res, next) {
  // put user into res.locals for easy access from templates
  res.locals.user = req.user || null;
  next();
});

//
// INDEX
//

app.get('/', routes.index);

//
// USERS
//
app.get('/user/login', user.viewLogin);
app.post('/user/login', user.doLogin);

app.get('/user/register', user.viewRegister);
app.post('/user/register', user.doRegister);

app.get('/user/logout', user.doLogout);

app.get('/user/dashboard', user.viewDashboard);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
