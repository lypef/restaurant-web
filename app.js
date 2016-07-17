var express = require("express");
var exphbs  = require("express3-handlebars");
var bodyparser = require("body-parser");
var user = require("./models/models").user;
var session = require("express-session");
var session_middleware = require("./middlewares/sessions");

var app = express();



app.engine('handlebars', exphbs({
	
	defaultLayout: 'main'

}));
app.set('view engine', 'handlebars');


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(session({
  secret: 'ajsj229nshslwkjrfdrfg',
  resave: false,
  saveUninitialized: true,
}))

app.use("/dashboard", session_middleware);
app.use("/tables", session_middleware);
app.use("/logout", session_middleware);
app.use(express.static('public')); 

app.get('/', function (req, res, next) {
	if (req.session.user_id)
	{
		res.redirect("/dashboard");	
	}else
	{
		res.render('login', {layout: false});
	}
});

app.get('/dashboard', function (req, res, next) {
	res.render('dashboard',{url:"Dashboard"});
});

app.get('/tables', function (req, res, next) {
	res.render('tables');
});

app.get('/logout', function (req, res, next) {
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
});

app.post("/login", function(req,res){
	user.findOne({username:req.body.username, password:req.body.password},function(err,doc){
		if (doc != null)
		{
			req.session.user_id = doc._id;
			res.redirect("/dashboard");
		}
		else{
			console.log("Usuario no encontrado");
			res.render('login', {layout: false});
		}
	});
});

app.listen(8080);