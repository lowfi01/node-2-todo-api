//user models

var mongoose = require(`mongoose`);
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


var UserSchema = new mongoose.Schema({
    email: {
        required: true,
        trim: true,
        minlength: 1,
        type: String,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        },


    },         
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    
    tokens: [{
       
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
        
});

// override method - this will override to remove return values
UserSchema.methods.toJSON = function () {
    var user = this;
    // converts user to object & returns only properties that are available in the document exist
    var userObject = user.toObject();
    console.log(`override method call`,userObject);

    // return lodash.pick & only return these specific properties to return
    return _.pick(userObject, ['_id','email']);
};

// instance methods
// note - we are using the function syntax because of this keyword
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    // sign ({IdObject, Create & set access property}, 'Secret String')
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    // push to the end of array syntax
    user.tokens.push({access, token});

    // Note above we are only updating the userModel, we must save it
    // note - we are returning this value so server.js can use a promise call
    // note - this return token will the success call for promise call in server.js
    return user.save().then(() => {
        return token;
    })
};

// model method - findByToken()
// .static turns into model methods
// note - we are using a token as the required argument passed when this function is called
UserSchema.statics.findByToken = function (token) {
    var User = this;
    // note - we are leaving this variable undefined, so we can pass an error if verification fails
    var decoded;

    try{
        decoded = jwt.verify(token, 'abc123')
    } catch (e) {
        // end function if token verify fails
        // note - we create a new promise()
        // this is because the function call uses chained promises in server.js
        // return new Promise((resolve, reject) => {
        //     reject('hello world!');
        // });
        return Promise.reject('Hello World im a custom promise reject call!!!');
    }

    // return so that when we call method, we can call a promise (alway for chaining .promises)
    return User.findOne({
        '_id': decoded._id,
        // query nested document
        // note - we are searching if array = token value passed
        'tokens.token': token,
        'tokens.access': 'auth'
    });
    
};

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};

// // example code - of the user model
// {
//     email: 'james@example.com',
//     // passwords will be passed as hash
//     password: 'myPass123',
//     // tokens - we use tokens to allow access to api
//     // note - we are only using authentication type, there are other types
//     token: [{
//         access: 'authentication'
//         // hash token get sent with the http request
//         token: 'hash request'
//     }]
// }



//mongoose.model = create new User model (date-base collection)
// var User = mongoose.model(`User`, {
//     email: {
//         required: true,
//         trim: true,
//         minlength: 1,
//         type: String,
//         // Unique = value must be unique within collection
//         unique: true,
//         // custom email validation
//         validate: {
//             validator: validator.isEmail,
//             message: '{VALUE} is not a valid email'
//         },
//         // // note - this commented code will also work, i left it as an example
//         // validate: {
//         //     // validator: (value) => {
//         //     //     // using validator lib
//         //     //     return validator.isEmail(value);
//         //     //     // returns true if valid
//         //     //     // return false if invalid
//         // },
//         //     message: '{VALUE} is not a valid email'
//         // }

//         // tokens property - array (MongoDB feature)
//         // nested document is how we access database for individual users


//     },         // password attribute
//     password: {
//         type: String,
//         require: true,
//         minlength: 6
//     },
    
//     tokens: [{
//         // properties available on a token
//         access: {
//             type: String,
//             require: true
//         },
//         token: {
//             type: String,
//             require: true
//         }
//     }]
        
// });

