const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    marca: {
        required: true,
        type: String
    },    
    modelo: {
        required: true,
        type: String
    },
    odo: {
        required: true,
        type: String
    },
    ano: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Data', dataSchema)