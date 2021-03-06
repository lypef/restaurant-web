var express  = require('express');
var session = require("express-session");
var mongoose = require('mongoose','mongoose-double');
var morgan = require('morgan');             
var bodyParser = require('body-parser');    
var methodOverride = require('method-override');
var sessiontrue = require('./middlewares/session');
var tokenApi = require('./middlewares/TokenApi');
var StatusTrue = require('./middlewares/StatusTrue');
var ValidateEmail = require("email-validator");
var db = require("./models/models");
var app = express(); 

app.use(session({ secret: 'ajsj229nshslwkjrfdrfg', resave: false,saveUninitialized: true}))     
app.use(express.static('public'));
app.use(express.static('views'));
app.use(morgan('dev'));                                         
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json({limit: '3mb'}));                                     
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
app.use('/api/', tokenApi);
app.use('/api/', StatusTrue);


// Enlaces GET
app.get('/', Inicio );
app.get("/dashboard", Dashboard );
app.get('/logout', Logout);
app.get('/admin_login', AdminLogin);
app.get("/admin_dashboard", Dashboard_Admin );
app.get("/membership_off", Membership_Off );
app.get("/user_incorrect", user_incorrect );
app.get("/admin_login_incorrect", AdminIncorrect );

// Enlaces POST
app.post("/login", Login );
app.post("/login_admin", login_admin );

// Api get
app.get('/api/clients/', ClientsJson);
app.get('/api/clientedit/:id', ClienteditsJson);


app.get('/api/get_direcciones/:id', ClienteDireccionesJson);

app.get('/api/catproducts/:id', CatProductsEditsJson);
app.get('/api/catproducts/', catproductsJson)

app.get('/api/users/', usersjson)

app.get('/api/clients_users/', ClientsUsersJson);
app.get('/api/clients_users/:id', ClientsUserIDLoad);

app.get('/api/admin/values', AdminValuesjson)
app.get('/api/users/values', UserValuesjson)
app.get('/api/users_admin', User_adminValuesjson)
app.get('/api/users/:id', UserIDLoad);
app.get('/api/users/search/:id', Search_users_id );

app.get('/api/getproducts/', getproductsJson)
app.get('/api/getproducts_stock/', getproductsJson_stock)
app.get('/api/getproducts/:id', getProductID)

app.get('/api/getingredients/', getIngredientsJson)
app.get('/api/getingredients/:id', getIngredientID)

app.get('/api/get_measurements/', GetMeasurementsJSON)
app.get('/api/get_measurements/:id', GetMeasuremetsJSON_ID)

app.get('/api/get_receta/', GetRecetasJSON)
app.get('/api/get_receta/:id', GetRecetasJSON_ID)
app.get('/api/get_use_recetas/:id', GetUseRecetasJSON_ID)
app.get('/api/get_use_recetas/', GetUseRecetasJSON)

// Api POST
app.post('/api/clients/add', CreateClient );
app.post('/api/client/update', UpdateClientAdmin );
app.post('/api/client/update/clients', UpdateClient_User );
app.post('/api/client/delete', DeleteClient );
app.post('/api/client/search', SearchClient );

app.post('/api/clients_direcciones/add', InsertClientDirecciones );
app.post('/api/clients_direcciones/update', UpdateClientDireccion );
app.post('/api/clients_direcciones/delete', DeleteClientDireccion );

app.post('/api/catproducts/update/admin', CatproductsUpdateAdmin );
app.post('/api/catproducts/delete/admin', DeleteCatProducts );
app.post('/api/catproducts/add', CreateCatProduct );
app.post('/api/catproducts/add/admin', CreateCatProductAdmin );
app.post('/api/catproducts/search', SearchCatProducts );

app.post("/api/clients_users/add", InsertClientUser );
app.post('/api/clients_users/search', SearchClient_users );
app.post('/api/clients_users/update', UpdateClient_User );
app.post('/api/account/update', UpdateAccount );
app.post('/api/clients_users/delete', DeleteClientUser );

app.post('/api/users/add', AddUser);
app.post('/api/users/search', Search_users );
app.post('/api/users/delete', DeleteUser );
app.post('/api/users_admin/delete', DeleteUser_admin );
app.post('/api/users/update', UpdateUser );
app.post('/api/users/update_preferencias', UpdateUser_preferencias );

app.post('/api/products/add', AddProduct);
app.post('/api/updateproducts', UpdateProduct)
app.post('/api/deleteproducts', DeleteProduct );
app.post('/api/search_products', search_products );
app.post('/api/search_products_stock', search_products_stock );

app.post('/api/add_ingredient', AddIngredient);
app.post('/api/ingredient/search', SearchIngredients )
app.post('/api/update_ingredient', UpdateIngredient)
app.post('/api/ingredient/delete', DeleteIngredient )

