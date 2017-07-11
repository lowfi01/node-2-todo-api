// connect to MongoClient
//const MongoClient = require(`mongodb`).MongoClient;

// - object destructuring 
const {MongoClient, ObjectID} = require(`mongodb`);

// // this creates an objectID
// var obj = new ObjectID();
// console.log(obj); //Output = new objectId




// client requires two arguments (url, callBack)
// url - can be local or production (heroku or aws)
// url - requires mongodb://localhost:portNumber/NameOfDB
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    // (error, dbObject)
    if(err) {
        // return - is used here only so that - the success console.log doesn't run if error happens
        // return - will exit this block of code
        // note - else { // will do the same thing }
        return console.log(`Unable to connect to MongoDB server: ${err}`);
    } 
    console.log('Connected to MongoDB server');
    // // create data
    // // .insertOne(object with fields, callbackObject)
    // db.collection('Todos').insertOne({
    //     test: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //       return console.log(`Unable to insert todo: `, err)
    //     } 
    //     // ops - holds all the docs (insertOne Document)
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    

    // inserts  new doc into Users collection 
    // properties (name, age, location )


    // db.collection('Users').insertOne({
    //     name: 'James',
    //     age: 25,
    //     location: 'Doncaster'
    // }, (err, result) => {
    //     if(err) {
    //         return console.log(`Unable to insert User`, err)
    //     }

    //     // .ops is the the result of all documents.
    //     // get Timestamp - of creation.
    //     console.log(result.ops[0]._id.getTimestamp());
    //     //console.log(JSON.stringify(result.ops, undefined, 2));
    // });


    db.close();
}); 