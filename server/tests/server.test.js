const expect = require('expect');
const request = require('supertest');

// local libs - es6 de-structuring
// note - ./.. (.relativePath/..goBackOneFolder)
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {mongoose} = require('./../db/mongoose');



//testing life cycle method - runs before every test case it();
// method - will only end once done is called.
beforeEach((done) => {
    // .remove({all objects})
    // .callback - will call done();
    Todo.remove({}).then(() => done());
});

//describe block - (groups tests)
describe('POST /todos', () => {

    // done - async testing(supertest feature)
    it('should create a new todo', (done) => {
        // pass string through .send()
        var text = 'Test todo text';

        request(app)
          .post('/todos')
          // super test will convert to {object} to JSON
          .send({text})
          // status check
          .expect(200)
          // custom expect calls return a response
          .expect((res) => {
              // use response to expect - body (object) - text (fromObject)
              // .toBe - the same as text variable passed with .send({text})
            expect(res.body.text).toBe(text);
          })

          // pass done if you do not need to check anything
          // pass function - to check model & errors
          .end((err, res) => {
            if (err) {
                // if error - end & return error
                done(err);
            }
            // if no error - .find(fetch everything from this collection)
            // call back - returns the todo collection
            Todo.find().then((todos) => {
                expect(todos.length).toBe(1);  
                //console.log(todos[0]);
                expect(todos[0].text).toBe(text);  
                done();
                //.catch will check if this block of code results in error
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
                        expect(todos.length).toBe(0);
                        expect(todos[0]).toBe(undefined);
                        done();
                    }).catch((e) => done(e));
                });
        });
});
