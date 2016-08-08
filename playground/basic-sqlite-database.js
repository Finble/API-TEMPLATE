var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, { 
	'dialect': "sqlite",
	'storage': __dirname + '/basic-sqlite-database.sqlite' 
});

// define a model (data)
// for validations, look at sequelize docs, models, validation

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false, // adding validation, must complete description
		validate: {
			len: [1, 250]// only takes strings with length of 1 or greater than 1, not more than 250 characters
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false, // adding validation, must complete completed
		defaultValue: false // adding validation, if someone doesn't complete a completed status (as not required by user), code will set to false
	}
});

// add a new to do item via Todo.create

sequelize.sync({
	force: true
}).then(function() { 
	console.log('Everything is synced');

	Todo.create({
		description: 'Take out trash',  
		// completed: false // testing this not input, program returns long object, but no error, as we set a defaultValue of false if no input (line 21)
	}).then(function (todo) { 
		console.log('Finished!');
		console.log(todo);
	}).catch(function(e){  
		console.log(e);
	})
});


// run node ./playground/basic-sqlite-database.js



