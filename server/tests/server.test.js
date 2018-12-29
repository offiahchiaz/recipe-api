const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const Recipe = require('./../models/recipe');

// Testing lifecycle method
const recipes = [{
    _id: new ObjectID(),
    title: 'Banga soup'
}, {
    _id: new ObjectID(),
    title: 'Afang soup'
}];

beforeEach((done) => {
    Recipe.deleteMany({}).then(() => {
        Recipe.insertMany(recipes);
    }).then(() => done());
});

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

                Recipe.find({title}).then((recipes) => {
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
                    expect(recipes.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
}); 

describe('GET /recipes', () => {
    it('should get all recipes', (done) => {
        request(app)
            .get('/recipes')
            .expect(200)
            .expect((res) => {
                expect(res.body.recipes.length).toBe(2)
            })
            .end(done);
    });
});

describe('GET /recipes/:id', () => {
    it('should return recipe doc', (done) => {
        request(app)
            .get(`/recipes/${recipes[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.recipe.title).toBe(recipes[0].title);
            })
            .end(done);
    });

    it('should return a 404 if recipe not found', (done) => {
        let hexId = new ObjectID().toHexString();

        request(app)
            .get(`/recipes/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return a 404 for non-object ids', (done) => {
        request(app)
            .get('/recipes/wxyz456')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /recipes/:id', () => {
    it('should remove a recipe', (done) => {
        let hexId = recipes[1].title.toHexString();

        request(app)
            .delete(`/recipes/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.recipe._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Recipe.findByIdAndRemove(hexId).then((recipe) => {
                    expect(recipe).toBeFalsy();
                    done();
                }).catch((e) => {
                    return done(e);
                });
            });
    });

    it('should return 404 if recipe not found', (done) => {
        let hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/recipes/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .delete('/recipes/wxyz456')
            .expect(404)
            .end(done);
    });
})