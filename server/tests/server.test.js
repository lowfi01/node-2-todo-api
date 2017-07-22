// comments code at the very bottom - is older version of the code

const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');
const _ = require('lodash');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {mongoose} = require('./../db/mongoose');

const {todos, populateTodos, populateUsers, users} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
          .post('/todos')
          .send({text})
          .expect(200)
          .expect((res) => {
            expect(res.body.text).toBe(text);
          })

          .end((err, res) => {
            if (err) {
                done(err);
            }

            // only .find({objects with this value})
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);  
                expect(todos[0].text).toBe(text);  
                done();
            }).catch((e) => done(`test failed within last test block: ${e}`));
          });
        

    });

    it('should not create todo with invalid body data', (done) => {
            
            request(app)
                .post('/todos')
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.find().then((todos) => {
                        // should have 2 - documents as we are passing 2 dummy objects to collection
                        expect(todos.length).toBe(2);
                        done();
                    }).catch((e) => done(e));
                });
        });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        // supertest request
        request(app)
            .get('/todos')
            // status check
            .expect(200)
            .expect((res) => {
                // console.log - shows something similar view to API JSON object 
                // note the array [{0},{1}]
                // res.body { todos [{ todo 1}, {todo 2}]}
                // res.body.todos [{ todo 1}, {todo 2}]
                //console.log('res.body:  ',res.body);
                //console.log('res..body.todos: ', res.body.todos);
                expect(res.body.todos.length).toBe(2);
            })
            // we do not need to attach function to .end
            .end(done);
    });
});

