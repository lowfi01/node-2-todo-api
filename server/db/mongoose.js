var mongoose = require(`mongoose`);

// set mongoose to use promises rather then callbacks
mongoose.Promise = global.Promise;
// - (protocol:mongodb://URL/DatabaseName)
// - mongoose will wait for connection before it runs any other code.
mongoose.connect(`mongodb://localhost:27017/TodoApp`, { useMongoClient: true });


module.exports = {
    mongoose
};