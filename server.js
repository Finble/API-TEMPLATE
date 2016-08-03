var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{ 
    id: 1,
    description: 'Meet mum for lunch',
    completed: false // todo not yet done
}, {
    id: 2,
    description: 'Go to market',
    completed: false
},  {
    id: 3,
    description: 'Feed the cat',
    completed: true
}];

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function (req, res) {
    res.json(todos); 
});

// GET /todos/:id ==> to get individual to do item

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

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});