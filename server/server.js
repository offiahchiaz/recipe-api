const _ = require('lodash');
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

app.patch('/recipes/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['title', 'cookingStep', 'ingredient']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }


    if (body.ingredient === undefined) {
        body.summary = null;
    } else {
        let ingredientArray = [];
    
        let found = body.ingredient.filter((item) => {
        ingredientArray.push(item.isAvailable)
        return ((item.isAvailable === true));
        });

        if (found.length === ingredientArray.length) {
            body.summary = 'You have all the ingrdients';
        } else {
            body.summary = 'You only have some of the ingredients';
        }
    }

    Recipe.findByIdAndUpdate(id, {$set: body}, {new: true}).then ((recipe) => {
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