const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRoute')
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const productRoute = require('./routes/productRoute');
const morgan = require('morgan');
const blogRoute = require('./routes/blogRoute');
const categoryRoute = require('./routes/categoryRoute');
const blogCategoryRoute = require('./routes/blogCatRoute');
const brandRoute = require('./routes/brandRoute');
const couponRoute = require('./routes/couponRoute');

dbConnect();

app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/user', authRouter);
app.use('/api/product', productRoute);
app.use('/api/blog', blogRoute)
app.use('/api/category', categoryRoute)
app.use('/api/blogcategory', blogCategoryRoute)
app.use('/api/brand', brandRoute)
app.use('/api/coupon', couponRoute)

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});