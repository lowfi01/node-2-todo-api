// destructuring
// 256 = number of bits from resulting hash
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};


// takes data - object & secret
// creates hash & returns the token value
var token = jwt.sign(data, '123abc'); 
console.log(token);


// takes the token & secret 
// verifies data was not manipulated 
// function will fail if token or secret is wrong
var decoded = jwt.verify(token, '123abc');
console.log(decoded);

// 
//  Note - the code below is the old code
//  json web token library does the creation & verification for us
//
// var message = "I am user number 3";
// // this will hash message variable & store within hash
// // note - result is object, so to string is required to read it
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// // output = this will convert message to a hashString
// // Message: I am user number 3
// // Hash: 9da4d19e100809d42da806c2b7df5cf37e72623d42f1669eb112e23f5c9d45a3



// var data = {
//     id: 4,
// };

// var token = {
//     data,
//     // note - SHA256 takes a string & we are passing object, requires conversion
//     // note - without .toString, data will be implicitly converted to string
//     // note - but .toString was a design decision by the crypto-js developers
//     //hash: SHA256(JSON.stringify(data)).toString()
//     // salting the hash
//     hash: SHA256(JSON.stringify(data) + 'someSecret').toString()
    
// };

// // how to prevent hackers from simply changing the data id property to 5 & rehash
// // Salting the hash
// // password + RandomStringValue

// token.data.id = 5;
// token.data.hash = SHA256(JSON.stringify(token.data)).toString();


// //validate that hash has not been manipulated using salt + secret string
// var resultHash = SHA256(JSON.stringify(token.data) + 'someSecret').toString();

// // check if the resultHash is the same as the token hash we receive
// if (resultHash === token.hash) {
//     console.log(`Data was not changed`);
// } else {
//     console.log(`Data was changed don't trust`)
// };


// // code example without es6 syntax
// // var token = {
// //     // note - this will set data equal to data object above
// //     data: data
// // };