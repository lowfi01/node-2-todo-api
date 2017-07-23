// config env variables 

// Setup env for deployment & test environment 
var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    var config = require('./config.json')
    // we are using a variable to access a property here
    // note - requires [] to enable
    var envConfig = config[env];

    //foreach - loop
    Object.keys(envConfig).forEach((key) => {
        //console.log(key);
        process.env[key] = envConfig[key];
    });
}

//
// - Note Old code has been moved to config.json (to prevent allow privacy)
//

// console.log('env **********', env);
// // note - production is already setup to heroku
// if (env === 'development') {
//     // if in development(Local) - set port to 3000
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//     // if in testing(local)
//     process.env.PORT = 3000;
//     // note - this creates a new database
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
