// this is ANOTHER table in DB, need to set up routes (in server.js) for this table, ie 'users'

var bcrypt = require('bcrypt');  
var _ = require('underscore'); 

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', { // put whole define method into a var user, so we can access var user throughout
		email: {
			type: DataTypes.STRING, 
			allowNull: false, 
			unique: true, 
			validate: {
				isEmail: true 
			}
		},
		
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL, 
			allowNull: false, 
			validate: {
				len: [7, 100]  
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10); 
				var hashedPassword = bcrypt.hashSync(value, salt); 

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		// refactored code from server.js, included authenticate method below as a classMethod (can now use this method multiple times from multiple places)
		classMethods: {
			authenticate: function (body) {  // add body parameter
				return new Promise(function(resolve, reject) {  // this is how we tell a caller of authenticate what went right/wrong
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject(); // returns 401 as a result of POST/user/login method in server.js
					}

					user.findOne({ // db removed, can access var user, as have put everything into var user
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject(); // returns 401 as a result of POST/user/login method in server.js
						}

						resolve(user);
					}, function (e) {
						reject(); // returns 401 as a result of POST/user/login method in server.js
					});
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');  
			}
		}
	});

	return user;
};

