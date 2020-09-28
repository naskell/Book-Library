const mongoose = require('mongoose')
const Book = require('./book')
// MongoDB or NoSQL
const authorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  })

// pre runs any function before we remove an author
authorSchema.pre('remove', function(next){
  Book.find({ author: this.id }, (err, books) => {
    if (err){
      next(err)
    } else if (books.length > 0) {
      next(new Error('This author still has books'))
    } else {
      next() // ok, remove author. 
    }
  })
}) 
module.exports = mongoose.model('Author', authorSchema) // name of the table in the database