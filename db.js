var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, { 
	'dialect': "sqlite",
	'storage': __dirname + '/data/dev-todo-api.sqlite' 
});

var db = {};

db.todo = sequelize.import(__dirname + '/modules/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; // can only set module.exports to one thing, but by saving to an object, we can put lots of things in object!