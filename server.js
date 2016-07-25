
var express  = require('express');
var session = require("express-session");
var mongoose = require('mongoose');                     
var morgan = require('morgan');             
var bodyParser = require('body-parser');    
var methodOverride = require('method-override');
var sessiontrue = require('./middlewares/session');
var jwt        = require("jsonwebtoken");

var user = require("./models/models").user;
var clients = require("./models/models").clients

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
app.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
app.use("/dashboard",sessiontrue);


app.get('/', Inicio );
app.get("/dashboard", Dashboard );
app.post("/login", Login );
app.get('/logout', Logout);

app.get('/api/clients/', ClientsJson);
app.post('/api/clients', function(req, res) {  
    clients.create({
		nombre: req.body.nombre.toUpperCase(),
		apellidos: req.body.apellidos.toUpperCase(),
		direccion: req.body.direccion.toUpperCase(),
		movil: req.body.movil,
		telefono: req.body.telefono,
		mail: req.body.mail
    }, function(err, todo){
        if(err) {
            res.send(err);
        }

        clients.find(function(err, todos) {
            if(err){
                res.send(err);
            }
            res.json(todos);
        });
    });
});

app.get('/api/users/', usersjson);
app.post('/api/users', CreateUsername)

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
	var db = new user(
		{
		username: req.body.username,
		password: req.body.password,
		token: jwt.sign("payload", process.env.JWT_SECRET || "klaveultrasecretisima")
		});
	db.save(function(){
			user.find(function(err,doc){
				console.log(doc);
			});

	});
};

function usersjson (req,res){
	user.find(function(err, todos) {
        if(err) {
            res.send(err);
        }else
        {
        	res.json(todos);	
        }
    });
};

function ClientsJson (req,res){
	clients.find(function(err, todos) {
        if(err) {
            res.send(err);
        }else
        {
        	res.json(todos);	
        }
    }).sort({_id:1});
};


app.listen(port, function (err){
	if (!err)
	{
		console.log("Arranque del servidor en el puerto " + port);	
	}
});
