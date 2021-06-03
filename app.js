const express = require('express')
const router = require('./router')

const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }))
//app.use(bodyParser.json())
app.use('/', router)

const server = app.listen(5001,function(){
	const { address, port } = server.address()
	console.log('HTTP启动成功：http://%s:%s',address,port);
})