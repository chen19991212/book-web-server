const Book = require('../models/Book')
const db = require('../db')
const _ = require('lodash')
const { identity } = require('lodash')

function exists(book){
  const { title, author, publisher } = book
  const sql = `select * from book where title='${title}' and 
    author='${author}' and publisher='${publisher}'`
  return db.queryOne(sql)
}

function removeBook(book){
  if(book){
    book.reset()
    if(book.fileName){
      const removeBookSql = `delete from book where fileName='${book.fileName}'`
      const removeContentsSql = `delete from contents where fileName='${book.fileName}'`
      db.querySql(removeBookSql)
      db.querySql(removeContentsSql)
    }
  }
}

function insertContents(book){
  const contents = book.getContents()
  if(contents && contents.length > 0){  
    for(let i=0;i<contents.length;i++){
      const content = contents[i]
      const _content = _.pick(content,[
        'fileName',
        'id',
        'href',
        'order',
        'level',
        'label',
        'pid',
        'navId'
      ])
      //console.log(_content);
      db.insert(_content,'contents')
    }
  }
}

function inserBook(book) {
  return new Promise(async (resolve,reject) => {
    try{
      if(book instanceof Book){
        const result = await exists(book)
        if(result){
          await removeBook(book)
          reject(new Error('电子书已存在'))
        }else{
          await db.insert(book.toDb(),'book')
          await insertContents(book)
          resolve()
        }
      }else{
        reject(new Error('添加图书不合法'))
      }
    }catch(e){
      reject(e)
    }
  })

}


module.exports = {inserBook}