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
var feeds = require('./routes/feed');
var app = express();
var jwt = require('jsonwebtoken');

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

app.all('*', function (req, res, next) {
    if(req.url !== '/users/signUpOk' && req.url !== '/users/loginOk' && req.url !== '/main' && req.url !== '/signup'){
        const token = req.headers['x-access-token'] || req.params.token;

        console.log(token);

        // token does not exist
        if(!token) {
            return res.status(403).json({
                success: false,
                message: 'not logged in'
            })
        }

        var decoded = jwt.verify(token, SECRET);
        console.log(decoded);

        models.User.findOne({
            where: {
                userId: decoded.userID //어떻게 받아오는지 확인해야한다
            }
        }).then(function(user){
            console.log(user);
            next();
        }).catch(function(err){
            res.status(404).json({
                success: false,
                message: 'not found'
            });
        });
    }else
        next();
});

app.use('/', index);  //이걸 이렇게 안쓰면 routes/index.js파일에 있는 라우터들이 적용이 안된다. localhost:3000/ 로 불리면 index.js에 있는 라우터가 연결되는 거야 indew는 위에서 변수로 연결해뒀어
app.use('/users', users);
app.use('/urls', urls);
app.use('/feeds', feeds);

app.get('/signup', function(req, res) {
    res.render('signUp');
});

app.get('/main', function(req, res) {
    res.render('main');
});

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

app.listen(3000, function(){
    models.sequelize.sync({force: false})
        .then(function (){
            console.log('Database sync');
        });
});


module.exports = app;
