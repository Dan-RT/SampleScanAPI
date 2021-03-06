var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var database = require('./public/javascripts/database');

var indexRouter = require('./routes/index');
var scanRouter = require('./routes/scan');
var recipesRouter = require('./routes/recipes');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var port = process.env.PORT || 8003;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/scan', scanRouter);
app.use('/recipes', recipesRouter);


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

var server = require('http').createServer(app);
server.listen(port);

console.log("Magic happens on port " + port);

module.exports = app;