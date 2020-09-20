if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')


const indexRouter = require('./routes/index')  // ./ - relative to where we are. Set the indexRouter to router in index.js

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout') // Every file is put in layout, so that we don't have to duplicate all HTML such as header and footer
app.use(expressLayouts)
app.unsubscribe(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
useNewUrlParser: true,
useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter) // tell our app to use our indexRouter

app.listen(process.env.PORT || 3000)

