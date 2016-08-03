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

// GET /todos  ==> to get collection / array of all items

app.get('/todos', function (req, res) {
   res.json(todos); 
});


app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});