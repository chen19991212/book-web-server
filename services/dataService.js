const db = require('../db')

function randomNumber(){
  return Math.floor(Math.random()*100 + 100)
}


function getVisitsData(){
  const visitsData = {
    week: [],
    month: [],
    year: [],
    weekTotal: 0,
    monthTotal: 0,
    yearTotal: 0
  }
  for(let i = 0;i < 30;i++){
    let random = randomNumber()
    if(i >= 30-7){
      visitsData.weekTotal += random
      visitsData.week.push(random)
    }
    if(i < 12){
      visitsData.yearTotal += random * 30
      visitsData.year.push(random * 30)
    }
    visitsData.monthTotal += random
    visitsData.month.push(random)
  }
  return visitsData
}

function getCategoryData(){
  const data = {
    'Biomedicine': randomNumber() - 100,
    'BusinessandManagement': randomNumber() - 100,
    'ComputerScience': randomNumber() - 100,
    'EarthSciences': randomNumber() - 100,
    'Economics': randomNumber() - 100,
    'Education': randomNumber() - 100,
    'Engineering': randomNumber() - 100,
    'Environment': randomNumber() - 100,
    'Geography': randomNumber() - 100,
    'History': randomNumber() - 100,
    'Laws': randomNumber() - 100,
    'LifeSciences': randomNumber() - 100,
    'Literature': randomNumber() - 100,
    'MaterialsScience': randomNumber() - 100,
    'Mathematics': randomNumber() - 100,
    'MedicineAndPublicHealth': randomNumber() - 100,
    'Philosophy': randomNumber() - 100,
    'Physics': randomNumber() - 100,
    'PoliticalScienceAndInternationalRelations': randomNumber() - 100,
    'SocialSciences': randomNumber() - 100,
    'Statistics': randomNumber() - 100,
  }
  return data
}

function getRecordData(){
  const sql = `select * from record order by date desc limit 20`
  return db.querySql(sql)
}

function insertRecord(type,title,user){
  console.log(type,title,user);
  const obj = {
    user,
    book: title,
    operation: type,
    date: new Date().getTime()
  }
  return new Promise(async (resolve,reject) => {
    await db.insert(obj,'record')
    resolve()
  })
}

module.exports = {
  getVisitsData,
  getCategoryData,
  getRecordData,
  insertRecord
}