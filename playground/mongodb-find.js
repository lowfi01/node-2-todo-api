//this will fetch from mongodb

// create two variables from mongodb - (without called multiple variables)
// creates ObjectID
// creates MongoClient
const { MongoClient, ObjectID } = require(`mongodb`);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log(`Unable to connect to MongoDB server: ${err}`);
    }
    console.log('Connected to MongoDB server');

//query users - 

    db.collection('Users').find({name: `James`}).toArray().then((docs) => {
        console.log(`Users`);
        console.log(JSON.stringify(docs,undefined,2));
    }, (err) => {
        if (err) {
            console.log('Unable to query Users', err);
        }
    });

    // .find({key: value}) - pass object value
    //db.collection('Todos').find({completed: false}).toArray().then((docs) => {


    // call .count();
    db.collection('Todos').find().count().then((count) => {
        // return a count of all documents 
        console.log(`Todos count: ${count}`);
    }, (err) => {
        // error check
        console.log('Unable to fetch todos', err);
    });


    // db.collection('Todos').find({
    //     // use ObjectID - As ID - has multiple values that must be translated
    //     _id: new ObjectID(`595dfbc31f0f702f28a7ac74`)
    // }).toArray().then((docs) => {
    //     // docs is the promise returned
    //     console.log(`Todos`);
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     // error check
    //     console.log('Unable to fetch todos', err);
    // });


    db.close();
});




// //access database(Collections) - using url link. (error & database object)
// MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
//     if(err) {
//         return console.log(`Unable to connect to MongoDB server: ${err}`);
//     } 

//   //access the collection (the database)
//   //.find - will fetch all documents from Todos collection
//   //.find - is a pointer to the documents (Mongodb - curser)
//   //.find - uses methods to look through the documents
//   //.toArray - returns an array, using a promise
//     db.collection('Todos').find().toArray().then((docs) => {
//         // docs is the promise returned
//         console.log(`Todos`);
//         console.log(JSON.stringify(docs, undefined, 2));
//     }, (err) => {
//         // error check
//         console.log('Unable to fetch todos', err);
//     });


//     db.close();
// }); 