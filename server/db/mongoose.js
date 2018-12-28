const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const localDB = 'mongodb://offiahchiaz:myogi2014@ds143594.mlab.com:43594/recipe';
mongoose.connect(process.env.MONGODB_URI || localDB, {useNewUrlParser: true});

module.exports = {mongoose};