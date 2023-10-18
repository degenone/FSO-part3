require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const Person = require('./models/person');
const app = express();

// middleware
morgan.token('body', (req, res) => {
    const body = JSON.stringify(req.body);
    return body !== '{}' ? body : '-';
});

const unknownEndpoint = (req, res) =>
    res.status(404).send({ error: 'unknown endpont' });

const errorHandler = (e, req, res, next) => {
    console.table({ message: e.message, name: e.name });

    if (e.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }

    next(e);
};

// usings
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(':method :url :status - :response-time ms :body'));

// routes
app.get('/info', (req, res, next) => {
    const options = {
        second: 'numeric',
        minute: 'numeric',
        hour: 'numeric',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    Person.find({})
        .then((persons) => res.send(
            `<p>Phonebook has info for ${persons.length} ${
                persons.length === 1 ? 'person' : 'people'
            }</p><p>${new Date().toLocaleString('fi-FI', options)}</p>`
        ))
        .catch((e) => next(e));
});

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then((persons) => res.json(persons))
        .catch((e) => next(e));
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then((person) => res.json(person))
        .catch((e) => next(e));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then((qr) => res.status(204).end())
        .catch((e) => next(e));
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    if (!body.name) {
        return res.status(400).json({
            error: "Missing attribute 'name'.",
        });
    }
    if (!body.number) {
        return res.status(400).json({
            error: "Missing attribute 'number'.",
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });
    person
        .save()
        .then((newPerson) => res.json(newPerson))
        .catch((e) => next(e));
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;
    const person = {
        name: body.name,
        number: body.number,
    };
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then((updatedPerson) => res.json(updatedPerson))
        .catch((e) => next(e));
});

// usings
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
