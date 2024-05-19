const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRoute')
dbConnect();

app.use('/api/user', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});