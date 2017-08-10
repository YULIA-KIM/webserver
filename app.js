var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var models = require('./models/Model');

var index = require('./routes/index');
var users = require('./routes/users');
var urls = require('./routes/urls');

var app = express();

//html 코드 보기 쉽게 만들어줌
app.locals.pretty = true;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/urls', urls);

app.get('/template', function(req, res){  //template이라는 경로를 통해 들어온 사용자에게 function이 실행되면서
    res.render('temp');   //temp라는 템플릿 파일을 웹페이지로 rendering해서 전송한다.
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(3001, function(){
    models.sequelize.sync({force: true})
        .then(function (){
            console.log('Database sunc');
        });
});


module.exports = app;
