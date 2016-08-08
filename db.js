var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development'; // ENV variables run depending on environment node being run in - Heroku sets env to production (production = postgres, if not product = sqlite) 
var sequelize;

// set environment variables depending on whether in production (used by Heroku) or not
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

db.todo = sequelize.import(__dirname + '/models/todo.js');  // NOTE models NOT modules!
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; // can only set module.exports to one thing, but by saving to an object, we can put lots of things in object!