app.post('/api/measurement/add', CreateMeasurement )
app.post('/api/measurement/update', UpdateMeasurements )
app.post('/api/measurement/delete', DeleteMeasuremeants )
app.post('/api/measurement/search', SearchMeasurements );

app.post('/api/receta/add', CreateReceta );
app.post('/api/receta/search', SearchRecetas )
app.post('/api/receta/update', UpdateReceta )
app.post('/api/receta/delete', DeleteReceta )

//Funciones
function Inicio (req, res) 
{
	if (req.session.user)
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
		res.sendFile('./views/login.html', { root : __dirname});	
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

function Membership_Off (req,res){
    if (!req.session.clients)
    {
        res.sendFile('./views/Membership_Off.html', { root: __dirname });
    }else {
        res.redirect("/")
    }
}

function user_incorrect (req,res){
    if (!req.session.clients)
    {
        res.sendFile('./views/user_incorrect.html', { root: __dirname });
    }else {
        res.redirect("/")
    }
}

function AdminIncorrect (req,res){
    if (!req.session.clients)
    {
        res.sendFile('./views/Admin/AdminIncorrect.html', { root: __dirname });
    }else {
        res.redirect("/")
    }
}

function AdminLogin (req,res){
    res.sendFile('./views/Admin/login.html', { root: __dirname });
}

function Login (req,res){
	db.user.findOne({username:req.body.username, password:req.body.password}).populate('admin').populate('preferencias').exec(function(err,doc){
		if (doc != null)
		{
			if (doc.admin.status)
            {
                req.session.user = doc
                req.session.clients = true;
                res.redirect("/dashboard");
            }else
            {
                console.log("Membresia vencida")
                res.redirect("/membership_off");
            }
		}
		else{
			console.log("Usuario incorrecto")
            res.redirect("/user_incorrect");
		}
	});
	
};

function login_admin (req,res){
    db.admin.findOne({username:req.body.username, password:req.body.password},function(err,doc){
        if (doc != null)
        {
            req.session.user = doc;
            req.session.clients = false;
            res.redirect("/admin_dashboard#/");
        }
        else{
            console.log("Usuario no encontrado");
            res.redirect("/admin_login_incorrect");
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


function AddUser (req,res){
	db.user.findOne({ username: req.body.username},function(err,doc){
        if (doc == null && req.body.admin != null)
        {
            var p = new db.user_preferencias(
            {
                color_menubar: 'blue'
            });

            p.save(function (err){
                if (!err)
                {
                    var p1 = new db.user(
                    {
                        username: req.body.username,
                        password: req.body.password,
                        nombre: req.body.nombre.toUpperCase(),
                        direccion: req.body.direccion,
                        telefono: req.body.telefono,
                        preferencias: p._id,
                        admin: req.body.admin
                    })
                    p1.save(function(err, doc ){
                        if (err)
                        {
                            res.sendStatus(500); 
                        }else {
                            console.log(doc)
                            res.sendStatus(200);
                        }
                    })
                }
            })
        }else {
            res.sendStatus(500); 
        }
    });
};

function AddProduct (req,res){
    var p = new db.products(
        {
            name: req.body.name,
            codebar: req.body.codebar,
            description: req.body.description,
            stock: req.body.stock,
            img: req.body.img,
            category: req.body.category,
            receta: req.body.receta,
            admin: req.session.user.admin._id
        });
        p.save(function(err){
            if (err)
            {
                res.status(500).send("Error desconocido")
            }else {
                db.products.find({ admin : req.session.user.admin._id}).sort({name:1}).populate('category').populate('admin').populate('receta').exec(function(err, data) {
                if(err) {
                    res.status(500).send(err)
                }else
                {
                    res.status(200).json(data)
                }
            })

            }
        });
    
};

function AddIngredient (req,res){
    if (req.body.name != null)
    {
        var p = new db.ingredients(
        {
            name: req.body.name.toUpperCase(),
            stock: req.body.stock,
            measurements: req.body.measurements,
            admin: req.session.user.admin._id
        });
        p.save(function(err){
                if (err)
                {
                    res.status(500).send("Error desconocido")
                }else {
                    res.status(200).send("Ingrediente agregado")
                }
        });
    }else {
        res.status(500).send("Verifique su informacion")
    }
};

function usersjson (req,res){
	db.user.find().populate('admin').exec(function(err, doc) {
        if(err) {
            res.sendStatus(err);
        }else
        {   
            res.json(doc);    
        }
    });
};

function AdminValuesjson (req,res){
    res.json(req.session.user)
};

function UserValuesjson (req,res){
    res.json(req.session.user)
};

function User_adminValuesjson (req,res){
    db.user.find({ admin: req.session.user.admin._id }).populate('admin').populate('preferencias').exec(function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }else {
            console.log("Usuari no encontrado")
        }
    });
};

function ClientsJson (req,res){
	db.clients.find({ admin: req.session.user.admin._id}, function(err, data) {
        if(err) {
            res.status(500).send(err);
        }else
        {
        	res.json(data);	
        }
    }).sort({nombre:1});
};

function ClientsUsersJson (req,res){
    db.clients_users.find(function(err, data) {
        if(err) {
            res.sendStatus(err);
        }else
        {
            res.json(data); 
        }
    }).sort({nombre:1});
};

function GetProducts (req,res){
    db.clients_users.find(function(err, data) {
        if(err) {
            res.sendStatus(err);
        }else
        {
            res.json(data); 
        }
    }).sort({nombre:1});
};

function ClienteditsJson (req,res){
    db.clients.findOne({_id:req.params.id , admin: req.session.user.admin._id},function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }else
        {
            res.sendStatus(404);
        }
    });
};

function ClienteDireccionesJson (req,res){
	db.direcciones.find({ admin: req.session.user.admin._id, cliente: req.params.id }).sort({ calle:1 }).populate('cliente').exec(function(err,doc){
		if (doc != null)
		{
			res.json(doc)
		}else
		{
			res.status(400).send('Cliente no encontrado');
		}
	});
};

function CreateClient (req, res) 
{  
    if ( ValidateEmail.validate(req.body.mail) == true || req.body.mail == null || req.body.mail == '')
    {
    	var p = new db.clients({
    		nombre: req.body.nombre.toUpperCase(),
    		telefono: req.body.telefono,
    		mail: req.body.mail,
            admin: req.session.user.admin._id
    	})


    	p.save(function (err) {
    	 if (err)
    	 {
    	 	res.status(500).send("No fue posible crear el cliente, intente de nuevo.")
    	 }else
    	 {
    	 	res.status(200).send('Cliente creado con exito')
    	 }
    	})	
    }else
    {
    	res.sendStatus(500, "Email no valido");
    }
}

function UpdateClientAdmin (req, res) 
{  
    if (req.body.admin == req.session.user.admin._id)
    {
        if ( ValidateEmail.validate(req.body.mail) == true || req.body.mail == null)
        {
            db.clients.update(
            { _id : req.body._id },
            { 
                nombre: req.body.nombre.toUpperCase(),
                direccion: req.body.direccion.toUpperCase(),
                telefono: req.body.telefono,
                mail: req.body.mail
            },
            function( err) 
            {
                if (err)
                {
                    res.status(404).send("Algo desconocido sucedio, intente nuevamente");
                }else
                {
                    res.status(200)
                }
            })  
        }else
        {
            res.sendStatus(500, "Email no valido.")
        }
    }else
    {
        res.status(500).send("Este cliente no esta asociado a la cuenta actual.");
    }
}

function UpdateClientDireccion (req, res) 
{  
	db.direcciones.update(
    { _id : req.body._id, admin: req.session.user.admin._id },
    { 
        calle: req.body.calle.toUpperCase(),
        numero: req.body.numero.toUpperCase(),
        colonia: req.body.colonia.toUpperCase(),
        ciudad: req.body.ciudad.toUpperCase(),
        referencia: req.body.referencia.toUpperCase()
    },
    function( err) 
    {
        if (err)
        {
            res.status(404).send("Algo desconocido sucedio, intente nuevamente");
        }else
        {
            res.status(200).send('Direccion actualizada')
        }
    })
}

function UpdateClient_User (req, res) 
{  
    db.admin.findOne({_id: req.session.user.admin._id},function(err,doc){
        if (doc == null)
        {
            if ( ValidateEmail.validate(req.body.mail) == true || req.body.mail == null)
            {
                db.clients.update(
                { _id : req.body._id },
                { 
                    nombre: req.body.nombre.toUpperCase(),
                    telefono: req.body.telefono.toUpperCase(),
                    mail: req.body.mail
                },
                function( err) 
                {
                    if (err)
                    {
                        res.status(404).send("Algo desconocido sucedio, intente nuevamente")
                    }else
                    {
                        res.status(200).send("Algo desconocido sucedio, intente nuevamente")
                    }
                })  
            }else
            {
                res.status(500).send("Email no valido.")
            }
        }else
        {
            res.status(500).send("Este cliente no pertenece a su cuenta")
        }
    })

}

function UpdateAccount (req, res) 
{  
    if ( ValidateEmail.validate(req.body.mail) == true)
    {
        db.clients_users.update(
        { _id : req.body._id },
        { 
            nombre: req.body.nombre.toUpperCase(),
            direccion: req.body.direccion.toUpperCase(),
            namefast: req.body.namefast.toUpperCase(),
            telefono: req.body.telefono,
            mail: req.body.mail,
            type_identificacion: req.body.type_identificacion.toUpperCase(),
            number_identificacion: req.body.number_identificacion.toUpperCase(),
            status: req.body.status,
            vence_pago: req.body.vence_pago.replace(/-/, '.').substring(0, 10)
        },
        function( err) 
        {
            if (err)
            {
                res.status(404).send("Algo desconocido sucedio, intente nuevamente")
            }else
            {
                res.status(200).send("Cuenta actualizado con exito")
            }
        })  
    }else
    {
        res.sendStatus(500, "Email no valido.")
    }
}

function UpdateUser (req, res) 
{  
    db.user.update(
        { _id : req.body._id },
        { 
            password: req.body.password, 
            nombre: req.body.nombre.toUpperCase(),
            direccion: req.body.direccion.toUpperCase(),
            telefono: req.body.telefono
        },
        function( err) 
        {
            if (err)
            {
                res.sendStatus(404, "Algo desconocido sucedio, intente nuevamente")
            }else
            {
                res.status(200).send('Valores actualizados')
            }
        })  
}

function UpdateUser_preferencias (req, res) 
{  
    db.user_preferencias.update(
        { _id : req.body.preferencias._id },
        { 
            color_menubar: req.body.preferencias.color_menubar,
            admin: req.body.preferencias.admin,
            ingredientes: req.body.preferencias.ingredientes,
            recetas: req.body.preferencias.recetas,
            products: req.body.preferencias.products,
            clientes: req.body.preferencias.clientes
        },
        function( err) 
        {
            if (err)
            {
                res.sendStatus(404, "Algo desconocido sucedio, intente nuevamente")
            }else
            {
                res.status(200).send('Valores actualizados')
            }
        })  
}

function UpdateProduct (req, res) 
{  
    db.products.update(
        { _id : req.body._id, admin: req.session.user.admin._id },
        { 
            name: req.body.name.toUpperCase(),
            codebar: req.body.codebar.toUpperCase(),
            description: req.body.description.toUpperCase(),
            stock: req.body.stock,
            img: req.body.img,
            category: req.body.category,
            receta: req.body.receta
        },
        function( err) 
        {
            if (err)
            {
                res.status(404).send("Algo desconocido sucedio, intente nuevamente")
            }else
            {
                db.products.find({ admin : req.session.user.admin._id}).sort({name:1}).populate('category').populate('admin').exec(function(err, data) {
                    if(err) {
                        res.status(500).send(err)
                    }else
                    {
                        res.json(data); 
                    }
                })
            }
        })  
}

function UpdateIngredient (req, res) 
{  
    db.ingredients.update(
        { _id : req.body._id, admin: req.session.user.admin._id },
        { 
            name: req.body.name.toUpperCase(),
            stock: req.body.stock,
            measurements: req.body.measurements._id
        },
        function( err) 
        {
            if (err)
            {
                res.status(404).send("Algo desconocido sucedio, intente nuevamente")
            }else
            {
                res.status(200).send('Ingrediente actualizado')
            }
        })  
}

function DeleteClient (req, res) 
{  
    if (req.body.admin == req.session.user.admin._id)
    {
        db.clients.remove(
        { admin: req.session.user.admin._id, _id : req.body._id },
        
        function( err) 
        {
            if (err)
            {
                res.sendStatus(500, "Error, Intente nuevamente.")
            }else
            {
                db.direcciones.remove(
                { admin: req.session.user.admin._id, cliente: req.body._id },
                
                function( err) 
                {
                    if (err)
                    {
                        res.status(500).send("Error, Intente nuevamente.")
                    }else
                    {
                        res.status(200).send('Cliente eliminado')
                    }
                })
            }
        })
    }else {
        res.status(500).send("Este cliente no esta asociado a la cuenta actual.");
    }
    
}

function DeleteClientDireccion (req, res) 
{  
	db.direcciones.remove(
    { admin: req.session.user.admin._id, _id : req.body._id },
    
    function( err) 
    {
        if (err)
        {
            res.sendStatus(500, "Error, Intente nuevamente.")
        }else
        {
            res.status(200).send('Direccion eliminada')
        }
    })    
}

function DeleteUser (req, res) 
{  
    db.user_preferencias.remove ({ preferencias: req.body.preferencias }, function (err){
        if (err)
        {
            res.sendStatus(500, "Error, Intente nuevamente.")
        }else
        {
            db.user.remove({ _id : req.body._id },function( err) {
                if (err)
                {
                    res.sendStatus(500, "Error, Intente nuevamente.")
                }else
                {
                    res.status(200).send('Usuario eliminado correctamente')
                }
            })
        }
    })
}

function DeleteUser_admin (req, res) 
{  
    if (req.body.admin._id == req.session.user.admin._id){
        db.user_preferencias.remove ({ preferencias: req.body.preferencias }, function (err){
            if (err)
            {
                res.sendStatus(500, "Error, Intente nuevamente.")
            }else
            {
                db.user.remove({ _id : req.body._id },function( err) {
                    if (err)
                    {
                        res.sendStatus(500, "Error, Intente nuevamente.")
                    }else
                    {
                        res.status(200).send('Usuario eliminado correctamente')
                    }
                })
            }
        })
    }else
    {
        res.status(500).send('Error')
    }
}

function DeleteProduct (req, res) 
{  
    db.products.remove(
        { _id : req.body._id, admin: req.session.user.admin._id },
        
        function( err) 
        {
            if (err)
            {
                res.status(500).send("Error, Intente nuevamente.")
            }else
            {
                res.status(200).send('Producto eliminado con exito')
            }
        })
}

function DeleteIngredient (req, res) 
{  
    db.ingredients.remove(
        { _id : req.body._id, admin: req.session.user.admin._id },
        
        function( err) 
        {
            if (err)
            {
                res.status(500).send("Error, Intente nuevamente.")
            }else
            {
                res.status(200).send("Ingrediente Eliminado")
            }
        })
}

function DeleteMeasuremeants (req, res) 
{  
    db.measurements.remove(
    { _id : req.body._id },
    
    function( err) 
    {
        if (err)
        {
            res.status(500).send("Error, Intente nuevamente.")
        }else
        {
            res.status(200).send('Eliminado')
        }
    })
}

function SearchClient (req, res) 
{  
	db.clients.find({admin: req.session.user.admin._id, $or: [ {nombre: { $regex : req.body.text.toUpperCase() }}, {apellidos: { $regex : req.body.text.toUpperCase() }} ] }, function(err, data) {
        if(err || data == "") {
            res.status(500).send("Cliente no encontrado")
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
            res.sendStatus(500,"Cliente no encontrado")
        }else
        {
            res.json(data)
        }
    }).sort({nombre:1});

}

function Search_users (req, res) 
{  
    db.user.find({$or: [ {username: { $regex : req.body.text.toUpperCase() }}, {username: { $regex : req.body.text }} ,{nombre: { $regex : req.body.text.toUpperCase() }} ] }).populate('admin').exec(function(err, doc) {
        if(err) {
            res.sendStatus(err);
        }else
        {   
            console.log(doc);
            res.json(doc);    
        }
    });

}

function search_products_stock (req, res) 
{  
    if (req.body.text == null || req.body.text == '')
    {
        db.products.find({ admin : req.session.user.admin._id, receta: null }).sort({name:1}).populate('category').populate('admin').populate('receta').exec(function(err, doc) {
        if(err) {
            res.status(500).send(err);
        }else
        {   
            res.json(doc);    
        }
        });
    }else
    {
        db.products.find({admin : req.session.user.admin._id, receta: null, $or: [ {name: { $regex : req.body.text.toUpperCase() }}, {codebar: { $regex : req.body.text.toUpperCase() }} ,{description: { $regex : req.body.text.toUpperCase() }} ] }).sort({name:1}).populate('category').populate('admin').populate('receta').exec(function(err, doc) {
        if(err) {
            res.status(500).send(err);
        }else
        {   
            res.json(doc);    
        }
        });
    }
    
}

function search_products (req, res) 
{  
    if (req.body.text == null || req.body.text == '')
    {
        db.products.find({ admin : req.session.user.admin._id }).sort({name:1}).populate('category').populate('admin').populate('receta').exec(function(err, doc) {
        if(err) {
            res.status(500).send(err);
        }else
        {   
            res.json(doc);    
        }
        });
    }else
    {
        db.products.find({admin : req.session.user.admin._id, $or: [ {name: { $regex : req.body.text.toUpperCase() }}, {codebar: { $regex : req.body.text.toUpperCase() }} ,{description: { $regex : req.body.text.toUpperCase() }} ] }).sort({name:1}).populate('category').populate('admin').populate('receta').exec(function(err, doc) {
        if(err) {
            res.status(500).send(err);
        }else
        {   
            res.json(doc);    
        }
        });
    }
    
}

function Search_users_id (req, res) 
{  
    db.user.find({admin:req.params.id}).populate('admin').exec(function(err, doc) {
        if(err) {
            res.sendStatus(err);
        }else
        {   
            res.json(doc);    
        }
    });

}

function SearchCatProducts (req, res) 
{  
    db.catproducts.find({$or: [ {categoria: { $regex : req.body.text.toUpperCase() }}, {descripcion: { $regex : req.body.text.toUpperCase() }} ] }).populate('creator').populate('last_edit').exec(function(err, data) {
        if(err || data == "") {
            res.status(500).send("Categoria no encontrada")
        }else
        {
            res.json(data)
        }
    })
}

function SearchMeasurements (req, res) 
{  
    db.measurements.find({$or: [ {name: { $regex : req.body.txt.toUpperCase() }}, {namefast: { $regex : req.body.txt.toUpperCase() }}, {namefasts: { $regex : req.body.txt.toUpperCase() }} ] },function(err, data) {
        if(err || data == "") {
            res.status(500).send("Medida no encontrada")
        }else
        {
            res.json(data)
        }
    })

}

function SearchIngredients (req, res) 
{  
    if (req.body.txt == null || req.body.txt == undefined)
    {
        db.ingredients.find({admin: req.session.user.admin._id}).sort({name:1}).populate('measurements').exec(function(err, data) {
        if(err || data == "") {
            res.status(500).send("Ingrediente no encontrada")
        }else
        {
            res.json(data)
        }
    })
    }else {
        db.ingredients.find({admin: req.session.user.admin._id, $or: [ {name: { $regex : req.body.txt.toUpperCase() }} ] }).sort({name:1}).populate('measurements').exec(function(err, data) {
        if(err || data == "") {
            res.status(500).send("Ingrediente no encontrada")
        }else
        {
            res.json(data)
        }
    })    
    }

}

function SearchRecetas (req, res) 
{  
    if (req.body.txt == null || req.body.txt == undefined)
    {
        db.recetas.find({admin: req.session.user.admin._id }).sort({name:1}).populate('admin').exec(function(err,doc){
            if (doc != null)
            {
                res.json(doc)
            }
        })
    }else {
        db.recetas.find({admin: req.session.user.admin._id, $or: [ {name: { $regex : req.body.txt.toUpperCase() }} ] }).sort({name:1}).populate('admin').exec(function(err, data) {
        if(err || data == "") {
            res.status(500).send("Receta no encontrada")
        }else
        {
            res.json(data)
        }
    })    
    }

}

function catproductsJson (req,res){
	db.catproducts.find().sort({categoria:1}).populate('creator').populate('last_edit').exec(function(err, data) {
        if(err) {
            res.sendStatus(500,err);
        }else
        {
        	res.json(data);	
        }
    })
};

function GetMeasurementsJSON (req,res){
    db.measurements.find(function(err, data) {
        if(err) {
            res.status(500).send('Error desconocido');
        }else
        {
            res.json(data); 
        }
    }).sort({name:1})
}

function getproductsJson (req,res){
    db.products.find({ admin : req.session.user.admin._id}).sort({name:1}).populate('category').populate('admin').populate('receta').exec(function(err, data) {
        if(err) {
            res.status(500).send(err)
        }else
        {
            res.json(data); 
        }
    })
};

function getproductsJson_stock (req,res){
    db.products.find({ admin : req.session.user.admin._id, receta: null }).sort({name:1}).populate('category').populate('admin').populate('receta').exec(function(err, data) {
        if(err) {
            res.status(500).send(err)
        }else
        {
            res.json(data); 
        }
    })
};

function getIngredientsJson (req,res){
    db.ingredients.find({ admin : req.session.user.admin._id}).sort({name:1}).populate('admin').populate('measurements').exec(function(err, data) {
        if(err) {
            res.status(500).send(err)
        }else
        {
            res.json(data); 
        }
    })
};

function getProductID (req, res)
{
    db.products.findOne({_id: req.params.id , admin: req.session.user.admin._id},function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }else
        {
            res.status(404).send('Producto no encontrado');
        }
    })
}

