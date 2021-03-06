var mongoose = require(`mongoose`);

// set mongoose to use promises rather then callbacks
mongoose.Promise = global.Promise;

// let db = {
//     localhost: 'mongodb://localhost:27017/TodoApp',
//     mlab: 'mongodb://lowfi:password123@ds151941.mlab.com:51941/rest-api'
// };

// - (protocol:mongodb://URL/DatabaseName)
// - mongoose will wait for connection before it runs any other code.
//mongoose.connect(`mongodb://localhost:27017/TodoApp`, { useMongoClient: true });
//mongoose.connect( db.localhost || db.mlab , { useMongoClient: true });
//mongoose.connect( db.mlab || db.localhost, { useMongoClient: true });

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true});

// note - there are 3 times of special env available for nodejs 
// test, production, development
//process.env.NODE_ENV

module.exports = {
    mongoose
};