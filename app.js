// require external package
const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// require project internal files
const routes = require('./routes')
require('./config/mongoose')

const app = express()

////setting view engine with handlebars
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', './views')

//always through here
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//setting router
app.use(routes)

//start and listen the server
app.listen(3000, () => {
  console.log(`App is running on http://localhost:3000`)
})
