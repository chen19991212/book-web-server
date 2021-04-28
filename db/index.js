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

function insert(model,tableName){
  return new Promise((resolve,reject) => {
    //判断是否为一个对象
    if(Object.prototype.toString.call(model) !== '[object Object]'){
      reject(new Error('插入数据库失败，插入数据不是一个对象'))
    }else{
      const keys = []
      const values = []
      Object.keys(model).forEach(key => {
        if(model.hasOwnProperty(key)){
          keys.push(`\`${key}\``)
          values.push(`'${model[key]}'`)
        }
      })
      if(keys.length > 0 && values.length > 0){
        let sql = `INSERT INTO \`${tableName}\``
        const keysString = keys.join(',')
        const valuesString = values.join(',')
        sql = `${sql}(${keysString}) VALUES (${valuesString})`
        //console.log(sql);
        const conn = connect()
        try{
          conn.query(sql,(err,result) => {
            if(err){
              reject(err)
            }else{
              resolve(result)
            }
          })
        }catch(e){
          reject(e)
        }finally{
          conn.end()
        }
      }else{
        reject(new Error('插入数据失败，对象无属性'))
      }
    }
  })
}

module.exports = {
  querySql,
  queryOne,
  insert
}