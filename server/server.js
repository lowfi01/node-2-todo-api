// server.js - Is only responsible for routes


// destructing code
// remember routing is relative to this file
// local imports
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {user} = require('./models/user.js');


// library imports
const {ObjectId} = require('mongodb');
const express = require('express');
var bodyParser = require('body-parser');
var app = express();
const port = process.env.PORT || 3000;

// middleware - (takes the middle ware & access's it)
// return value of bodyParser.json() - is the middleware we will use
app.use(bodyParser.json());

// creating new todo
app.post('/todos', (req, res) => {
    // create document - using req.body.text
    console.log(req.body.text);
    var todo = new Todo({
        // note - req.body - will return the object
        //        req.body.text - will return the parsed text
        text: req.body.text
        
    }); 
   
    // save doc & send back
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});


app.get('/todos', (req, res) => {
    // .find() get everything 
    Todo.find().then((todos) => {
        // we could use todos[0], but passing an object allows for more customization {todos, text: 'example'}
        res.send({todos});
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// challenge - create api route, fetching an individual todo
// GET /todos/id
// URL parameter :id - creates id variable
app.get(`/todos/:id`,(req, res) => {
    // req - params, returns key value pares (key(:id): value(variable))
    // Within postman - shows that using GET localhost://todos/1234 - will show a object { "id" : "1234"}
    //res.send(req.params);
    var id = req.params.id;
    // validate id
    if (!ObjectId.isValid(id)) {
        console.log('_id is not valid');
        return res.status(404).send();
    }
    Todo.findById(id).then((doc) => {
        // no document by that id within collection
        if (!doc) {
            console.log('No todo of that _id: lives in this collection');
            return res.status(404).send();
        };

        // success case
        // note - we send {todo} object, as this sets it to {todo: {}}
        // note - we could simply pass send(todo) - but as this is an api, we would like to use res
        // eg - res.todo
        res.send({doc});
    }).catch((e) => {
        // error handling
        res.status(400).send();
        console.log('Catch error: ', e);
    });


});

// port variable for Heroku
app.listen(port, () => {
    console.log('Server is live', port);
})

// export for testing purposes
module.exports = {app};





















////////////////////////////////////////
// Old  - code below used for tutorials
////////////////////////////////////////

// Moving all this code to mongoose.js 
// // var mongoose = require(`mongoose`);

// // // set mongoose to use promises rather then callbacks
// // mongoose.Promise = global.Promise;
// // // - (protocol:mongodb://URL/DatabaseName)
// // // - mongoose will wait for connection before it runs any other code.
// // mongoose.connect(`mongodb://localhost:27017/TodoApp`, { useMongoClient: true });



// moved to ./models/todo.js
// // // create model - Todo model. - mongoose model
// // // this pre-defines the collection.
// // var Todo = mongoose.model(`Todo`, {
// //     text: {
// //         // set datatype to attribute
// //         type: String,
// //         // sets required field - 
// //         required: true,
// //         // minimum length requirement of string
// //         minlength: 1,
// //         // remove leading or trailing white spaces
// //         trim: true
// //     },
// //     completed: {
// //         type: Boolean,
// //         // if value is not set, - default value will result
// //         default: false

// //     },
// //     completedAt: {
// //         // type will be a unix number
// //         // starting from 1970. 
// //         // -1 = backwards from 1970
// //         // 123 = 2 years from the year 1970 
// //         // Number = similar to int
// //         type: Number,
// //         default: null

// //     }
// // });


// moved to ./models/users.js
// // //mongoose.model = create new User model (date-base collection)
// // var User = mongoose.model(`User`,{
// //     email: {
// //         required: true,
// //         trim: true,
// //         minlength: 1,
// //         type: String
// //     }
// // });



// old code we used to create documents with
// // // create new todo document
// // // - Note we are creating a new instance of the Todo.
// // var newTodo = new Todo({
// //     text: 'Cook dinner'
// // });


// // // save instance to mongoDB database
// // // returns a promise
// // newTodo.save().then((doc) => {
// //     console.log(`Saved todo`, doc);
// // }, (e) => {
// //     console.log('Unable to save todo');
// // });


// // challenge 
// // create a new todo - with all fields
// // var nextTodo = new Todo({
// //     text: 'Hello world!',
// //     completed: false,
// //     completedAt: 1037
// // });

// // var nextTodo = new Todo({
// //     text: '   This has trimming!!! '
// // });

// // nextTodo.save().then((doc) => {
// //     console.log(JSON.stringify(doc, undefined, 2));
// // }, (e) => {
// //     console.log('Unable to save todo!', e);
// // });


// // // challenge - create new user model.
// // // email prop - require, trim, string, minlength 1

// // var newUser = new User({
// //     email: 'JamesH@email.com.au'
// // });

// // newUser.save().then((doc) => {
// //     console.log(`Successful in saving doc ${doc}`);
// // }, (e) => {
// //     console.log(`Error has occurred:   ${e}`);
// // });