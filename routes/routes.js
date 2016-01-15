module.exports = function(express,app){
    
    var router = express.Router();
    
    router.get('/', function(req , res , next){
       res.render('index',{title: 'Welcome to ChatUp'}); 
    });
    
    router.get('/chatrooms',function( req ,res,next){
        res.render('chatrooms',{title:'Chatrooms'});
        
    });
    
    router.get('/setColor', function(req , res , next){
        req.session.favColor = 'Red';
        res.send('Setting favourite color ...!');
    });
    
    router.get('/getColor', function(req , res , next){
        res.send('Favourite Color : ' + (req.session.favColor == undefined?"NOT FOUND":req.session.favColor));
    });
    
    app.use('/',router);
    
    
}