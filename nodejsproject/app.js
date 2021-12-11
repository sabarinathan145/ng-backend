const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const nodemon = require('./nodemon.json');

//Declaring the routes
const productroute = require('./api/routes/product');
const OrderRoute = require('./api/routes/order');
const userRoute = require('./api/routes/user');

mongoose.connect('mongodb+srv://sabarinathanks:'+ process.env.MONGODB_ATLAS_PW +'@userapplication.uv3in.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser : true,
    useUnifiedTopology : true
});

app.use(bodyparser.urlencoded({extension : false}));
app.use(bodyparser.json());   

app.use(morgan('dev'));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'DELETE', 'GET', 'PATCH');
        return res.status(200).json({});
    }
    next();
});

/* CORS section for allow CROS orgin */
// app.use(function (req, res, next) {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
// 	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
// 	res.setHeader('Cache-Control','no-cache');
// 	res.setHeader('Access-Control-Allow-Credentials', true);
// 	next();
// });


// app.use((req,res,next) => {
//     const error = new Error('Not Found');
//     error.status(404);
//     next(error);
// });

// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.json({  
//         error : {
//             message : error.message
//         }
//     });
// });

app.use('/product', productroute);
app.use('/order', OrderRoute);
app.use('/user', userRoute);


module.exports = app;