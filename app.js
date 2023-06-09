// require express framework
const express = require('express')
const app = express()

// require middleware in this project
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// require project internal files
const routes = require('./routes')
const usePassport = require('./config/passport')
require('./config/mongoose')

// setting view engine with handlebars
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// always through here
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// user authentication function
usePassport(app)

app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning_msg 訊息
  next()
})

// setting router
app.use(routes)

// start and listen the server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
