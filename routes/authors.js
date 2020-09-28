const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
      searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
      const authors = await Author.find(searchOptions) // find all documents that match the query. 
      res.render('authors/index', {
        authors: authors,
        searchOptions: req.query
      })
    } catch {
      res.redirect('/')
    }
  })


    // New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
  })


// POST for creation. Create Author Route
router.post('/', async (req, res) => {
    const author = new Author({
      name: req.body.name
    })
    try {
      const newAuthor = await author.save()
      res.redirect(`authors/${newAuthor.id}`)
    } catch {
      res.render('authors/new', {
        author: author,
        errorMessage: 'Error creating Author'
      })
    }
  })

  // show
  router.get('/:id', async(req, res) => { // needs to be defined after /new route. Server goes from top to bottom. There could be an author called new?
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find( { author: author.id}).limit(6)
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
  })



  router.get('/:id/edit', async(req, res) => {
      try{
          const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author})
      } catch{
          res.redirect('/authors')
      }
  }) // following REST principles


  // update route
  router.put('/:id', async(req, res) => {
    let author
      try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${newAuthor.id}`)
      } catch {
          if (author == null) {
              res.redirect('/')
          } else {
        res.render('authors/new', {
          author: author,
          errorMessage: 'Error Updating Author'
        
          })
        }
      }
  }) 

  router.delete('/:id', async(req, res) => {
      // method-override library allows us to use put and delete requests. 
      // From a browser you can only do GET and POST requests. We can take a POST form  send it to server with special 
      // parameter that tells us whether we are doing PUT or delete and server does this
      // never use GET for deleting otherwise google will go to every single GET route and delete everything on the route
      // so use POST within a form - method-override will override this as a delete
    let author
    try {
      author = await Author.findById(req.params.id)
      await author.remove() // deletes author from database
      res.redirect('/authors')
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
      }
    })
module.exports = router //we need to export this router so that server can use it