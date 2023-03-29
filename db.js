const mongoose = require('mongoose')
require('dotenv').config()
const mongoURI = `mongodb+srv://${process.env.User}:${process.env.Password}@portfolio-db.tnaiwac.mongodb.net/inotebook`

const connectToMongo = () => {
    mongoose.connect(mongoURI,()=>{
        console.log('Connected to Database.');
    })
}


module.exports = connectToMongo;