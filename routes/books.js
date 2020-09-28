const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'] //supports these images

// All Books Route
router.get('/', async (req, res) => {
  // need to check if there's a book name similar to the search query and within the dates
  let query = Book.find() // let so that we can reassign the variable
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i')) // title from the model
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore) // less than or equal to 'lte'. Checks publish date - if a book is less then it will return it
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter) // greater than or equal to 'gte'. Checks publish date - if a book is after then it will return it
  }
  try {
    const books = await query.exec() // executes the query that we define above
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/') // back to home page if error
  }
})

// New Book Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})

// POST for creation. Create Book Route
router.post('/', async (req, res) => { //upload.single populates req with a file object. We use a string from filePond
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(book, req.body.cover)

  try {
    const newBook = await book.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`books`)
  } catch {
    // if (book.coverImageName != null) {
    //   removeBookCover(book.coverImageName)
    // }
    renderNewPage(res, book, true)
  }
})

// function removeBookCover(fileName) {
//   fs.unlink(path.join(uploadPath, fileName), err => { // use the filesystem to remove the book cover at its path. uploadPath is public/uploads/bookCovers
//     if (err) console.error(err) // no need to send error to user 
//   })
// }

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) params.errorMessage = 'Error Creating Book'
    res.render('books/new', params)
  } catch {
    res.redirect('/books')
  }
}

function saveCover(book, coverEncoded){
  // check if it is a valid variable
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64') // need to convert it to a buffer from base64 data as thats what filepond uses
    book.coverImageType = cover.type
  }
}

module.exports = router //we need to export this router so that server can use it