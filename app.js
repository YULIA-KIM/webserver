var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var models = require('./models/Model');

var index = require('./routes/index');
var users = require('./routes/users');
var SECRET = 'AdeFESddfTg765JhhgIu';
var urls = require('./routes/urls');
var app = express();

//html 코드 보기 쉽게 만들어줌
app.locals.pretty = true;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);  //이걸 이렇게 안쓰면 routes/index.js파일에 있는 라우터들이 적용이 안된다. localhost:3000/ 로 불리면 index.js에 있는 라우터가 연결되는 거야 indew는 위에서 변수로 연결해뒀어
app.use('/users', users);
app.use('/urls', urls);

app.get('/main', function(req, res){
    res.render('main');
})

app.get('/login', function(req, res){
    res.render('login');
})

app.get('/signup', function(req, res){
    res.render('signup');
})

app.get('/list', function(req, res){
    res.render('list',{name:'구글', address:'www.google.com', rows:"2"});
})

app.get('/regist', function(req, res){
    res.render('regist');
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
