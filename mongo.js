const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String,
})

const [name, number] = process.argv.slice(2)

if (name && number) {
  new Person({
    name,
    number
  }).save()
    .then(() => {
      console.log('person saved!')
      mongoose.connection.close()
    })
    .catch(console.log)
} else {
  Person.find({})
    .then(result => {
      result.forEach(console.log)
      mongoose.connection.close()
    })
    .catch(console.log)
}
