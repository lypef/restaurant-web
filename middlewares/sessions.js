module.exports = function(req,res,next)
{
	if (!req.sessionID)
	{
		res.redirect("/");
		
	}else
	{
		next();
	}
}