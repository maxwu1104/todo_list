// require
const express = require('express')
const mongoose = require('mongoose')
const { engine } = require('express-handlebars')
const Todo = require('./models/todo')

const app = express()
const port = 3000

////setting view engine with handlebars
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', './views')

////setting DB
// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected')
})

//setting router
app.get('/', (req, res) => {
  // get all todo data
  Todo.find()
    .lean()
    .then((todos) => res.render('index', { todos }))
    .catch((error) => console.error(error))
})

//start and listen the server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
