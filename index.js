// importing express to create a nodejs server
const express = require('express');
// import database from db.js 
const connectDB = require('./db');
// creating a server from express
const app = express()
const port = 5000
// calling connect database method of db.js/
connectDB();

app.use(express.json());

// Available endpoints
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
