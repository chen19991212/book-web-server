const Book = require('../models/Book')
const db = require('../db')
const _ = require('lodash')
const { identity, reject } = require('lodash')

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
        'text',
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

function updateBook(book){
  return new Promise(async (resolve,reject) => {
    try{
      if(book instanceof Book){
        const result = await getBook(book.fileName)
        if(result){
          const model = book.toDb()
          if(+result.updateType === 0){
            reject(new Error('内置图书不能编辑'))
          }else{
            await db.update(model,'book',`where fileName='${book.fileName}'`)
            resolve()
          }
        }
      }else{
        reject(new Error('添加的图书对象不合法'))
      }
    }catch(e){
      reject(e)
    }
  })
}

function getBook(fileName){
  return new Promise(async (resolve,rejecct) => {
    const bookSql = `select * from book where fileName='${fileName}'`
    const contentsSql = `select * from contents where fileName='${fileName}' order by \`order\``
    const book = await db.queryOne(bookSql)
    const contents = await db.querySql(contentsSql)
    if(book){
      book.coverPath = book.cover
      book.cover = Book.genCoverUrl(book)
      book.contentsTree = Book.genContentsTree(contents)
      resolve(book)
    }else{
      reject(new Error('电子书不存在'))
    }
  })
}

async function getCategory(){
  const sql = `select * from category order by category asc`
  const result = await db.querySql(sql)
  const categoryList = []
  result.forEach(item => {
    categoryList.push({
      label: item.categoryText,
      value: item.category,
      num: item.num
    })
  })
  return categoryList
}
//获取图书列表数据
async function listBook(query){
  //console.log(query);
  const {
    category, 
    author, 
    title,
    sort,
    page = 1,
    pageSize = 20
  } = query
  const offset = (page - 1) * pageSize
  let bookSql = 'select * from book'
  let where = 'where'
  //查询标题
  title && (where = db.andLike(where, 'title', title))
  //查询作者
  author && (where = db.andLike(where, 'author', author))
  //查询分类
  category && (where = db.and(where, 'category', category))
  let countSql = `select count(*) as count from book`
  if(where !== 'where'){
    bookSql = `${bookSql} ${where}`
    countSql = `${countSql} ${where}`
  }
  const count = await db.querySql(countSql)
  if(sort){
    //取出第一个字符
    const symbol = sort[0]
    const column = sort.slice(1,sort.length)
    const order = symbol === '+' ? 'asc' : 'desc'
    bookSql = `${bookSql} order by \`${column}\` ${order}`
  }
  bookSql = `${bookSql} limit ${pageSize} offset ${offset}`
  const list = await db.querySql(bookSql)
  list.forEach(book => book.cover = Book.genCoverUrl(book))
  return { list, count:count[0].count, page: +page, pageSize: +pageSize}
}
function deleteBook(fileName){
  return new Promise(async (resolve,reject) => {
    let book = await getBook(fileName)
    if(book){
      if(+book.updateType === 0){
        reject(new Error('内置电子书不能删除'))
      }else{
        const bookObj = new Book(null,book)
        const sql = `delete from book where fileName='${fileName}'`
        db.querySql(sql).then(() => {
          bookObj.reset()
          resolve()
        })
      }
    }else{
      reject(new Error('电子书不存在'))
    }
  })
}

module.exports = {
  inserBook,
  updateBook,
  getBook,
  getCategory,
  listBook,
  deleteBook
}