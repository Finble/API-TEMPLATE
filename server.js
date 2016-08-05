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

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10); 
    var matchedTodo = _.findWhere(todos,{id: todoId}); 
    
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed'); // use_.pick to only pick description and completed data
    
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){ 
        return res.status(400); 
    }
    
    // set body.description to be trimmed value, it removes wasted whitespace
    
    body.description = body.description.trim();
   
    body.id = todoNextId++;
    
    todos.push(body);
    res.json(body);
});

// add a DELETE request/route

app.delete('/todos/:id', function (req, res) { // todo id to be deleted
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    
    if(!matchedTodo) {
        res.status(404).json({"error": "no todo found with that id"}); // instead of .send(); which sends back status but no message
    } else {
        todos = _.without(todos, matchedTodo); // remove matched item from the todos array, globally set to empty array (see top of file)
        res.json(matchedTodo); // send back the matched to do
    } 
});
    
app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});