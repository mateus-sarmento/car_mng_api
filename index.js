const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes');
require('dotenv').config();
const cors = require('cors');

const uri = process.env.DATABASE_URL;
// const uri = "mongodb+srv://mateussarmento:123qwe@cluster0.io8uqxl.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

// enabling CORS for all requests
app.use(cors());
app.use(express.json());
app.use('/', routes)

app.listen(process.env.PORT || 3001)

