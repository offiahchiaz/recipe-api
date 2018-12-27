const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const Recipe = require('./../models/recipe');

// Testing lifecycle method
beforeEach((done) => {
    Recipe.deleteMany({}).then(() => done());
})

describe('POST /recipes', () => {
    it('should create a new recipe', (done) => {
        let title = 'Test recipe title';

        request(app)
            .post('/recipes')
            .send({title})
            .expect(200)
            .expect((res) => {
                expect(res.body.title).toBe(title);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                } 

                Recipe.find().then((recipes) => {
                    expect(recipes.length).toBe(1);
                    expect(recipes[0].title).toBe(title);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a recipe with invalid body', (done) => {
        request(app)
            .post('/recipes')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Recipe.find().then((recipes) => {
                    expect(recipes.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
}); 