module.exports = function(express, app , passport , config,rooms){
    
    var router = express.Router();
    
    router.get('/', function(req , res , next){
       res.render('index',{title: 'Welcome to ChatUp'}); 
    });
    
    function securePages(req , res , next){
        if(req.isAuthenticated()){
            next();
        }
        else{
            res.redirect('/');
        }
    }
    
    router.get('/auth/facebook', passport.authenticate('facebook'), function(req , res ){});
   /*  router.get('/auth/facebook/callback',passport.authenticate('facebook',{
        
        sucessRedirect:'/chatrooms',
        failureRedirect:'/'
        
    })); */
    
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        function(req, res) {
            res.redirect('/chatrooms');
        });
 
    
    
    router.get('/chatrooms',function( req ,res,next){
        res.render('chatrooms',{title:'Chatrooms' , user : req.user , config:config});
        
    });
    
    router.get('/room/:id', securePages, function(req, res , next ){
        
        var room_name = findTitle(req.params.id);
        res.render('room',{user:req.user , room_number:req.params.id ,config:config ,room_name: room_name })
    });
    
    function findTitle(room_id){
        var n=0;
        while(n<rooms.length){
            if(rooms[n].room_number == room_id){
                return rooms[n].room_name;
                break;
            }else{
                n++;
                continue;
            }
        }
    }
    
    
    /*
    router.get('/setColor', function(req , res , next){
        req.session.favColor = 'Red';
        res.send('Setting favourite color ...!');
    });
    
    router.get('/getColor', function(req , res , next){
        res.send('Favourite Color : ' + (req.session.favColor == undefined?"NOT FOUND":req.session.favColor));
    });
    */
    
    
    
    router.get('/logout',function(req , res , next){
        req.logout();
        res.redirect('/');
    })
    
    app.use('/',router);
    
    
}