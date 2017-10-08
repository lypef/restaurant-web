var mongoose = require("mongoose"), Schema = mongoose.Schema;

mongoose.connect("mongodb://lypef:admin@mongodb-lypef.alwaysdata.net/lypef_db");


var user_scheme = new mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	nombre: {type: String, required: true},
	img: String,
	direccion: {type: String, required: true},
	telefono: String,
	preferencias: { type: Schema.Types.ObjectId, ref: 'user_preferencias'},
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users'}
})

var preferencias_user_scheme = new mongoose.Schema({
	adminadmin: { type: Schema.Types.ObjectId, ref: 'clients_users'},
	color_menubar: String,
	preloader: String,
	admin: { type: Boolean, default: false },
	ingredientes: { type: Boolean, default: false },
	recetas: { type: Boolean, default: false },
	products: { type: Boolean, default: false },
	clientes: { type: Boolean, default: false },
	cocina: { type: Boolean, default: false },
	barra: { type: Boolean, default: false },
	sales: { type: Boolean, default: false },
	caja: { type: Boolean, default: false },
	finance: { type: Boolean, default: false },
	charge: { type: Boolean, default: false }
})

var clients_scheme = new mongoose.Schema({
	nombre: {type: String, required: true},
	telefono: String,
	mail: String,
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users'}
})

var clientsDirecciones_scheme = new mongoose.Schema({
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users', required: true},
	cliente: { type: Schema.Types.ObjectId, ref: 'clients', required: true, uppercase: true},
	calle: { type: String, required: true, uppercase: true},
	numero: { type: String, uppercase: true},
	colonia: { type: String, uppercase: true},
	ciudad: { type: String, uppercase: true},
	referencia: { type: String, uppercase: true}
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
	name: {type: String, required: true, uppercase:true},
	codebar: {type: String, required: true, uppercase:true },
	description: {type: String, uppercase:true},
	stock: Number,
	price: { type: Number, required: true},
	cocina: { type: Boolean, required: true, default: false },
	barra: { type: Boolean, required: true, default: false },
	img: String,
	category: { type: Schema.Types.ObjectId, ref: 'catproducts', required: true},
	receta: { type: Schema.Types.ObjectId, ref: 'recetas' },
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users', required: true}
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

var movements_scheme = new mongoose.Schema({
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users'},
	user: { type: Schema.Types.ObjectId, ref: 'user'},
	fecha: Date,
	description: {type: String, required: true, uppercase: true},
	sale: { type: Schema.Types.ObjectId, ref: 'sales'}
})

var sales_scheme = new mongoose.Schema({
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users'},
	user: { type: Schema.Types.ObjectId, ref: 'user'},
	fecha: Date,
	monto: {type: Number, required: true},
	description: {type: String, required: true, uppercase: true},
	cut_user: { type: Boolean, default: false },
	cut_global: { type: Boolean, default: false }
})

var sales_products_scheme = new mongoose.Schema({
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users'},
	sale: { type: Schema.Types.ObjectId, ref: 'sales'},
	product: { type: Schema.Types.ObjectId, ref: 'products'},
	pay: { type: Boolean, default: false, required: true }
})

var kitchen_scheme = new mongoose.Schema({
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users'},
	user: { type: Schema.Types.ObjectId, ref: 'user'},
	cocinero: { type: Schema.Types.ObjectId, ref: 'user'},
	mesa: { type: Schema.Types.ObjectId, ref: 'tables'},
	product: { type: Schema.Types.ObjectId, ref: 'products'},
	comentario: { type: String, uppercase: true},
	unidades: { type: Number, required: true},
	cocina: { type: Boolean, default: false },
	barra: { type: Boolean, default: false },
	preparando: { type: Boolean, default: false },
	end: { type: Boolean, default: false },
	delivery: { type: Boolean, default: false },
	status: { type: String}
})

var places_scheme = new mongoose.Schema({
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users'},
	lugar: { type: String , uppercase: true},
	description: { type: String, uppercase: true },
	img: { type: String }
})

var tables_scheme = new mongoose.Schema({
	admin: { type: Schema.Types.ObjectId, ref: 'clients_users'},
	place: { type: Schema.Types.ObjectId, ref: 'places'},
	type_mesa: { type: String, required: true},
	numero: { type: Number, required: true },
	peoples: { type: Number, required: true },
	description: { type: String, required: false , uppercase: true},
	open: { type: Boolean, default: false }
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
module.exports.direcciones = mongoose.model("clients_direcciones",clientsDirecciones_scheme);
module.exports.user_preferencias = mongoose.model("user_preferencias",preferencias_user_scheme);
module.exports.movements = mongoose.model("movements",movements_scheme);
module.exports.sales = mongoose.model("sales",sales_scheme);
module.exports.sales_products = mongoose.model("sales_products",sales_products_scheme);
module.exports.kitchen = mongoose.model("kitchen",kitchen_scheme);
module.exports.places = mongoose.model("places",places_scheme);
module.exports.tables = mongoose.model("tables",tables_scheme);


