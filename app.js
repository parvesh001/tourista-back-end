//Required Packages
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

//Required Routes
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

//Required Controller
const globalErrorHandler = require('./controllers/errorController');

//Required Utils
const AppError = require('./utils/appError');

const app = express();

//GLOBAL MIDDLEWARES:run on each request

//Set security http headers
app.use(helmet())

//Log requests during development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Parse incoming json data
app.use(express.json());

//Limit incoming requests in between an hour
const limiter = rateLimit({
  max:100,
  windowMs:60 * 60 * 1000,
  message:'To many request from this IP, please try again after an hour'
})
app.use('/api', limiter)

//Senitize Data:NOSQL Querry Injuction
app.use(mongoSanitize())

//Senitize Data: XSS
app.use(xss())

//Prevent against parameter pollution
app.use(hpp({
  whitelist:[
    'duration',
    'maxGroupSize',
    'ratingsAverage',
    'price',
    'difficulty'
  ]
}))

//ROUTES
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

//404 response:When no route match
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} route!`, 404));
});

//Global error handler:All errors come at this central place
app.use(globalErrorHandler);

module.exports = app;
