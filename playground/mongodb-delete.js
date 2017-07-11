//this will fetch from mongodb

// create two variables from mongodb - (without called multiple variables)
const { MongoClient, ObjectID } = require(`mongodb`);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log(`Unable to connect to MongoDB server: ${err}`);
    }
    console.log('Connected to MongoDB server');

    // //deleteMany
    // //  - chain with collection & pass object as argument (targets field)
    // //  - returns promise & has result as the argument
    // db.collection(`Todos`).deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(`result: `, result);
    // });

    // output will return a lot of information. find - result object
    // n: 3 = 3 todos deleted
    // ok: 1 = result good 
    // result: { n: 3, ok: 1 }

    // //deleteOne
    // // same as above - but will only delete the first document with matching object + field
    // db.collection(`Todos`).deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(`result: ${result}`);
    // });

    // output will return only the result object
    // result: {"n":1,"ok":1}

    //findOneAndDelete  (returns value & deletes document)
    // note - will target first document that matches the argument & delete that
    // note - The promise returned, it the document being deleted (can be very useful)
    db.collection(`Todos`).findOneAndDelete({ completed: false }).then((result) => {
        console.log(result);
    });

    // output will return
    // note - value = document
    // { lastErrorObject: { n: 1 },
    // value:
    // {
    //     _id: 595dfbc31f0f702f28a7ac74,
    //     test: 'Something to do',
    //     completed: false
    // },
    // ok: 1 }



    // challenge
    // deleteMany - user: james
    // findOneAndDelete - _id

    // db.collection(`Users`).deleteMany({name: 'James'}).then((result) => {
    //     console.log(result);
    // });

    db.collection(`Users`).findOneAndDelete({_id: new ObjectID('595dfdfea6f09021bc67796f')}).then((results) => {
        console.log(results, undefined, 2);
    });

});