function GetMeasuremetsJSON_ID (req, res)
{
    db.measurements.findOne({_id: req.params.id},function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }else
        {
            res.status(404).send('Producto no encontrado');
        }
    })
}

function GetRecetasJSON_ID (req, res)
{
    db.recetas.findOne({_id: req.params.id , admin: req.session.user.admin._id}).sort({name:1}).populate('admin').exec(function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }
    })
}

function GetUseRecetasJSON_ID (req, res)
{
    db.use_recetas.find({ receta: req.params.id , admin: req.session.user.admin._id}).populate(
            {path:     'ingrediente',         
                populate: { path:  'measurements',
                            model: 'measurements' }
            }).exec(function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }
    })
}

function GetUseRecetasJSON (req, res)
{
    db.use_recetas.find({ admin: req.session.user.admin._id}).populate(
            {path:     'ingrediente',         
                populate: { path:  'measurements',
                            model: 'measurements' }
            }).exec(function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }
    })
}

function GetRecetasJSON (req, res)
{
    db.recetas.find({admin: req.session.user.admin._id }).sort({name:1}).populate('admin').exec(function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }
    })
}

function getIngredientID (req, res)
{
    db.ingredients.findOne({_id: req.params.id , admin: req.session.user.admin._id}).populate('measurements').exec(function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }else
        {
            res.status(404).send('Ingredient no encontrado');
        }
    })
}

