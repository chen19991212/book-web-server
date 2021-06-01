const express = require('express')
const multer = require('multer')  //处理文件上传中间件
const {UPLOAD_PATH} = require('../utils/constant')
const Result = require('../models/Result')
const Book = require('../models/Book')
const boom = require('boom')
const { decode } = require('../utils')
const bookService = require('../services/bookService')
const dataService = require('../services/dataService')

const router = express.Router()

//文件上传接口
router.post(
  '/upload', 
  multer({ dest: `${UPLOAD_PATH}/book` }).single('file'),
  (req,res,next) => {
    if(!req.file || req.file.length === 0){
      new Result('上传电子书失败').fail(res)
    }else{
      const book = new Book(req.file)
      book.parse().then(book => {
        console.log('book',book);
        new Result(book,'上传电子书成功').success(res)
      }).catch(err => {
        next(boom.badImplementation(err))
      })
      
    }
})
//添加电子书
router.post(
  '/create',
  (req,res,next) => {
    const decoded = decode(req)
    if (decoded && decoded.username){
      req.body.username = decoded.username
    }
    const book = new Book(null,req.body)
    bookService.inserBook(book).then(() => {
      dataService.insertRecord('新增',book.title,decoded.username)
      new Result('添加电子书成功').success(res)
    }).catch(err => {
      next(boom.badImplementation(err))
    })
  }
)
router.post(
  '/update',
  (req,res,next) => {
    const decoded = decode(req)
    if (decoded && decoded.username){
      req.body.username = decoded.username
    }
    const book = new Book(null,req.body)
    bookService.updateBook(book).then(() => {
      dataService.insertRecord('更新',book.title,decoded.username)
      new Result('更新电子书成功').success(res)
    }).catch(err => {
      next(boom.badImplementation(err))
    })
  }
)
//获取电子书信息
router.get('/get',(req,res,next) => {
  const {fileName} = req.query
  if(!fileName){
    next(boom.badRequest(new Error('参数fileName不能为空')))
  }else{
    bookService.getBook(fileName).then(book => {
      new Result(book,'获取图书信息成功').success(res)
    }).catch(err => {
      next(boom.badImplementation(err))
    })
  }
})

//获取分类信息
router.get('/category',(req,res,next) => {
  bookService.getCategory().then(category => {
    new Result(category,'获取分类成功').success(res)
  }).catch(err => {
    next(boom.badImplementation(err)) 
  }) 
})
//获取图书列表
router.get('/list',(req,res,next) => {
  bookService.listBook(req.query).then(({ list, count, page, pageSize }) => {
    new Result({ list, count, page, pageSize },'获取图书列表成功').success(res)
  }).catch(err => {
    next(boom.badImplementation(err)) 
  }) 
})
//删除电子书
router.get('/delete',(req,res,next) => {
  const {fileName,title} = req.query
  const decoded = decode(req)
  if(!fileName){
    next(boom.badRequest(new Error('参数fileName不能为空')))
  }else{
    bookService.deleteBook(fileName).then(() => {
      dataService.insertRecord('删除',title,decoded.username)
      new Result('删除图书信息成功').success(res)
    }).catch(err => {
      next(boom.badImplementation(err))
    })
  }
})

router.post('/remove',(req,res,next) => {
  const book = new Book(null,req.body)
  book.reset()
})
module.exports = router