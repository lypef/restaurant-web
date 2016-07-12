var express = require("express");
var exphbs  = require("express3-handlebars");
var bodyparser = require("body-parser");
var user = require("./models/models").user;
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
	var a = new user({username: req.body.username, password: req.body.password});
	a.save(function(){
			user.find(function(err,doc){
				console.log(doc);
			});
			res.render('dashboard',{url:"Dashboard"});
	});
});


app.listen(8080);
