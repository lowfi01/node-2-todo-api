//this will fetch from mongodb

// create two variables from mongodb - (without called multiple variables)
const { MongoClient, ObjectID } = require(`mongodb`);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log(`Unable to connect to MongoDB server: ${err}`);
    }
    console.log('Connected to MongoDB server');

    //findOneAndUpdate
    // - update item & get new document back as a return (response)
    // takes 3 arguments & returns a promise or callback
    // (filter, update, options, callback).then(promise)
    // note - update operators are required for updating fields
    // note - options are outlined in documentation
    db.collection(`Todos`).findOneAndUpdate({
        _id: new ObjectID(`5964b36b6d4e2d65d9848026`
        )
    }, {
            // $set: - will set the object
            $set: {
                completed: true
            },
            $unset: {
                // chained calls to update
                // unset: deletes field
                complete: true
            }
        }, {
            // this is the options argument. returnOriginal is set to true as default
            // setting as false will ensure that the updated document is returned.
            returnOriginal: false
        }).then((res) => {
            console.log(res);
        });


    // challenge 
    // update - Users collection
    // update - name - to James

    db.collection(`Users`).findOneAndUpdate({
        _id: new ObjectID('59649ac86d4e2d65d9847dc7')
    }, {
            $set: {
                name: 'James'
            }, $inc: {
                // increment age by +1
                // output = +1 to age
                age: 1
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });


    db.close();
});