// this is ANOTHER table in DB, need to set up routes (in server.js) for this table, ie 'users'

var bcrypt = require('bcrypt');  // add in once npm install bcrypt@0.8.5 loaded in terminal
var _ = require('underscore'); // add in here as going to use later

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
		// add salt + password_hash => when hashing data, you get same result every time. If 2 people had same password, if we have same hash, we have same password. Salt adds random hashes before and after hash.  So 2 people with same password, has before and after hashes that are different.
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL, // change from STRING to VIRTUAL, which won't let data be stored in DB but can still be accessible
			allowNull: false, 
			validate: {
				len: [7, 100]  
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10); // 10 is length of salt hash to be added (can add any value)
				var hashedPassword = bcrypt.hashSync(value, salt); // value = password, salt = salt 

				// sets values so can be accessed
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
		}

	});
};

// when updating a model's definition, should update server.js db.sequelize.sync({force: true}), as force:true will drop and rebuild all tables, thus adding in new definitions (e.g. here salt, password_hash + password)
// run node server.js + open sqlitebrowser to show new user table in DB with added fields
// test in Postman (which should now show new fields when JSON data returned) + hashes returned