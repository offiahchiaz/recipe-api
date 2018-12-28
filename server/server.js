const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const Recipe = require('./models/recipe');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.post('/recipes', (req, res) => {
    let recipe = new Recipe({
        title: req.body.title,
        summary: req.body.summary,
        cookingStep: req.body.cookingStep,
        ingredient: req.body.ingredient
    });

    recipe.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/recipes', (req, res) => {
    Recipe.find().then((recipes) => {
        res.send({recipes});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/recipes/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Recipe.findById(id).then((recipe) => {
        if (!recipe) {
            return res.status(404).send();
        }
        res.send({recipe});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/recipes/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Recipe.findByIdAndRemove(id).then((recipe) => {
        if (!recipe) {
            return res.status(404).send();
        }
        res.send({recipe});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = {app};