function CreateCatProduct (req, res) 
{  
    if (req.body.categoria != null && req.body.descripcion != null)
    {
        db.catproducts.findOne({categoria: req.body.categoria.toUpperCase()},function(err,doc){
        if (doc == null)
        {
            var p = new db.catproducts({
            categoria: req.body.categoria.toUpperCase(),
            descripcion: req.body.descripcion.toUpperCase(),
            creator: req.session.user._id

            })


            p.save(function (err1, doc1) {
             if (err1)
             {
                res.status(500).send("No fue posible crear la categoria, intente de nuevo.")
             }else
             {
                res.status(200).send("Categoria agregada")
             }
        })  
        }else
        {
            res.status(500).send("La categoria ya existe");
        }
    });
    }else {
        res.status(500).send("Verifique su informacion")
    }
}

function CreateCatProductAdmin (req, res) 
{  
    if (req.body.categoria != null && req.body.descripcion != null)
    {
            db.admin.findOne({ _id: req.session.user._id },function(err,doc){
            if (doc)
            {
                var p = new db.catproducts({
                categoria: req.body.categoria.toUpperCase(),
                descripcion: req.body.descripcion.toUpperCase(),
                last_edit: req.session.user._id

                })


                p.save(function (err1, doc1) {
                 if (err1)
                 {
                    res.status(500).send("No fue posible crear la cetegoria, intente de nuevo.")
                 }else
                 {
                    res.status(200).send("Categoria agregada correctamente")
                 }
                })  

        }
        else{
            res.status(500).send("Usuario no valido")
        }
    });

    }else {
        res.status(500).send("Verifique su informacion")
    }
    
}

