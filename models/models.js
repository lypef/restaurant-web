var mongoose = require("mongoose");

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
	puesto: String
})

var clients_scheme = new mongoose.Schema({
	nombre: String,
	apellidos: String,
	direccion: String,
	movil: String,
	telefono: String,
	mail: String
})

var User = mongoose.model("User",user_scheme)
var Clients = mongoose.model("Clients",clients_scheme)

module.exports.user = User;
module.exports.clients = Clients;