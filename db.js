var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development'; 
var sequelize;

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	 var sequelize = new Sequelize(undefined, undefined, undefined, { 
 	'dialect': "sqlite",
 	'storage': __dirname + '/data/dev-todo-api.sqlite' 
 });
}

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');  
db.user = sequelize.import(__dirname + '/models/user.js'); // to ensure user.js file is read
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// add associations, todo API = 1:many
// ensure force:true in server.js as new associations means we need to drop and rebuild db to capture changes

db.todo.belongsTo(db.user); // a todo belongs to one user
db.user.hasMany(db.todo); // a user has many todos

module.exports = db; 
