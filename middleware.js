module.exports = function(db) { // setting module to a function (vs object) we can have other files pass in configuration data
	return {
		requireAuthentication: function (req, res, next) { // middleware routes different to express routes, as it gets passed 3 arguments, req, res AND NEXT.  Middleware routes run before express routes, by calling next, it then runs express routes (without next, express routes - which will become private routes - wouldn't be run after middleware routes)
			var token = req.get('Auth'); // POST/users/login (server.js), we called token header 'Auth' so need to use same name here
		
			db.user.findByToken(token).then(function(user) {
				req.user = user;
				next();  // success and express routes run
			}, function() {
				res.status(401).send(); // failure and express routes NOT run
			});
		}
	};
};

