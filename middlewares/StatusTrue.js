var db = require("../models/models");

module.exports = function(req,res,next)
{
	if (req.session.clients)
	{
		db.clients_users.findOne({_id: req.session.admin},function(err,doc){
			if (doc.status)
			{
				next();

			}else {
				req.session.clients = false;
    			req.session.destroy();
			}
		})
	}else {
		next();
	}
}