function CreateMeasurement (req, res) 
{  
    if (req.body.name != null && req.body.namefast != null)
    {
            db.admin.findOne({ _id: req.session.user._id },function(err,doc){
            if (doc)
            {
                var p = new db.measurements({
                name: req.body.name.toUpperCase(),
                namefast: req.body.namefast.toUpperCase(),
                namefasts: req.body.namefasts.toUpperCase()

                })


                p.save(function (err1, doc1) {
                 if (err1)
                 {
                    res.status(500).send("No fue posible crear la cetegoria, intente de nuevo.")
                 }else
                 {
                    res.status(200).send("Unidad de medida agregada")
                 }
                })  

        }
        else{
            res.status(500).send("Usuario no valido")
        }
    });

    }else {
        res.status(500).send("Verifique su informacion")
    }
    
}

function CreateReceta (req, res) 
{  
    var p = new db.recetas({
        name: req.body.name,
        description: req.body.description,
        receta: req.body.receta,
        admin: req.session.user.admin._id

    })


    p.save(function (err, doc) {
     if (err)
     {
        res.status(500).send("No fue posible crear la receta, intente de nuevo.")
     }else
     {
        var insert = true;

        for (var i =0; i < req.body.arr.length; i++)
        {
            var p = new db.use_recetas({
                receta: doc._id,
                ingrediente: req.body.arr[i].id,
                porcion: req.body.arr[i].porcion,
                update_ingredients: req.body.arr[i].update_ingredients,
                admin: req.session.user.admin._id
            })
            p.save (function (err1,doc1){
                if (err1)
                {
                    insert = false
                }
            })
        }
        if (insert)
        {
            res.status(200).send("Receta creada")
        }else {
            res.status(500).send("Alo desconocido sucedio")
        }
     }
    })  
}

