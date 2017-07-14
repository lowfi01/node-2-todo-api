//todo models

var mongoose = require('mongoose');

// create model - Todo model. - mongoose model
// this pre-defines the collection.
var Todo = mongoose.model(`Todo`, {
    text: {
        // set datatype to attribute
        type: String,
        // sets required field - 
        required: true,
        // minimum length requirement of string
        minlength: 1,
        // remove leading or trailing white spaces
        trim: true
    },
    completed: {
        type: Boolean,
        // if value is not set, - default value will result
        default: false

    },
    completedAt: {
        // type will be a unix number
        // starting from 1970. 
        // -1 = backwards from 1970
        // 123 = 2 years from the year 1970 
        // Number = similar to int
        type: Number,
        default: null

    }
});


module.exports = {
    Todo
};