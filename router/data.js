const express = require('express')
const Result = require('../models/Result')
const dataService = require('../services/dataService')
const boom = require('boom')

const router = express.Router()

router.get('/visits',(req,res,next) => {
  let data = dataService.getVisitsData()
  new Result(data,'请求数据成功').success(res)
})

router.get('/category',(req,res,next) => {
  let data = dataService.getCategoryData()
  new Result(data,'请求数据成功').success(res)
})

router.get('/record',(req,res,next) => {
  dataService.getRecordData().then(data => {
    //console.log('record',res);
    new Result(data,'请求数据成功').success(res)
  })
})

module.exports = router