// require
const express = require('express')
const mongoose = require('mongoose')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
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

//always through here
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//setting router
app.get('/', (req, res) => {
  // get all todo data
  Todo.find()
    .lean()
    .sort({ _id: 'asc' })
    .then((todos) => res.render('index', { todos }))
    .catch((error) => console.error(error))
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name
  const todo = new Todo({ name })

  return todo
    .save()
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch((error) => console.log(error))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch((error) => console.log(error))
})

app.put('/todos/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findById(id)
    .then((todo) => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => {
      res.redirect(`/todos/${id}`)
    })
    .catch((error) => console.log('error'))
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then((todo) => todo.deleteOne())
    .then(() => res.redirect('/'))
    .catch((error) => console.log('error'))
})

//start and listen the server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
