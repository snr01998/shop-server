const express = require('express');
const app = express();
const mongoose = require('mongoose');

require('dotenv/config');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const authJwt = require('./helpers/jwt');
const morgan = require('morgan');
const api = process.env.API_URL;
app.use(express.json());
var bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./helpers/error-handler');
require('dotenv/config');

//app.use(errorHandler);
app.use(cors());
app.options('*',cors());
app.use('/public/uploads', express.static(__dirname +'/public/uploads/'));
app.use(bodyParser.json());
app.use(authJwt());

//const categoriesRoutes = require('./routes/categories');
//const productsRoutes = require('./routes/products');
//const usersRouts = require('./routes/users');




//const productsRouter = require('./routers/products');
//const Product = require('./models/product');
//app.use(`${api}/products`,productsRouter)
//app.use(`${api}/categories`,categoriesRouter)
//app.use(`${api}/users`,usersRouter)
app.use(morgan('tiny'));

//const Product = mongoose.model('Product',productSchema); 


const categoriesRoutes = require('./routers/categories');
const productsRoutes = require('./routers/products');
const usersRoutes = require('./routers/users');
const ordersRoutes = require('./routers/orders');

//const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

mongoose.connect(process.env.CONNECTION_STRING,{useNewUrlParser:true,
useUnifiedTopology:true,
dbName:'eeshopee'
})

.then(()=>{console.log('Database string')})
.catch((err)=>{console.log(err)})
//app.listen(3000)

var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("aaa is work"+ port)
})
