const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const path = require('path')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(cors())
require('./config/passport')(passport)

// Routes
const users = require('./users/routes')
const posts = require('./posts/routes')
const profiles = require('./profiles/routes')

// DB Config
const db = require('./config/keys').mongoURI

// Connect DB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('> Database connected'))
  .catch(err => console.log(err))

// Use Routes
app.use('/api/users', users)
app.use('/api/profiles', profiles)
app.use('/api/posts', posts)

// If none of these routes are hit, serve static files
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  // Send static files
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`> Listening on port ${PORT}`)
})
