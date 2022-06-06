const mongoose = require('mongoose');

const Teacher = mongoose.model('Teacher', {
    name: String,
    cpf: Number,
    matricula: Number,
    materia: String,
})

module.exports = Teacher