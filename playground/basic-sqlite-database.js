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

// run node ./playground/basic-sqlite-database.js
// output is individual SQL statements, that we would have had to write, but Sequelize did for us!
// a new file has been created now in root, DELETE this file, so update line 4 (see above)

sequelize.sync().then(function() {
	console.log('Everything is synced');
});
