const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require("cookie-parser")
const path = require('path')
//Import Routes
const authRoute = require('./routes/auth')
// const usersRoute = require('./routes/users')
// const imagesRoute = require('./routes/images')
dotenv.config()

//Connect to DB
// Connect to DB
mongoose.connect("mongodb+srv://Sanyat:Sanyat1234@cluster0.r6sod.mongodb.net/social?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => console.log('Connected to dB'))
    .catch((err) => console.log(err))

//Middeware
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Route Middlewares
app.use('/api/auth', authRoute)
// app.use('/api/images', imagesRoute)


app.listen(8800, () => console.log('Server Up and Running'))