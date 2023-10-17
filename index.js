const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

let persons = [
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
const PORT = process.env.PORT || 3001;

const generateId = () => Math.floor(Math.random() * 10_000);

app.use(express.json());
app.use(cors());
morgan.token('body', (req, res) => {
    const body = JSON.stringify(req.body);
    return body !== '{}' ? body : '-';
});
app.use(morgan(':method :url :status - :response-time ms :body'));

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
        return;
    }

    const person = persons.find((p) => p.id === id);
    if (person !== undefined) {
        res.json(person);
    } else {
        res.statusMessage = `Person with id: ${id} was not found.`;
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.statusMessage = 'Id must be a number.';
        res.status(400).end();
        return;
    }

    if (persons.find((p) => p.id === id) === undefined) {
        res.statusMessage = `Can not delete. Person with id: ${id} does not exist.`;
        res.status(404).end();
        return;
    }

    persons = persons.filter((p) => p.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name) {
        res.status(400).json({
            error: "Missing attribute 'name'.",
        });
        return;
    }
    if (!body.number) {
        res.status(400).json({
            error: "Missing attribute 'number'.",
        });
        return;
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    };
    if (
        persons.find((p) => p.name.toLowerCase() === person.name.toLowerCase())
    ) {
        res.status(400).json({
            error: 'Name attribute must be unique.',
        });
        return;
    }
    if (persons.find((p) => p.number === person.number)) {
        res.status(400).json({
            error: 'Number attribute must be unique.',
        });
        return;
    }

    persons = [...persons, person];
    res.json(person);
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
