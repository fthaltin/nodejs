var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Routers
var indexRouter = require('./routes/index');
var movieRouter = require('./routes/movie');
var directorRouter = require('./routes/director');

var app = express();

// Database Connection
mongoose.connect('mongodb://localhost/movie', { useCreateIndex: true, useNewUrlParser: true });
mongoose.connection.on('open', () => {
  console.log('Connection is ok');
})

//Config files
const config = require('./config');
app.set('api_secret_key', config.api_secret_key);

//Middleware
const verifyToken = require('./middleware/verify-token');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Using Router
app.use('/', indexRouter);
app.use('/api', verifyToken);
app.use('/api/movies', movieRouter);
app.use('/api/directors', directorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
