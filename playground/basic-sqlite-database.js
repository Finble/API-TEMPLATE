var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, { // creates a new instance of the 'blueprint' object Sequelize
	'dialect': "sqlite",
	'storage': __dirname + '/basic-sqlite-database.sqlite' // will now store data (once run node...) in the playground folder
});

// define a model (data)

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING
	},
	completed: {
		type: Sequelize.BOOLEAN
	}
})

// add a new to do item via Todo.create

sequelize.sync({force: true}).then(function() { // when add force: true to sync it drops all tables in DB and recreates them
	console.log('Everything is synced');

	Todo.create({
		description: 'Walk my dog',
		completed: false
	}).then(function (todo) { // as above returns a promise, need this code
		console.log('Finished!');
		console.log(todo);
	});
});


// run node ./playground/basic-sqlite-database.js
// auto generated fields = id, updatedAt, createdAt + we required completed, description


