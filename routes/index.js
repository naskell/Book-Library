const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req, res) => {
  let books
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec() // sorted in descending order and limited to top 10 books - executed to find all books and return 10
  } catch {
    books = [] // empty array
  }
  res.render('index', { books: books })
})

module.exports = router //we need to export this router so that server can use it