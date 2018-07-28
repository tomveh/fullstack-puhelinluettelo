const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const url = process.env.MONGODB_URI;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

personSchema.statics.format = function(p) {
    const formattedPerson = { ...p._doc, id: p._id };
    delete formattedPerson._id;
    delete formattedPerson.__v;

    return formattedPerson;
};

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
