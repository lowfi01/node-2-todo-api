// querying data - using mongoose

const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
// challenge code
const {User} = require('./../server/models/user');

var id = '596873748e49141500441b83';
// challenge code
var UserId = '596725cdbc0a0514485e4ce0';

// will return boolean to check if ObjectId is valid
//ObjectID.isValid(id);
// Created if statement to allow print to console
if (!ObjectID.isValid(id)) {
    console.log('Id not valid');
};
// challenge code
if (!ObjectID.isValid(UserId)) {
    console.log('User Id not valid');
};


// Note - Collections, hold documents within an array  
// ['Collection name'{doc},{doc}]

// .find() - query as many todos(documents) as you like
// no arguments = all documents
// argument = specific documents defined by {field}
// returns array[{}], so if empty will return empty array[]
Todo.find({
    // mongoose - auto converts to object id
    _id: id
}).then((todos)=>{
    // callback - returns todos(documents) 
    console.log(`Todos: ${JSON.stringify(todos, undefined, 2)}`);

});

// .findOne() - Will only return one document 
// returns the first documents that match's the query you have
// argument - ({key: value})
// no argument - return top most document in collection
// returns - object{} , so if empty will return null
Todo.findOne({
    _id: id
}).then((doc)=>{
    console.log(`findOne(): ${JSON.stringify(doc, undefined, 2)}`);
});


// .findById - will find document by id 
// similar to .findOne() - by searches id's only
// mongoose - auto converts string id's to object id when passed
// argument - id string '12312314214124124'
// returns - object{} , so if empty will return null
Todo.findById(id).then((doc) => {
    // check if _id exists within collection
    if (!doc) {
        return console.log(`Id not found`);
    }
    console.log(`findById(): ${JSON.stringify(doc, undefined, 2)}`);
}).catch((e) => {
    // catch if id - is invalid (length wrong, user input wrong etc)
    // note - here we could simply pass string
    console.log(e);
});


// challenge 
// query users collection
// user not found
// user found
// invalid id

User.findById(UserId).then((user)=> {
    if (!user) {
        return console.log('No user by that id lives here!!!');
    };
    console.log(`User by Id: ${JSON.stringify(user, undefined, 2)}`);
}).catch((e) => {
    console.log(JSON.stringify(e, undefined, 2));
});


