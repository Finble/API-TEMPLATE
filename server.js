var express = require('express');
var bodyParser = require('body-parser'); // middleware

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1; // a way to keep track of data stored locally, won't need when using a DB

app.use(bodyParser.json()); // enables middleware to be set up - anytime a json request comes in, express is going to parse it, and we can access it via request.body 

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function (req, res) {
    res.json(todos); 
});

// GET /todos/:id ==> to get individual to do item - option 1:

//app.get('/todos/:id', function (req, res) {
//    res.send('Asking for todo with id of ' + req.params.id);
//})

// GET /todos/:id ==> to get individual to do item - option 2:

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10); // convert string to a number
    var matchedTodo;
    
    todos.forEach(function (todo) {
       if (todoId === todo.id) {
           matchedTodo = todo;
       } 
    });
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});


// POSTS can take data and store it in the array above

app.post('/todos', function (req, res) {
    var body = req.body;
    console.log('description: ' + body.description);
    res.json(body);
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});