var express = require('express'),
    cradle = require('cradle');

var app = express.createServer(express.bodyParser());
var conn = new(cradle.Connection)();
var db = conn.database('users');

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.logger());

app.get('/', function(req, res){
  res.render('index');
});

app.post('/register', function(req, res){
  var data = req.body;
 
  // Check if username is in use
  db.get(data.username, function(err, doc) { 
    if(doc) {
      res.render('index', {flash: 'Username is in use'});

    // Check if confirm password does not match
    } else if(data.password != data.confirm_password) {
      res.render('index', {flash: 'Password does not match'});
   
    // Create user in database
    } else {
      delete data.confirm_password;
      db.save(data.username, data, 
        function(db_err, db_res) { 
          res.render('index', {flash: 'User created'}); 
        });
    }
  });
});

app.post('/login', function(req, res){
  var data = req.body;
  
  // Check if there is a corresponding user in db
  db.get(data.username, 
    function(err, doc){
      if(!doc) { 
        res.render('index', {flash: 'No user found'}); 
      
      // Check if passwords match
      } else if(doc.password != data.password) { 
        res.render('index', {flash: 'Wrong password'}); 
      
      // User is logged in
      } else { res.render('index', {flash: 'Logged in!'}); }
  });  
});

app.listen(3000);
