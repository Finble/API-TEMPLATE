var express = require('express');
var bodyParser = require('body-parser'); 
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1; 

app.use(bodyParser.json());  

// GET

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

// GET /todo?completed=true

app.get('/todos', function (req, res) {
    var queryParams = req.query; // enables queries
    var filteredTodos = todos;
    
    // if has property && completed === true, filteredTodo = _.where (filteredTodos, ?), else if has prop && completed if false
    
    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        filteredTodos = _.where(filteredTodos, {completed: true}); // _.where takes original array and property, create new object to reflect property
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }
    res.json(filteredTodos); 
});

// GET/todos/:id

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10); 
    var matchedTodo = _.findWhere(todos,{id: todoId}); 
    
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// POST

app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed'); 
    
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){ 
        return res.status(400); 
    }
    
    body.description = body.description.trim();
   
    body.id = todoNextId++;
    
    todos.push(body);
    res.json(body);
});

// DELETE

app.delete('/todos/:id', function (req, res) { 
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    
    if(!matchedTodo) {
        res.status(404).json({"error": "no todo found with that id"}); 
    } else {
        todos = _.without(todos, matchedTodo); 
        res.json(matchedTodo); 
    } 
});

// UPDATE/PUT

app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

// SET UP SERVER

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});