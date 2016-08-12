module.exports = function(db) { 
	return {
		requireAuthentication: function (req, res, next) { 
			var token = req.get('Auth'); 
		
			db.user.findByToken(token).then(function(user) {  // find user
				req.user = user;  // set user instance on req.user object, so we can use req.user to access the sequelized instance from elsewhere in program
				next();  
			}, function() {
				res.status(401).send(); 
			});
		}
	};
};

