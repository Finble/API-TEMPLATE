var express = require('express');
var bodyParser = require('body-parser'); // middleware

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1; 

app.use(bodyParser.json());  

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function (req, res) {
    res.json(todos); 
});

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
    
    // add id field
    body.id = todoNextId++;
    
    // add to todo array
    todos.push(body);
    res.json(body);
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});