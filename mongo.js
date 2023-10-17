const mongoose = require('mongoose');

const argLength = process.argv.length;
let mode;
if (argLength === 5) {
    mode = 'ADD';
} else if (argLength === 3) {
    mode = 'GET';
} else {
    console.error(
        '[ERR] usage: node mongo.js [<password> <name> <number> || <password>]'
    );
    process.exit(1);
}

const PW = mode === 'GET' ? process.argv[2] : process.argv[4];
const URL = `mongodb+srv://FSO-DegenOne:${PW}@fso.j6mgr1l.mongodb.net/phonebookDB?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(URL);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (mode === 'ADD') {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3],
    });

    person.save().then(() => {
        console.log(`added ${person.name} ${person.number} to phonebook`);
        mongoose.connection.close();
    });
} else if (mode === 'GET') {
    Person.find({}).then((res) => {
        console.log('Phonebook:');
        res.forEach((person) => console.log(`${person.name} ${person.number}`));
        mongoose.connection.close();
    });
} else {
    console.error('[ERR] should be unreachable.');
    mongoose.connection.close();
}
