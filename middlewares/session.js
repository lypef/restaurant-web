module.exports = function(req,res,next)
{
	if (req.session.clients)
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
	else
	{
		if (!req.session.user_id)
		{
			res.redirect("/");	
		}
		else
		{
			if (req.originalUrl == "/admin_login")
			{
				res.redirect("/admin_dashboard");	
			}else
			{
				next();
			}
		}
	}
}