function CatProductsEditsJson (req,res){
    db.catproducts.findOne({_id: req.params.id},function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }else
        {
            res.status(404);
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
            res.sendStatus(404);
        }
    });
};

function UserIDLoad (req,res){
    db.user.findOne({_id:req.params.id},function(err,doc){
        if (doc != null)
        {
            res.json(doc)
        }else
        {
            res.sendStatus(404);
        }
    });
};

function CatproductsUpdateAdmin (req, res) 
{  
    db.admin.findOne({ _id: req.session.user._id },function(err,doc){
        if (doc)
        {
            db.catproducts.update(
            { _id : req.body._id },
            { 
                categoria: req.body.categoria.toUpperCase(),
                descripcion: req.body.descripcion.toUpperCase(),
                last_edit: req.session.user._id
            },
            function( err1) 
            {
                if (err1)
                {
                    res.status(404).send("Algo desconocido sucedio, intente nuevamente")
                }else
                {
                    res.status(200).send("Categoria actualizada correctamente")
                }
            })  
        }
        else{
            res.status(500).send("Usuario no valido")
        }
    });

}

function UpdateMeasurements (req, res) 
{  
    db.measurements.update(
    { _id : req.body._id },
    { 
        name: req.body.name.toUpperCase(),
        namefast: req.body.namefast.toUpperCase(),
        namefasts: req.body.namefasts.toUpperCase()
    },
    function( err) 
    {
        if (err)
        {
            res.status(404).send("Algo desconocido sucedio, intente nuevamente")
        }else
        {
            res.status(200).send("actualizado")
        }
    })  
}


