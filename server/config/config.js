// config env variables 

// Setup env for deployment & test environment 
var env = process.env.NODE_ENV || 'development';
console.log('env **********', env);
// note - production is already setup to heroku
if (env === 'development') {
    // if in development(Local) - set port to 3000
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    // if in testing(local)
    process.env.PORT = 3000;
    // note - this creates a new database
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';

}
