var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js'); // add in so that db can be accessed

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// GET

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

// GET/todos + query + filters

app.get('/todos', function(req, res) {
    var queryParams = req.query;
    var filteredTodos = todos;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {
            completed: true
        });
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {
            completed: false
        });
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0)
        filteredTodos = _.filter(filteredTodos, function(todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        })
    res.json(filteredTodos);
});

// GET/todos/:id

app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// POST/todos ADD DB
// TO CHECK WORKING, RUNING NODE SERVER.JS IN TERMINAL, SHOULD OPEN UP PORT
// OPEN POSTMAN + CREATE NEW TODOS VIA POST ROUTE (UPDATE BODY + SEND X2,3,4...)
// TERMINAL PORT WILL UPDATE WITH NEW ENTRIES TOO
// OPEN UP SQLITE BROWSER TO CHECK ENTRIES THERE TOO

app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    
    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON()); // todo object in sequelize needs to be JSONed again!
    }, function(e) {
        res.status(400).json(e);
    });
});
//     if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
//         return res.status(400);
//     }

//     body.description = body.description.trim();

//     body.id = todoNextId++;

//     todos.push(body);
//     res.json(body);
// });

// DELETE/todos/:id

app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (!matchedTodo) {
        res.status(404).json({
            "error": "no todo found with that id"
        });
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
});

// UPDATE/PUT/todos/:id

app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });
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

// SET UP SERVER INSIDE CALL TO SYNC DB

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
});