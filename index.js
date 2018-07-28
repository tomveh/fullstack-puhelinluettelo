const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

morgan.token('json', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :json :status :res[content-length] - :response-time ms'))


app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => persons.map(Person.format))
    .then(result => res.json(result))
    .catch(console.log)
})

app.get('/api/persons/:id', (req, res) => {
  Person.find({
    _id: req.params.id,
  })
    .then((result) => {
      const person = result[0]

      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send({
        error: 'malformatted id',
      })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(() => {
      res.status(400).send({
        error: 'malformatted id',
      })
    })
})

app.put('/api/persons/:id', (req, res) => {
  Person.findByIdAndUpdate(req.params.id, req.body)
    .then((result) => {
      res.json(Person.format(result))
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send({
        error: 'malformatted id',
      })
    })
})

app.post('/api/persons/', (req, res) => {
  const person = req.body

  let err
  if (!person.name) {
    err = 'name must not be blank'
  } else if (!person.number) {
    err = 'number must not be blank'
  }

  if (err) { // invalid input
    res.status(400).json({
      error: err,
    })
  } else {
    Person.find({ name: person.name })
      .then((result) => {
        if (result.length) { // name exists in db
          res.status(409).send({ // 409 CONFLICT
            error: `Person ${person.name} already exists`,
          })
        } else { // does not exist in db
          new Person(person).save()
            .then((result2) => {
              res.json(Person.format(result2))
            })
            .catch(console.log)
        }
      })
      .catch(console.log)
  }
})

app.get('/info', (res) => {
  Person.find({})
    .then(result => res.send(`<p>puhelinluettelossa ${result.length} henkilön tiedot</p><p>${new Date().toUTCString()}</p>`))
    .catch(console.log)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
