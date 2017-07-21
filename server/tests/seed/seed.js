const {ObjectId} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');


// NOTE - all data will be saved to TodoAppTest collection

var userOneId = new ObjectId();
var userTwoId = new ObjectId();

// seed data for users
const users = [{
    _id: userOneId,
    email: 'helloWorld@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'iWillOverCome@example.com',
    password: 'userTwoPass',
}];

// seed data for testing todos
const todos = [{
    // create object id for testing
    _id:  new ObjectId(),
    text: 'First test todo'
}, {
    _id:  new ObjectId(),
    text: 'Second test todo',
    completed: true,
    completeAt: 333
}];


const populateTodos = (done) => {
   Todo.remove({}).then(() => {
        // this will insert test array into collection
        // resulting - 2 documents
        return Todo.insertMany(todos)
    }).then(() => done());

};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        // note - we are using .save - so middleware will run
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        // note - both of these generated users are promises
        // we want to ensure that the promises complete before we continue
        // so we use this method Promise.all
        // this method - will only require one callback (.then)
        return Promise.all([userOne, userTwo]);
        // note - without the return, we would need to make the code look like this
        // Promise.all([userOne, userTwo]).then()
        }).then(() => done());

};


// note - we are exporting the array as we do manipulate it within test.js
module.exports = {
    populateTodos, todos, users, populateUsers
};