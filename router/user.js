const express = require('express')
const Result = require('../models/Result')
const {login,findUser} = require('../services/user')
const { md5 , decode } = require('../utils')
const {PWD_SALT,PRIVATE_KEY,JWT_EXPIRED} = require('../utils/constant')
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')

const router = express.Router()


router.get('/info',(req, res, next)=>{
  const decoded= decode(req)
  if(decoded && decoded.username){
       findUser({username:decoded.username}).then(user => {
      if(user){
        user.roles = [user.role]
        new Result(user,'用户信息查询成功').success(res)
      }else{
        new Result('用户信息查询失败').fail(res)
      }
    })
    //res.json('...info')
  }
  
})

router.post('/login',
[
  body('username').isString().withMessage('用户名必须为字符'),
  body('password').isString().withMessage('密码必须为字符'),
],
(req,res) => {
  //增加一层表单校验
  const err = validationResult(req)
  if(!err.isEmpty()){
    const [{ msg }] = err.errors
    next(boom.badRequest(msg))
  }else{
    let { username , password } = req.body
    password = md5(`${password}${PWD_SALT}`)
    login(username,password).then(user => {
      if(!user || user.length === 0){
        new Result('登录失败').fail(res)
      }else{
        const [_user] = user
        const token = jwt.sign(
          { username },
          PRIVATE_KEY,
          {expiresIn: JWT_EXPIRED}
        )
        new Result({ token },'登录成功').success(res)
      }
    })
  }
})

module.exports = router