function DeleteReceta (req, res) 
{  
    var r = true
    
    db.recetas.remove({ _id: req.body._id, admin: req.session.user.admin._id },function( err) 
    {
        if (!err)
        {
            db.use_recetas.remove({ receta: req.body._id, admin: req.session.user.admin._id },function( err) 
            {
                if (!err)
                {
                    r = false                
                }
            })
        }
    })

    if (r)
    {
        res.status(200).send('Receta eliminada')
    }else {
        res.status(500).send('No se pueod eliminar la receta')
    }
}

function UpdateReceta (req, res) 
{  
    db.use_recetas.remove({ receta: req.body._id, admin: req.session.user.admin._id },function( err) 
    {
        if (!err)
        {
            console.log('Recetas eliminada')
        }
    })

    var insert_receta = true
    var insert_ingredients = true

    db.recetas.update(
    { _id : req.body._id },
    { 
        name: req.body.name.toUpperCase(),
        description: req.body.description.toUpperCase(),
        receta: req.body.receta.toUpperCase()
    },
    function( err) 
    {
        if (err)
        {
            insert_receta = false
        }
    })  

    for (var i = 0;  i < req.body.arr.length; i++)
    {
        var p = new db.use_recetas({
            receta: req.body._id,
            ingrediente: req.body.arr[i].id,
            porcion: req.body.arr[i].porcion,
            update_ingredients: req.body.arr[i].update_ingredients,
            admin: req.session.user.admin._id
        })
        p.save (function (err1,doc1){
            if (err1)
            {
                insert_ingredients = false
            }
        })
    }
    if (insert_ingredients || insert_receta)
    {
        res.status(200).send('Receta actualizada')
    }else {
        res.status(500).send('Al parecer la actualizacion no se completo. Verifiquela')
    }
}

