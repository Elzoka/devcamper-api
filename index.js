const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const routes = require('./routes');
const connectDB = require('./config/db');

// load env vars
dotenv.config({path: './config/config.env'});

// start db
connectDB();

const app = express();

// logger
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(routes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// handle rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});