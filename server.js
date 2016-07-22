
var user = require("./models/models").user;
var express  = require('express');
var session = require("express-session");
var mongoose = require('mongoose');                     
var morgan = require('morgan');             
var bodyParser = require('body-parser');    
var methodOverride = require('method-override');
var sessiontrue = require('./middlewares/session');

var app = express(); 

const port = "8080"

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


app.get('/', Inicio );
app.get("/dashboard", Dashboard );
app.post("/login", Login );
app.get('/logout', Logout);


function Inicio (req, res) {
	if (req.session.user_id)
	{
		res.redirect("/dashboard");
	}else
	{
		res.sendFile('./views/login.html', { root : __dirname});
	}
}

function Dashboard (req,res){
	res.sendFile('./views/dashboard.html', { root: __dirname });
}

function Login (req,res){
	user.findOne({username:req.body.username, password:req.body.password},function(err,doc){
		if (doc != null)
		{
			req.session.user_id = doc._id;
			res.redirect("/dashboard");
		}
		else{
			console.log("Usuario no encontrado");
			res.redirect("/dashboard");
		}
	});
	
};

function Logout (req, res, next) {
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
};

function CreateUsername (req,res){
	var db = new user({username: req.body.username, password: req.body.password});
	db.save(function(){
			user.find(function(err,doc){
				console.log(doc);
			});

	});
};

app.listen(port, function (err){
	if (!err)
	{
		console.log("Arranque del servidor en el puerto " + port);	
	}
});
