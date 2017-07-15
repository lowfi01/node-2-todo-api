// comments code at the very bottom - is older version of the code

const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {mongoose} = require('./../db/mongoose');

// create seed data - to beforeEach 
// create array of dummy todos
const todos = [{
    // create object id for testing
    _id:  new ObjectId(),
    text: 'First test todo'
}, {
    _id:  new ObjectId(),
    text: 'Second test todo'
}];


beforeEach((done) => {
   Todo.remove({}).then(() => {
        // this will insert test array into collection
        // resulting - 2 documents
        return Todo.insertMany(todos)
    }).then(() => done());

});

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

describe('GET / todos', () => {
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
    })
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
            .end(done)
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done)
    });
});


/// - old code with comments

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
