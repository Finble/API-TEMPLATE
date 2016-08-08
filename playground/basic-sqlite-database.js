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
		// description: 'Walk my dog',  // taking out this throws error in terminal (now we have validations above)
		completed: false
	}).then(function (todo) { 
		console.log('Finished!');
		console.log(todo);
	}).catch(function(e){  // can catch error and log out what is wrong (vs terminal throwing up error), by including catch function
		console.log(e);
	})
});


// run node ./playground/basic-sqlite-database.js



