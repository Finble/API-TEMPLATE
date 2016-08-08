var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, { 
	'dialect': "sqlite",
	'storage': __dirname + '/basic-sqlite-database.sqlite' 
});

// define a model (data)

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false, 
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false, 
		defaultValue: false 
	}
});

// add a new to do item via Todo.create

sequelize.sync({
	// force: true
}).then(function() { 
	console.log('Everything is synced');

// fetches data already persisted to DB

	Todo.findById(3).then(function(todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('Todo not found');
		}
	});

	// Todo.create({
	// 	description: 'Take out trash',  
	// 	// can remove 'completed' as set a defaultValue of false 
	// }).then(function (todo) { 

	// // can add new items here: // would not call .then this many times in real life!

	// 	return Todo.create({
	// 		description: 'Clean office'
	// 	});
	// }).then(function(){
	// 	return Todo.findAll({  
	// 		where: {  
	// 			description: {
	// 				$like: '%office%' // enables search, %xx% means ignores what's either side, capitalisation irrelevant (any case can be searched)
	// 			}
	// 		}	
	// 	});
	// }).then(function(todos) { 
	// 	if (todos) {
	// 		todos.forEach(function(todos) {
	// 			console.log(todos.toJSON()); 
	// 		});
	// 	} else {
	// 			console.log('no todos found!');
	// 	}
	// }).catch(function(e){  
	// 	console.log(e);
	// })
});


// run node ./playground/basic-sqlite-database.js



