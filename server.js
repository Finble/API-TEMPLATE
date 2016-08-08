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

// GET/todos + query + filters, ADDED DB

app.get('/todos', function(req, res) {
    var query = req.query; // change name from queryParams
    var where = {};

    // string needs to be completed

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;    
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({where: where}).then(function(todos){
        res.json(todos);
    }, function(e) {
        res.status(500).send();
    })
});

// GET/todos/:id, ADDED DB

app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function(todo) {
        if (!!todo) { // !! taking a value that is NOT a Boolean and turning it into its truthy or falsey
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function(e) {
        res.status(500).send(); // 500 something went wrong server end
    });
});

// POST/todos, ADDED DB

app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    
    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON()); // todo object in sequelize needs to be JSONed again!
    }, function(e) {
        res.status(400).json(e);
    });
});

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