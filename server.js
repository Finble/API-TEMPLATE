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
    },  function(e) {
        res.status(500).send();
    })
});

// GET/todos/:id, ADDED DB (amended from API call to sequelize)

app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function(todo) {
        if (!!todo) { // !! taking a value that is NOT a Boolean and turning it into its truthy or falsey
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    },  function(e) {
        res.status(500).send(); // 500 something went wrong server end
    });
});

// POST/todos, ADDED DB (amended from API call to sequelize)

app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    
    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON()); // todo object in sequelize needs to be JSONed again!
    },  function(e) {
        res.status(400).json(e);
    });
});

// DELETE/todos/:id, ADDED DB (amended from API call to sequelize)

app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function(rowsDeleted){
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: "No todo with id"
            });
        } else {
            res.status(204).send();  // 204 everything went well + nothing to send back (vs 200 everything went well + sending a response back)
        }
    },  function(){
        res.status(500).send();
    });
});

// UPDATE/PUT/todos/:id, ADDED DB (amended from API call to sequelize)

app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');

    // VALIDATION TO BE HANDLED IN MODELS/TODO.JS, SO CAN BE REMOVED FROM HERE

    var attributes = {};

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    } 

    db.todo.findById(todoId).then(function(todo) {
        if (todo) {
            todo.update(attributes).then(function (todo) {
            res.json(todo.toJSON());
            },  function (e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    },  function () {
        res.status(500).send();
    });
});

// SET UP POST FOR USERS (a new table in DB)

app.post('/users', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');  
    
    db.user.create(body).then(function(user) {  
        res.json(user.toJSON()); 
    },  function(e) {
        res.status(400).json(e); 
    });
});

// SET UP SERVER INSIDE CALL TO SYNC DB

db.sequelize.sync({force: true}).then(function() { // add {force: true}, will cause sequelize to rebuild DB (and will now add salt and hash fields), so use force:true everytime you want to update USER (or TODO, ie any DB model) definitions
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
});