// deleting from database

const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// // .remove() - removes all matching queries or all documents
// // no argument - removes all documents from collection
// // argument - specific document(s) defined by {field}
// // returns - result property (ok: 1, n: 'numberRemoved' )
// Todo.remove({}).then((result) =>{
//     console.log(result);
// });


// .findOneAndRemove() - removed first matching queried document
// no argument - requires 
// return - will return document back
//Todo.findOneAndRemove().then();


// .findByIdAndRemove() - removed first matching document
// argument - (stringId)
// note - mongoose auto converts to ObjectID
// return - will return document back
Todo.findByIdAndRemove('596b1b2394c4cf15dcab3799').then((doc) => {
    console.log(doc);
});