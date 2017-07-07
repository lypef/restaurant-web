var express  = require('express');
var session = require("express-session");
var mongoose = require('mongoose','mongoose-double');
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
app.use("/admin_dashboard",sessiontrue);
app.use("/admin",sessiontrue);
app.use('/api/', tokenApi);


// Enlaces GET
app.get('/', Inicio );
app.get("/dashboard", Dashboard );
app.get('/logout', Logout);
app.get('/admin_login', AdminLogin);
app.get("/admin_dashboard", Dashboard_Admin );

// Enlaces POST
app.post("/login", Login );
app.post("/login_admin", login_admin );

// Api get
app.get('/api/clients/', ClientsJson);
app.get('/api/clientedit/:id', ClienteditsJson);

app.get('/api/catproducts/:id', CatProductsEditsJson);
app.get('/api/catproducts/', catproductsJson)

app.get('/api/ingredientes/', IngredientesJson)
app.get('/api/ingredientes/:id', IngredientesEditsJson);

app.get('/api/users/', usersjson)

app.get('/api/clients_users/', ClientsUsersJson);
app.get('/api/clients_users/:id', ClientsUserIDLoad);

// Api POST
app.post('/api/users', CreateUsername)

app.post('/api/clients', CreateClient );
app.post('/api/client/update', UpdateClient );
app.post('/api/client/delete', DeleteClient );
app.post('/api/client/search', SearchClient );

app.post('/api/catproducts/update', CatproductsUpdateClient );
app.post('/api/catproducts/delete', DeleteCatProducts );
app.post('/api/catproducts/add', CreateCatProduct );
app.post('/api/catproducts/search', SearchCatProducts );

app.post('/api/ingredientes/update', IngredientesUpdate );
app.post('/api/ingredientes/delete', DeleteIngredientes );
app.post('/api/ingredientes/add', CreateIngrediente );
app.post('/api/ingredientes/search', SearchIngredients );

app.post("/api/clients_users/add", InsertClientUser );
app.post('/api/clients_users/search', SearchClient_users );
app.post('/api/clients_users/update', UpdateClient_User );
app.post('/api/clients_users/delete', DeleteClientUser );

//Funciones
function Inicio (req, res) 
{
	if (req.session.user_id)
	{
		if (req.session.clients)
        {
            res.redirect("/dashboard");
        }else 
        {
            res.redirect("/admin_dashboard");    
        }
	}else
	{
		res.sendFile('./views/clients_users/login.html', { root : __dirname});	
	}
}

function Dashboard (req,res){
	if (req.session.clients)
    {
        res.sendFile('./views/clients_users/dashboard.html', { root: __dirname });
    }
    else {
        res.redirect("/")
    }    
}

function Dashboard_Admin (req,res){
    if (!req.session.clients)
    {
        res.sendFile('./views/Admin/dashboard.html', { root: __dirname });
    }else {
        res.redirect("/")
    }
}

function AdminLogin (req,res){
    res.sendFile('./views/Admin/login.html', { root: __dirname });
}

function Login (req,res){
	db.user.findOne({username:req.body.username, password:req.body.password},function(err,doc){
		if (doc != null)
		{
			req.session.user_id = doc._id;
            req.session.clients = true;
            res.redirect("/dashboard");
		}
		else{
			console.log("Usuario no encontrado");
			res.redirect("/dashboard");
		}
	});
	
};

function login_admin (req,res){
    db.admin.findOne({username:req.body.username, password:req.body.password},function(err,doc){
        if (doc != null)
        {
            req.session.user_id = doc._id;
            req.session.clients = false;
            res.redirect("/admin_dashboard#/");
        }
        else{
            console.log("Usuario no encontrado");
            res.redirect("/admin_login");
        }
    });
    
};

