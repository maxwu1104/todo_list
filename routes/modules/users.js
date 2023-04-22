const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'user/login'
  })
)

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/register', (req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  // 檢查使用者是否已經註冊
  User.findOne({ email })
    .then((user) => {
      // 如果已經註冊：退回原本畫面
      if (user) {
        console.log('User already exists.')
        res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      } else {
        // 如果還沒註冊：寫入資料庫
        return User.create({
          name,
          email,
          password
        })
          .then(() => res.redirect('/'))
          .catch((err) => console.log(err))
      }
    })
    .catch((err) => console.log(err))
})

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/users/login')
  })
})

module.exports = router
