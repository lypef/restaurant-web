var jwt = require("jsonwebtoken");

//token = eyJhbGciOiJIUzI1NiJ9.cGF5bG9hZA.f_0OBq6Yxx-jymUjCMcifD5ji1adKKYWUmwZF94VvTA
module.exports = function(req,res,next)
{
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token)
  {
    
    jwt.verify(token, "superSecret", function(err, decoded) 
    {      
      if (err) 
      {
        return res.json("Failed to authenticate token.");
      }else
      {
     	  if (req.session.user)
        {
          req.decoded = decoded;    
          next()
        }
      }
    })
  }else 
  {
    return res.status(403).send("Fatal Error");
    
  }
}
