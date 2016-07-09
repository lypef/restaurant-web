var express = require("express");
var exphbs  = require("express3-handlebars");
var bodyparser = require("body-parser");

var app = express();

app.engine('handlebars', exphbs({
	
	defaultLayout: 'main'

}));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.set('view engine', 'handlebars');



app.get('/', function (req, res, next) {
    res.render('login', {layout: false});
});
app.get('/dashboard', function (req, res, next) {
    res.render('dashboard',{url:"Dashboard"});
});

app.post("/login_user", function(req,res){
	console.log("Usuario: " + req.body.username);
	console.log("Contraseña: " + req.body.password);
	res.send("Recibimos los datos")
});


app.listen(8000);
