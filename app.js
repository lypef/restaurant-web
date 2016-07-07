var express = require("express");
var exphbs  = require('express3-handlebars');

var app = express();

app.engine('handlebars', exphbs({
	
	defaultLayout: 'main'

}));

app.set('view engine', 'handlebars');

app.get('/', function (req, res, next) {
    res.render('login', {layout: false});
});
app.get('/dashboard', function (req, res, next) {
    res.render('dashboard');
});

app.listen(8000);