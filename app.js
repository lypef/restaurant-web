var express = require("express");

var app = express();

app.set("view engine","jade");

app.get("/", function(req,res){
	res.render("login");
});

app.listen(8000);