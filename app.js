// routes for the application
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// routes 
import authRoute from './routes/authRoute.js';
import paperRoute from './routes/paperRoute.js';
import docRoute from './routes/docRoute.js';
import profileRoute from './routes/profileRoute.js';
import adminRoute from './routes/adminRoute.js';
import pcMemberRoute from './routes/pcMemberRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import reviewerAuthRoute from './routes/reviewerAuthRoute.js';

// configure dotenv to use environment variables
dotenv.config();
// console.log(process.env.port) // remove this after you've confirmed it is work



const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cors());



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


app.get('/', (req, res) => {
    res.send('Ok its working');
});

app.use('/api/auth', authRoute);
app.use('/api/papers', paperRoute);
app.use('/api/docs', docRoute);
app.use('/api/user', profileRoute);
app.use('/api/admin', adminRoute);
app.use('/api/pc-member', pcMemberRoute);
app.use('/api/review', reviewRoute);
app.use('/api/reviewer', reviewerAuthRoute);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

