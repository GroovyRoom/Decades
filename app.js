var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

var indexRouter = require('./routes/index');
var artworksRouter = require('./routes/artworks');
var debugRouter = require('./routes/debug');
var reactRouter = require('./routes/react')
var authRouter = require('./routes/auth')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set session cookie name to "userID"
app.use(cookieParser())
app.use(session({name: 'userID', secret: 'cat', saveUninitialized: false, resave: false}));

// Locally we will serve that build/ directory here
// When app is deployed, GAE sets that variable to "production"
if (process.env.NODE_ENV !== "production") {
  app.use(express.static(path.join(__dirname, '/client/build')))
}

app.use('/api/auth/', authRouter)
app.use('/api/', indexRouter);
app.use('/api/debug/', debugRouter)
app.use('/api/artworks/', artworksRouter)

// Catch-all for react routes
app.use('/*', reactRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // TODO: only log for debugging
  console.log(`[DECADES] Server experienced an error...`)
  console.error(err)

  // send the error back
  res.status(err.status || 500);
  res.send('Something broke!')
});

module.exports = app;
