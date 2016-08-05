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
// FILTER ==> add a new query parameter, e.g. GET/todos?completed=true&q=work or GET/todos?completed=false&q=house

app.get('/todos', function (req, res) {
    var queryParams = req.query; 
    var filteredTodos = todos;
    
    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        filteredTodos = _.where(filteredTodos, {completed: true}); 
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }
    
    // FILTER looks through whole array and returns selected value, e.g. "Go to work on a Saturday".indexOf('work') // returns -1 if it doesn't exist or position in string if it exists
    
    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) // code will only run if q exists and it is a string (ie contains text)
        filteredTodos = _.filter(filteredTodos, function (todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;   // indexOf is only available on a string, not an object, so need todo.description.indexOf not todo.indexOf
        })
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