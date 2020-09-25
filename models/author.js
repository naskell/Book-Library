const mongoose = require('mongoose')

// MongoDB or NoSQL
const authorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  })

module.exports = mongoose.model('Author', authorSchema) // name of the table in the database