function Logout (req, res, next) {
	req.session.clients = false;
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

function ClientsUsersJson (req,res){
    db.clients_users.find(function(err, data) {
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

function UpdateClient_User (req, res) 
{  
    if ( ValidateEmail.validate(req.body.mail) == true)
    {
        db.clients_users.update(
        { _id : req.body._id },
        { 
            nombre: req.body.nombre.toUpperCase(),
            direccion: req.body.direccion,
            telefono: req.body.telefono,
            mail: req.body.mail,
            type_identificacion: req.body.type_identificacion,
            number_identificacion: req.body.number_identificacion,
            status: req.body.status,
            vence_pago: req.body.vence_pago.replace(/-/, '.').substring(0, 10)
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

function SearchClient (req, res) 
{  
	db.clients.find({$or: [ {nombre: { $regex : req.body.text.toUpperCase() }}, {apellidos: { $regex : req.body.text.toUpperCase() }} ] }, function(err, data) {
        if(err || data == "") {
            res.send(500,"Cliente no encontrado")
        }else
        {
        	res.json(data)
        }
    }).sort({nombre:1});

}

function SearchClient_users (req, res) 
{  
    db.clients_users.find({$or: [ {nombre: { $regex : req.body.text.toUpperCase() }} ] }, function(err, data) {
        if(err || data == "") {
            res.send(500,"Cliente no encontrado")
        }else
        {
            res.json(data)
        }
    }).sort({nombre:1});

}

function SearchIngredients (req, res) 
{  
    db.ingredientes.find({$or: [ {nombre: { $regex : req.body.text.toUpperCase() }}, {descripcion: { $regex : req.body.text.toUpperCase() }} ] }, function(err, data) {
        if(err || data == "") {
            res.send(500,"Ingrediente no encontrado")
        }else
        {
            res.json(data)
        }
    }).sort({nombre:1});

}

function SearchCatProducts (req, res) 
{  
    db.catproducts.find({$or: [ {categoria: { $regex : req.body.text.toUpperCase() }}, {descripcion: { $regex : req.body.text.toUpperCase() }} ] }, function(err, data) {
        if(err || data == "") {
            res.send(500,"Categoria no encontrada")
        }else
        {
            res.json(data)
        }
    }).sort({categoria:1});

}

function catproductsJson (req,res){
	db.catproducts.find(function(err, data) {
        if(err) {
            res.send(500,err);
        }else
        {
        	res.json(data);	
        }
    }).sort({categoria:1});
};

function IngredientesJson (req,res){
    db.ingredientes.find(function(err, data) {
        if(err) {
            res.send(500,err);
        }else
        {
            res.json(data); 
        }
    }).sort({categoria:1});
};

function CreateCatProduct (req, res) 
{  
    var p = new db.catproducts({
		categoria: req.body.categoria.toUpperCase(),
		descripcion: req.body.descripcion.toUpperCase()
    	})


    	p.save(function (err, doc) {
    	 if (err)
    	 {
    	 	res.send(500, "No fue posible crear el cliente, intente de nuevo.")
    	 }else
    	 {
    	 	db.catproducts.find(function(err, data) {
                if(err) {
                    res.send(500,err);
                }else
                {
                    res.json(data); 
                }
            }).sort({categoria:1});
    	 }
    	})	
}

function CreateIngrediente (req, res) 
{  
    if (req.body.cantidad == mongoose.Schema.Types.Double)
    {


    }
    var p = new db.ingredientes({
        nombre: req.body.nombre.toUpperCase(),
        descripcion: req.body.descripcion.toUpperCase(),
        cantidad: req.body.cantidad
        })


        p.save(function (err, doc) {
         if (err)
         {
            res.send(500, "No fue posible crear el ingrediente, intente de nuevo.")
         }else
         {
            db.ingredientes.find(function(err, data) {
                if(err) {
                    res.send(500,err);
                }else
                {
                    res.json(data); 
                }
            }).sort({nombre:1});
         }
        })  
}
function CatProductsEditsJson (req,res){
    db.catproducts.findOne({_id:req.params.id},function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }else
        {
            res.send(404);
        }
    });
};

function IngredientesEditsJson (req,res){
    db.ingredientes.findOne({_id:req.params.id},function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }else
        {
            res.send(404);
        }
    });
};

function ClientsUserIDLoad (req,res){
    db.clients_users.findOne({_id:req.params.id},function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }else
        {
            res.send(404);
        }
    });
};

function CatproductsUpdateClient (req, res) 
{  
    db.catproducts.update(
        { _id : req.body._id },
        { 
            categoria: req.body.categoria.toUpperCase(),
            descripcion: req.body.descripcion.toUpperCase()
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
    
}

function IngredientesUpdate (req, res) 
{  
    db.ingredientes.update(
        { _id : req.body._id },
        { 
            nombre: req.body.nombre.toUpperCase(),
            descripcion: req.body.descripcion.toUpperCase(),
            cantidad: req.body.cantidad
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
    
}
function DeleteCatProducts (req, res) 
{  
    db.catproducts.remove(
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

function DeleteIngredientes (req, res) 
{  
    db.ingredientes.remove(
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

function DeleteClientUser (req, res) 
{  
    db.clients_users.remove(
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

function InsertClientUser (req,res)
{
    if ( ValidateEmail.validate(req.body.mail) == true)
    {
        var p = new db.clients_users({
            nombre: req.body.nombre.toUpperCase(),
            direccion: req.body.direccion,
            telefono: req.body.telefono,
            mail: req.body.mail,
            type_identificacion: req.body.type_identificacion,
            number_identificacion: req.body.number_identificacion,
            status: false,
            vence_pago: '1990-01-01'
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
    }else {
        res.send(500, "Email no valido.")
    }  
}
//Config
const port = "8080"

app.listen(port, function (err){
	if (!err)
	{
		console.log("Arranque del servidor en el puerto " + port);	
	}
});


