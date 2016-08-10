// this is ANOTHER table in DB, need to set up routes (in server.js) for this table, ie 'users'

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING, 
			allowNull: false, // need to complete
			unique: true, // makes sure no other user records new email with same value for this email
			validate: {
				isEmail: true // sequelize checks this is an email (under hood validations)
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false, // need to complete
			validate: {
				len: [7, 100]  // ensures string is of a certain length
			}
		}
	});
};

// add user.js for validations + updated db.js to read this file