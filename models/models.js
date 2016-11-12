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

var User = mongoose.model("User",user_scheme)
var Clients = mongoose.model("Clients",clients_scheme)
var CatProducts = mongoose.model("CatProducts",catproducts_scheme)
var ingredients = mongoose.model("ingredients",ingredientes_scheme)

module.exports.user = User;
module.exports.clients = Clients;
module.exports.catproducts = CatProducts;
module.exports.ingredientes = ingredients;