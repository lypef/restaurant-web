module.exports = function(req,res,next)
{
	if (!req.session.user_id)
	{
		res.redirect("/");	
	}
	else
	{
		if (req.originalUrl == "/")
		{
			res.redirect("/dashboard");	
		}else
		{
			next();
		}
	}
}