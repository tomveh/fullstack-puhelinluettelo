const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());

morgan.token('json', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :json :status :res[content-length] - :response-time ms'));


let persons = [{
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);

    res.status(204).end();
});

app.post('/api/persons/', (req, res) => {
    const person = req.body;
    person.id = Math.floor(Math.random() * 10000);

    let err;
    if (!person.name) {
        err = 'name must not be blank';
    } else if (!person.number) {
        err = 'number must not be blank';
    } else if (persons.find(p => p.name === person.name)) {
        err = 'name must be unique';
    }

    if (err) {
        res.status(400).json({
            error: err
        });
    } else {
        persons = persons.concat(person);
        res.json(person);
    }


});

app.get('/info', (req, res) => {
    res.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${new Date().toUTCString()}</p>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
