var express = require('express'),
    app = express(),
    path = require('path')
    cookieParser = require('cookie-parser')
    session = require('express-session')
    config = require('./config/config.js'),
    ConnectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;
    
 app.set('views', path.join(__dirname , 'views'));
 
 app.engine('html', require('hogan-express'));   
  
  app.set('view engine', 'html');
  
  app.use(express.static(path.join(__dirname,'public')));
  
  app.use(cookieParser());
  
  var env = process.env.NODE_ENV || 'development';
  
  if(env === 'development'){
      // dev specific settings
     app.use(session({secret:config.sessionSecret, saveUninitialized : true, resave : true}));
       
  } else {
      //Production specific settings
      app.use(session({
         secret : config.sessionSecret,
         saveUninitialized : true,
         resave : true, 
         store : new ConnectMongo({
            // url : config.dbURL, (for Avoiding two seperate connection)
             mongooseConnection:mongoose.connections[0],
             stringify : true
         })
      })); 
  }
  
 // app.use(session({secret:'catscanfly', saveUninitialized : true, resave : true}));
  //app.route('/').get(function(req , res , next ){
    //res.send('<h1> Hello ..! </h1>');
   // res.render('index',{title :'Welcome to ChatUp'});
  //});     
  
  /* var userSchema = mongoose.Schema({
      username:String,
      password:String,
      fullname:String
  })
  
  var Person = mongoose.model('users',userSchema);
  
  var John = new Person({
      username : 'ankuesingh',
      password :'ankur_want_to_login',
      fullname : 'Ankur Singh'
  })
  
  John.save(function(err){
      console.log('Done !');
  })
  */
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  require('./auth/passportAuth.js')(passport , FacebookStrategy , config , mongoose);
  
  require('./routes/routes.js')(express,app ,passport);
   
 
  app.listen (3000 , function(){
    console.log("ChatUp working on the Port 3000"); 
    console.log('Mode:'+ env);
 });