const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    summary: {
        type: String,
        default: null
    },
    cookingStep: {
        type: String,
        default: null
    },
    ingredient: [{
        name: {
            type: String,
            default: null
        },
        isAvailable: {
            type: Boolean,
            default: false
        } 
    }]
});

module.exports = mongoose.model('Recipe', RecipeSchema);