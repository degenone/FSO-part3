const mongoose = require('mongoose');

const URL = process.env.MONGODB_URL;

mongoose.set('strictQuery', false);

console.log('connecting...');

mongoose
    .connect(URL)
    .then((res) => console.log('Connected to mongoDB.'))
    .catch((e) => console.log('[ERR] mongoDB connection failed', e.message));

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});
personSchema.set('toJSON', {
    transform: (doc, returnObj) => {
        returnObj.id = returnObj._id;
        delete returnObj._id;
        delete returnObj.__v;
    }
})

module.exports = mongoose.model('Person', personSchema);
