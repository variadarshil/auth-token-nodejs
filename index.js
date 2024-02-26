const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');
//Import Routes
const authRoutes = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT)
    .then(() => console.log('Connected to db!'))
    .catch((err) => console.log('Could not connect to db!'))

//Middleware
app.use(express.json());

//Route Middleware
app.use('/api/user', authRoutes);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server Up and running'));