function DeleteCatProducts (req, res) 
{  
    db.admin.findOne({ _id: req.session.user._id },function(err,doc){
            if (doc)
            {
                db.catproducts.remove({ _id : req.body._id },function( err) 
            {
                if (err)
                {
                    res.status(500).send("Error, Intente nuevamente.")
                }else
                {
                    res.status(200).send("Categoria eliminada correctamente")
                }
            })
        }
        else{
            res.status(500).send("Usuario no valido")
        }
    });
}


function DeleteClientUser (req, res) 
{  
    db.clients_users.remove(
        { _id : req.body._id },
        
        function( err) 
        {
            if (err)
            {
                res.sendStatus(500, "Error, Intente nuevamente.")
            }else
            {
                res.sendStatus(200)
            }
        })
}

function InsertClientDirecciones (req,res)
{
    
    var p = new db.direcciones({
        admin: req.session.user.admin._id,
        cliente: req.body.cliente, 
        calle: req.body.calle,
        numero: req.body.numero,
        colonia: req.body.colonia,
        ciudad: req.body.ciudad,
        referencia: req.body.referencia
    })

    p.save(function (err) {
        console.log(p)
        if (err)
        {
            res.status(500).send("No fue posible crear la direccion, intente de nuevo.")
        }else
        {
            res.status(200).send('Direccion agregada correctamente')
        }
    })
}

function InsertClientUser (req,res)
{
    if ( ValidateEmail.validate(req.body.mail) == true)
    {
        var p = new db.clients_users({
            nombre: req.body.nombre.toUpperCase(),
            direccion: req.body.direccion.toUpperCase(),
            namefast: req.body.namefast.toUpperCase(),
            telefono: req.body.telefono,
            mail: req.body.mail,
            type_identificacion: req.body.type_identificacion.toUpperCase(),
            number_identificacion: req.body.number_identificacion.toUpperCase(),
            status: false,
            vence_pago: '1990-01-01'
        })


        p.save(function (err) {
         if (err)
         {
            res.sendStatus(500, "No fue posible crear el cliente, intente de nuevo.")
         }else
         {
            res.sendStatus(200)
         }
        })
    }else {
        res.sendStatus(500, "Email no valido.")
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


