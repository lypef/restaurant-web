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
	telefono: String,
	mail: String,
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users'}
})

var catproducts_scheme = new mongoose.Schema({
	categoria: {type: String, required: true},
	descripcion: {type: String, required: true},
	creator: { type: Schema.Types.ObjectId, ref: 'user'},
	last_edit: { type: Schema.Types.ObjectId, ref: 'admin'}
})


var Admin_scheme = new mongoose.Schema({
	username: String,
	password: String,
	nombre: String
})

var Clients_Users_scheme = new mongoose.Schema({
	nombre: {type: String, required: true},
	namefast: {type: String, required: true},
	direccion: {type: String, required: true},
	telefono: {type: String, required: true},
	mail: {type: String, required: true},
	type_identificacion: {type: String, required: true},
	number_identificacion: {type: String, required: true},
	status: Boolean,
    vence_pago: Date
})

var products_scheme = new mongoose.Schema({
	name: {type: String, required: true},
	description: String,
	stock: Number,
	category: { type: Schema.Types.ObjectId, ref: 'catproducts'},
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users'}
})

var ingredients_scheme = new mongoose.Schema({
	name: {type: String, required: true},
	stock: Number,
	measurements: { type: Schema.Types.ObjectId, ref: 'measurements', required: true},
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users', required: true}
})

var measurement_scheme = new mongoose.Schema({
	name: {type: String, required: true},
	namefast: {type: String, required: true},
	namefasts: {type: String, required: true}
})

var recetas_scheme = new mongoose.Schema({
	name: {type: String, uppercase:true, required: true},
	description: {type: String, uppercase:true},
	receta: {type: String, uppercase:true},
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users', required: true}
})

var use_ingredients_scheme = new mongoose.Schema({
	receta: { type: Schema.Types.ObjectId, ref: 'recetas', required: true},
	ingrediente: { type: Schema.Types.ObjectId, ref: 'ingredients', required: true},
	porcion: { type: Number, required: true},
	update_ingredients: { type: Boolean, default: false },
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users', required: true}
})

module.exports.user = mongoose.model("user",user_scheme);
module.exports.admin = mongoose.model("admin",Admin_scheme);
module.exports.clients = mongoose.model("clients",clients_scheme);
module.exports.clients_users = mongoose.model("clients_users",Clients_Users_scheme);
module.exports.catproducts = mongoose.model("catproducts",catproducts_scheme);
module.exports.products = mongoose.model("products",products_scheme);
module.exports.ingredients = mongoose.model("ingredients",ingredients_scheme);
module.exports.measurements = mongoose.model("measurements",measurement_scheme);
module.exports.recetas = mongoose.model("recetas",recetas_scheme);
module.exports.use_recetas = mongoose.model("use_recetas",use_ingredients_scheme);


