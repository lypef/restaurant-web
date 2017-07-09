var mongoose = require("mongoose"), Schema = mongoose.Schema;

require('mongoose-double')(mongoose);


mongoose.connect("mongodb://lypef:admin@mongodb-lypef.alwaysdata.net/lypef_db");


var user_scheme = new mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	nombre: {type: String, required: true},
	direccion: String,
	telefono: String,
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users'}
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
	nombre: {type: String, required: true},
	direccion: {type: String, required: true},
	telefono: {type: String, required: true},
	mail: {type: String, required: true},
	type_identificacion: {type: String, required: true},
	number_identificacion: {type: String, required: true},
	status: Boolean,
    vence_pago: Date
})

module.exports.user = mongoose.model("user",user_scheme);
module.exports.admin = mongoose.model("admin",Admin_scheme);
module.exports.clients = mongoose.model("clients",clients_scheme);
module.exports.clients_users = mongoose.model("clients_users",Clients_Users_scheme);
module.exports.catproducts = mongoose.model("catproducts",catproducts_scheme);
module.exports.ingredientes = mongoose.model("ingredientes",ingredientes_scheme);


