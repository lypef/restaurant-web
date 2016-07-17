
var user = require("./models/models").user;
var express  = require('express');
var session = require("express-session");
var mongoose = require('mongoose');                     
var morgan = require('morgan');             
var bodyParser = require('body-parser');    
var methodOverride = require('method-override');
var sessiontrue = require('./middlewares/session');

var app = express(); 

app.use(session({
  secret: 'ajsj229nshslwkjrfdrfg',
  resave: false,
  saveUninitialized: true,
}))     
app.use(express.static('public'));            
app.use(morgan('dev'));                                         
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());
app.use("/dashboard",sessiontrue);


app.get('/', function(req, res) {
	if (req.session.user_id)
	{
		res.redirect("/dashboard");
	}else
	{
		res.sendfile('./views/login.html');
	}
});

app.get("/dashboard",function(req,res){
	res.sendfile('./views/dashboard.html');
});


app.post("/login", function(req,res){
	user.findOne({username:req.body.username, password:req.body.password},function(err,doc){
		if (doc != null)
		{
			req.session.user_id = doc._id;
			res.redirect('/dashboard');
		}
		else{
			console.log("Usuario no encontrado");
			res.sendfile('./views/dashboard.html');
		}
	});
});

app.get('/logout', function (req, res, next) {
	req.session.destroy(function(err){
		if (err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/");
		}
	})
});

app.listen(8080);
console.log("Arranque del servidor.");