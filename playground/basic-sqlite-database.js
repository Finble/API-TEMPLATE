var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, { // creates a new instance of the 'blueprint' object Sequelize
	'dialect': "sqlite",
	'storage': 'basic-sqlite-database.sqlite'
});

sequelize.sync().then(function() {
	console.log('Everything is synced');
});

// run node ./playground/basic-sqlite-database.js in terminal and if all working it should print 'Everything is synced'