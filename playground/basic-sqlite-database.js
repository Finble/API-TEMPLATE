var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, { 
	'dialect': "sqlite",
	'storage': __dirname + '/basic-sqlite-database.sqlite' 
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

sequelize.sync({force: true}).then(function() { 
	console.log('Everything is synced');

	Todo.create({
		description: 'Walk my dog',
		completed: false
	}).then(function (todo) { 
		console.log('Finished!');
		console.log(todo);
	});
});


// run node ./playground/basic-sqlite-database.js



