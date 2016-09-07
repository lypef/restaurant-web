var express  = require('express');
var session = require("express-session");
var mongoose = require('mongoose');                     
var morgan = require('morgan');             
var bodyParser = require('body-parser');    
var methodOverride = require('method-override');
var sessiontrue = require('./middlewares/session');
var tokenApi = require('./middlewares/TokenApi');
var ValidateEmail = require("email-validator");
var db = require("./models/models");
var app = express(); 

app.use(session({ secret: 'ajsj229nshslwkjrfdrfg', resave: false,saveUninitialized: true}))     
app.use(express.static('public'));
app.use(express.static('views'));            
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
app.use('/api/', tokenApi);


// Enlaces GET
app.get('/', Inicio );
app.get("/dashboard", Dashboard );
app.get('/logout', Logout);

// Enlaces POST
app.post("/login", Login );

// Api get
app.get('/api/clients/', ClientsJson);
app.get('/api/clientedit/:id', ClienteditsJson);
app.get('/api/users/', usersjson)

// Api POST
app.post('/api/users', CreateUsername)
app.post('/api/clients', CreateClient );
app.post('/api/client/update', UpdateClient );
app.post('/api/client/delete', DeleteClient );



//Funciones
function Inicio (req, res) 
{
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
	db.user.findOne({username:req.body.username, password:req.body.password},function(err,doc){
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
	var p = new db.user(
		{
		username: req.body.username,
		password: req.body.password,
		});
	p.save(function(){
			db.user.find(function(err,doc){
				console.log(doc);
			});

	});
};

function usersjson (req,res){
	db.user.find(function(err, todos) {
        if(err) {
            res.send(err);
        }else
        {
        	res.json(todos);	
        }
    });
};

function ClientsJson (req,res){
	db.clients.find(function(err, data) {
        if(err) {
            res.send(err);
        }else
        {
        	res.json(data);	
        }
    }).sort({nombre:1});
};

function ClienteditsJson (req,res){
	db.clients.findOne({_id:req.params.id},function(err,doc){
		if (doc != null)
		{
			res.json(doc)
		}else
		{
			res.send(404);
		}
	});
};

function CreateClient (req, res) 
{  
    if ( ValidateEmail.validate(req.body.mail) == true || req.body.mail == null)
    {
    	var p = new db.clients({
		nombre: req.body.nombre.toUpperCase(),
		apellidos: req.body.apellidos.toUpperCase(),
		direccion: req.body.direccion.toUpperCase(),
		movil: req.body.movil,
		telefono: req.body.telefono,
		mail: req.body.mail
    	})


    	p.save(function (err) {
    	 if (err)
    	 {
    	 	res.send(500, "No fue posible crear el cliente, intente de nuevo.")
    	 }else
    	 {
    	 	res.send(p._id)
    	 }
    	})	
    }else
    {
    	res.send(500, "Email no valido");
    }
}

function UpdateClient (req, res) 
{  
	if ( ValidateEmail.validate(req.body.mail) == true || req.body.mail == null)
	{
		db.clients.update(
    	{ _id : req.body._id },
    	{ 
			nombre: req.body.nombre.toUpperCase(),
			apellidos: req.body.apellidos.toUpperCase(),
			direccion: req.body.direccion.toUpperCase(),
			movil: req.body.movil,
			telefono: req.body.telefono,
			mail: req.body.mail
    	},
    	function( err) 
    	{
        	if (err)
        	{
        		res.send(404, "Algo desconocido sucedio, intente nuevamente")
        	}else
        	{
        		res.send(200)
        	}
    	})	
	}else
	{
		res.send(500, "Email no valido.")
	}
	
}

function DeleteClient (req, res) 
{  
	db.clients.remove(
    	{ _id : req.body._id },
    	
    	function( err) 
    	{
        	if (err)
        	{
        		res.send(500, "Error, Intente nuevamente.")
        	}else
        	{
        		res.send(200)
        	}
    	})
}

const port = "8080"

app.listen(port, function (err){
	if (!err)
	{
		console.log("Arranque del servidor en el puerto " + port);	
	}
});
