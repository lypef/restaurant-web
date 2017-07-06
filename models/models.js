var mongoose = require("mongoose")
require('mongoose-double')(mongoose);


mongoose.connect("mongodb://lypef:admin@mongodb-lypef.alwaysdata.net/lypef_db");


var user_scheme = new mongoose.Schema({
	username: String,
	password: String,
	nombre: String,
	apellidos: String,
	direccion: String,
	movil: String,
	tel: String,
	date_birth: Date,
	puesto: String,
	token: String
})

var clients_scheme = new mongoose.Schema({
	nombre: {type: String, required: true},
	apellidos: {type: String, required: true},
	direccion: String,
	movil: String,
	telefono: String,
	mail: String
})

var catproducts_scheme = new mongoose.Schema({
	categoria: {type: String, required: true},
	descripcion: String
	
})

var ingredientes_scheme = new mongoose.Schema({
	nombre: {type: String, required: true},
	descripcion: String,
	cantidad: String
	
})

var Admin_scheme = new mongoose.Schema({
	username: String,
	password: String,
	nombre: String
})

var Clients_Users_scheme = new mongoose.Schema({
	nombre: String,
	direccion: String,
	telefono: String,
	mail: String,
	type_identificacion: String,
	number_identificacion: String,
	status: Boolean,
    vence_pago: Date
})

module.exports.user = mongoose.model("User",user_scheme);
module.exports.admin = mongoose.model("Admin",Admin_scheme);
module.exports.clients = mongoose.model("Clients",clients_scheme);
module.exports.clients_users = mongoose.model("Clients_Users",Clients_Users_scheme);
module.exports.catproducts = mongoose.model("CatProducts",catproducts_scheme);
module.exports.ingredientes = mongoose.model("ingredients",ingredientes_scheme);


