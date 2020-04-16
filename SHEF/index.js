const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000
 const cookieParser = require('cookie-parser'); 

app.use(cookieParser());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static('SHEF'));
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
  
})
app.post('/passcheck', db.passcheck)
app.post('/getfood', db.getfood)
app.post('/idb', db.idb)
app.get('/fetchstat', db.fetchstat)
app.get('/exercisereco', db.exercisereco)
app.get('/foodreco', db.foodreco)
app.post('/changepref', db.changepref)
app.get('/initpref', db.initpref)
app.get('/dinreco', db.dinreco)
app.get('/getdata', db.getdata)
app.get('/getdata2', db.getdata2)
app.get('/getdata3', db.getdata3)
app.get('/getdata4', db.getdata4)
app.get('/lunchreco', db.lunchreco)
app.get('/othreco', db.othreco)
app.post('/getexer', db.getexer)
app.post('/idl', db.idl)
app.post('/ido', db.ido)
app.post('/exer', db.exer)
app.post('/idd', db.idd)
app.post('/updatedetails', db.updatedetails)
app.post('/checkusers', db.checkUsers)
app.get('/users', db.getUsers)
app.get('/tri', db.tri)
app.get('/changepref', db.changepref)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
