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
    var body = _.pick(req.body, 'description', 'completed'); 
    
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){ 
        return res.status(400); 
    }
    
    body.description = body.description.trim();
   
    body.id = todoNextId++;
    
    todos.push(body);
    res.json(body);
});

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

// UPDATE or PUT route

app.put('/todos/:d', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});  // in todos array, find the new object set as having an id the same as the id input into url (saved as var todoId)
    var body = _.pick(req.body, 'description', 'completed'); 
    var validAttributes = {}; // will put all valid attributes into an array
    
    // can't find id, send error message

    if (!matchedTodo) {
        return res.status(404).send(); // return stops everything else running (should condition be met and return is actually run)
    }
    
    // valid COMPLETED attribute

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) { // property needs to include completed and that property must be a Boolean
        validAttributes.completed = body.completed;
    
    // invalid COMPLETED attribute, as completed exists but not a Boolean - this goes after valid attribute, otherwise all completed, with or without Boolean, would be selected
    
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    } 
    
    // valid DESCRIPTION attribute

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) { // only runs if body description exists and content is a string beyond 0 length
        validAttributes.description = body.description;
        
    // invalid DESCRIPTION attribute, as description completed but value is not a string
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    matchedTodo = _.extend(matchedTodo, validAttributes); // same as matchedTodo = _.extend(matchedTodo, validAttributes);  extend = copies properties from one object to another, taking destination (where you want to put new data) and source (where you get data from), so we add validAttributes to override existing attributes in matchedToDo item
    res.json(matchedTodo); // calls a good response (so you can see this in postman)

});
    
app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});