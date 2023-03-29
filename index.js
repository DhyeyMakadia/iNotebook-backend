const connectToMongo = require('./db')
const express = require('express')
require("dotenv").config();

const cors = require('cors');
connectToMongo();

const app = express()
const PORT = process.env.PORT
app.use(express.json())
app.use(cors());

// Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})