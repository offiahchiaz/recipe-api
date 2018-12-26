const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://offiahchiaz:myogi2014@ds143594.mlab.com:43594/recipe', {useNewUrlParser: true});

module.exports = {mongoose};