// routes for the application
const authentication = require('./routes/authentication');
const paperRoutes = require('./routes/paperRoutes');
const docRoutes = require('./routes/docRoutes');
const profileRoutes = require('./routes/profileRoutes');

const express = require('express');
const app = express();
const port = 8082;
const mongoose = require('mongoose');
app.use(express.json());
// use cors to allow cross origin resource sharing
const cors = require('cors');
app.use(cors());

// configure dotenv to use environment variables
require('dotenv').config()
// console.log(process.env.port) // remove this after you've confirmed it is work


const uri = process.env.MONGO_URI;
const  connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to the database');
    } catch (error) {
        console.error(`Error connecting to the database ${error.message}`);
        process.exit(1);
    }
}
connectDB();


app.use('/api/auth', authentication);
app.use('/api/papers', paperRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/user', profileRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

