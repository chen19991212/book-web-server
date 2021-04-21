const mysql = require('mysql')
const config = require('./config')
const {debug}  = require('../utils/constant')

function connect(){
  return mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
  })
}

function querySql(sql) {
  const conn = connect()
  debug && console.log(sql);
  return new Promise((resolve,reject) => {
    try{
      conn.query(sql,(err,res) => {
        if(err){
         // debug && console.log('查询失败，原因：' + JSON.stringify(err));
          reject(err)
        }else{
          debug && console.log('查询成功' , JSON.stringify(res));
          resolve(res)
        }
      })
    }catch(e){
      reject(e)
    }finally{
      conn.end()
    }
  })
}

function queryOne(sql){
  return new Promise((resolve,reject) => {
    querySql(sql).then(res => {
      if(res && res.length > 0){
        resolve(res[0])
      }else{
        resolve(null)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

module.exports = {querySql,queryOne}