const {User} = require('./../models/user');


// Middleware for authentication
// this will return a modified req object - so when called by another route they simple use .req
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        };

        // this will set - req.user to the user we found
        // this will set - req.token to the token we passed
        req.user = user;
        req.token = token;
        // ends middle ware and runs route calls, code block
        next();
    }).catch((e) => {
        res.status(401).send('Auth Failed')
        console.log(e);
    });
};

module.exports = {authenticate};