const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const Recipe = require('./models/recipe');

const app = express();

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

app.listen(5000, () => {
    console.log('Server running on port 5000');
});

module.exports = {app};