// this is ANOTHER table in DB, need to set up routes (in server.js) for this table, ie 'users'

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING, 
			allowNull: false, 
			unique: true, 
			validate: {
				isEmail: true 
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false, 
			validate: {
				len: [7, 100]  
			}
		}
	}, {
// hook enables us to normalize data or SANITIZING INPUT (do something with it, here put into lower case) before validating, to remove risk of duplicate accounts being generated because user inputing capitals but for same account
		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		}
	});
};
