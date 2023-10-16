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

app.get('/info', (req, res) => {
    const options = {
        second: 'numeric',
        minute: 'numeric',
        hour: 'numeric',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    res.send(
        `<p>Phonebook has info for ${persons.length} ${
            persons.length === 1 ? 'person' : 'people'
        }</p><p>${new Date().toLocaleString('fi-FI', options)}</p>`
    );
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.statusMessage = 'Id must be a number.';
        res.status(400).end();
    }

    const person = persons.find((p) => p.id === id);
    if (person !== undefined) {
        res.json(person);
    } else {
        res.statusMessage = `Person with id: ${id} was not found.`;
        res.status(404).end();
    }
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
