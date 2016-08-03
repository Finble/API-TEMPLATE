var express = require('express');
var bodyParser = require('body-parser'); 
var _ = require('underscore');

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

// underscore module has an automatice way of iterating through an array, using "where" - a list is searched until all values is found

//_.where(listOfPlays, {author: "Shakespeare", year: 1611});
//=> [{title: "Cymbeline", author: "Shakespeare", year: 1611},
//    {title: "The Tempest", author: "Shakespeare", year: 1611}]

// or can use findWhere, which finds one value:

//_.findWhere(publicServicePulitzers, {newsroom: "The New York Times"});
//=> {year: 1918, newsroom: "The New York Times"}


app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10); 
    var matchedTodo = _.findWhere(todos,{id: todoId}); // replaces code below
    
//    todos.forEach(function (todo) {
//       if (todoId === todo.id) {
//           matchedTodo = todo;
//       } 
//    });
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});


app.post('/todos', function (req, res) {
    var body = req.body;
    
    body.id = todoNextId++;
    
    todos.push(body);
    res.json(body);
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});