//user models

var mongoose = require(`mongoose`);



//mongoose.model = create new User model (date-base collection)
var User = mongoose.model(`User`,{
    email: {
        required: true,
        trim: true,
        minlength: 1,
        type: String
    }
});


module.exports = {
    User
};