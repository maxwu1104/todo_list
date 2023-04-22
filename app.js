// require express framework
const express = require('express')
const app = express()

// require middleware in this project
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')

// require project internal files
const routes = require('./routes')
const usePassport = require('./config/passport')
require('./config/mongoose')

// setting view engine with handlebars
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', './views')

// always through here
app.use(
  session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true
  })
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// user authentication function
usePassport(app)

// setting router
app.use(routes)

// start and listen the server
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
