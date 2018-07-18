var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieSession = require('cookie-session');
var expressValidator = require('express-validator');

// Require index route
var index = require('./routes/index');
var holder = require('./routes/holder');
var validator = require('./routes/validator');
var admin = require('./routes/admin');

// Instantiate app
var app = express();

// In minutes
const SESSION_DURATION = 15;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
  name: 'session',
  keys: ['secret', 'cat'],
  // Cookie Options
  maxAge: SESSION_DURATION * 60 * 1000
}));

// Import index routes
app.use('/', index);
app.use('/', holder);
app.use('/', validator);
app.use('/', admin);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.send('404 - Page Not Found');
});

module.exports = app;
