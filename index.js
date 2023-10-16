const express = require('express');
const app = express();

const persons = [
    {
        name: 'Arto Hellas',
        number: '040-123-456',
        id: 1,
    },
    {
        name: 'Ada Lovelace',
        number: '394 453 2523',
        id: 2,
    },
    {
        name: 'Dan Abramov',
        number: '124-323-4345',
        id: 3,
    },
    {
        name: 'Mary Poppendieck',
        number: '392 364 2122',
        id: 4,
    },
    {
        name: 'Tero Kilpeläinen',
        number: '040 987 6543',
        id: 5,
    },
    {
        name: 'Matti Meikeläinen',
        number: '349 925 2341',
        id: 6,
    },
];
const PORT = 3001;

app.get('/', (req, res) => res.send('<h1>Hello from the Phonebook!</h1>'));

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