// challenge 
// test invalid ObjectId - send 404
// test valid id, but does not match doc - send 404
// test valid id & match's doc - doc is returned in response body

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            // use _id from todo array & convert to string, using .toHexString()
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                // note - we passed a {doc} property in this route
                expect(res.body.doc.text).toBe(todos[0].text);
            })
            .end(done)
    });

    it('should return 404 if todo not found',(done) => {
        // use valid id and make invalid
        // make sure to get 404 back
        
        request(app)
            // create new ObjectId to ensure fail 
            .get(`/todos/${new ObjectId().toHexString}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done)
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                console.log(res.body.doc);
                expect(res.body.doc._id).toBe(hexId);
            })
            //query the database
            .end((err, res) => {
                if (err) {
                    // mocha will render error
                    console.log('err fail');
                    return done(err);
                }

                // query database - using findById, it should fail
                // toNotExist
                Todo.findById(hexId).then((doc) => {
                    expect(doc).toNotExist();
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should return 404 if todo not found', (done) => {

        request(app)
            .delete(`/todos/${new ObjectId().toHexString}`)
            .expect(404)
            .end(done);
    });


    it('should return 404 if object id is invalid', (done) => {
           request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    });

});

//Challenge - create patch testing
//check one todo not completed & make it complete
//check one todo that's completed & make it not complete
describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab id of first todo
        var hexId = todos[0]._id.toHexString();
        // make patch require - send
        var testText = "Hello World";

        request(app)
            .patch(`/todos/${hexId}`)
        // update text, set completed true
            .send({
                text: testText,
                completed: true
            })
        // assert 200, 
            .expect(200)
            .expect((res) => {
                //console.log(res.body.doc);
                //res.body.doc = { set: { test = testText } };
                expect(res.body.doc.text).toBe(testText);
                expect(res.body.doc.completedAt).toBeA('number');
                expect(res.body.doc.completed).toBe(true);
            })
        // custom assertion, response body: text is changed, completed is true, completedAt is a number toBeA
            .end(done)
    });

    it('should clear completedAt when todo is not complete', (done) => {
        // grab id of second todo
        var hexId = todos[1]._id.toHexString();
        var text = "Hello World Again";
        // update text, set completed to false
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text: text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                var url = res.body.doc;
                expect(url.text).toBe(text);
                expect(url.completed).toBe(false);
                expect(url.completedAt).toNotExist();
            })
            .end(done);
        // customer assertion, text is changed , completed is false, completed at is null toNotExist 
    });
});

describe('GET /users/me', () => {
    // done = asynchronous test
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            //set header (remember we set jwts token as authentication method)
            .set('x-auth', users[0].tokens[0].token)
            //once authentication is proven - expect 200 status
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
        });


    it('should return a 401 if not authenticated', (done) => {
        // challenge
        // do not provide x-auth token & 
        // expect 401 status
        // expect body is empty object
        request(app)
            .get('/users/me')
            // expect 401 as we do not pass valid auth
            .expect(401)
            .expect((res) => {
                //console.log('this is the body', res.body);
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'validAsf@example.com';
        var password = 'validMe';


        request(app)
            .post('/users')
            .send({
                email : email,
                password: password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body.email).toBe(email);
                expect(res.body._id).toExist();

            })
            // arrow function to make a call to database & create test cases for database information
            .end((err) => {
                if (err) {
                    return done(err);
                };
                User.findOne({email: email}).then((doc) => {
                    expect(doc).toExist();
                    expect(doc.email).toBe(email);
                    // remember the password should have been hashed, so password should not match
                    expect(doc.password).toNotBe(password);
                    done();
                }).catch((e) => {
                    // if error within database, then return that error msg
                    done(e)})

            });
    });

    it('should a return validation errors if request invalid', (done) => {
        // challenge
        // send invalid email, password
        // expect 400
         var email = 'invalidEmail';
         var password = '12345';

         request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    });

    it('should not create user if email in use', (done) => {
        // challenge
        // send email we have already used 
        // expect 400
        request(app)
            .post('/users')
            .send({email : users[0].email})
            .expect(400)
            .end(done);

    });
});


describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            // use this route
            .post('/users/login')
            // send this data with request
            .send({
                email: users[1].email,
                password: users[1].password
            })
            // request worked
            .expect(200)
            // request data - has keyValue custom header['x-auth']
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            // check database - this is post creation of user
            .end((err, res) => {
                // if err - return done with error msg
                if (err) {
                    return done(err);
                }
                // find user & expect user document to be returned
                User.findById({_id: users[1]._id}).then((user) => {
                    // expect that user has these values
                    expect(user.tokens[0]).toInclude({
                        access : 'auth',
                        token : res.headers['x-auth']
                    });
                    done();
                }).catch((e) => {
                    // if error within database, then return that error msg
                    done(e);
                })
            });
    });

    it('should reject invalid login', (done) => {
        
        request(app)
            .post('/users/login')
            .send({
                email : users[1].email,
                password : users[1].password + '1'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
        .end((err, res) => {
                // if err - return done with error msg
                if (err) {
                    return done(err);
                }
                // find user & expect user document to be returned
                User.findById({_id: users[1]._id}).then((user) => {
                    // expect that user has these values
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });
});

/// - old code with comments

// // create seed data - to beforeEach 
// // create array of dummy todos
// const todos = [{
//     // create object id for testing
//     _id:  new ObjectId(),
//     text: 'First test todo'
// }, {
//     _id:  new ObjectId(),
//     text: 'Second test todo',
//     completed: true,
//     completeAt: 333
// }];


// beforeEach((done) => {
//    Todo.remove({}).then(() => {
//         // this will insert test array into collection
//         // resulting - 2 documents
//         return Todo.insertMany(todos)
//     }).then(() => done());

// });

// // create seed data - to beforeEach 
// // create array of dummy todos
// const todos = [{
//     text: 'First test todo'
// }, {
//     text: 'Second test todo'
// }];


// //testing life cycle method - runs before every test case it();
// // method - will only end once done is called.
// beforeEach((done) => {
//     // // .remove({all objects})
//     // // .callback - will call done();
//     Todo.remove({}).then(() => done());
   
// });

// //describe block - (groups tests)
// describe('POST /todos', () => {

//     // done - async testing(supertest feature)
//     it('should create a new todo', (done) => {
//         // pass string through .send()
//         var text = 'Test todo text';

//         request(app)
//           .post('/todos')
//           // super test will convert to {object} to JSON
//           .send({text})
//           // status check
//           .expect(200)
//           // custom expect calls return a response
//           .expect((res) => {
//               // use response to expect - body (object) - text (fromObject)
//               // .toBe - the same as text variable passed with .send({text})
//             expect(res.body.text).toBe(text);
//           })

//           // pass done if you do not need to check anything
//           // pass function - to check model & errors
//           .end((err, res) => {
//             if (err) {
//                 // if error - end & return error
//                 done(err);
//             }
//             // if no error - .find(fetch everything from this collection)
//             // call back - returns the todo collection
//             Todo.find().then((todos) => {
//                 expect(todos.length).toBe(0);  
//                 //console.log(todos[0]);
//                 expect(todos[0].text).toBe(text);  
//                 done();
//                 //.catch will check if this block of code results in error
//             }).catch((e) => done(`test failed within last test block: ${e}`));
//           });
        

//     });

//     it('should not create todo with invalid body data', (done) => {
            
//             request(app)
//                 .post('/todos')
//                 .send({})
//                 .expect(400)
//                 .end((err, res) => {
//                     if (err) {
//                         return done(err);
//                     }

//                     Todo.find().then((todos) => {
//                         expect(todos.length).toBe(1);
//                         done();
//                     }).catch((e) => done(e));
//                 });
//         });
// });
