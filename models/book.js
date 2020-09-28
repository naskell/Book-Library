const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImage: {
    type: Buffer, // file is now stored inside the database
    required: true
  },
  coverImageType: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  }
})

bookSchema.virtual('coverImagePath').get(function() { // lets us access it anywhere. derives its value from the schema variables. When book.coverImagePath is called, it gets the coverImageName. Normal function as we need access to this. Don't use arrow function
  if (this.coverImage != null && this.coverImageType != null) { // if there's a path
    return `data:${this.coverImageType};charset=utf-8;base64, ${this.coverImage.toString('base64')}` // append the cover filename to the basepath. `` is a template string so we can use variables
  }
})

module.exports = mongoose.model('Book', bookSchema)