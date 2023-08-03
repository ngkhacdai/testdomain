const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ngkhacdai:a012675921@assignmentmob402.mbfbglm.mongodb.net/shoplaptop');
const expressHbs = require('express-handlebars');
const apiRoute = require('./routes/api.js')
const indexRoute = require('./routes/index.js')
app.use(express.static('public'))
app.engine('hbs', expressHbs.engine({
    extname: 'hbs',
    defaultLayout: 'layouts',
    layoutDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowedProtoMethodsByDefault: true
    },
    helpers: {
        checkAdmin: function(v1,options){
            if(v1 == 'admin'){
                return options.fn(this);
            }else{
                return options.inverse(this);
            }
        },
        checkGuest: function(v1,options){
            if(v1 == 'guest'){
                return options.fn(this);
            }else{
                return options.inverse(this);
            }
        },
        sum: (a, b) => a + b ,
        tinhTien: function(v1,v2){
            return Number(v1)*Number(v2);
        },
        checkDonHang: (v1,v2,options) => {
            if(v1 == 'Chờ xác nhận'){
                return options.fn(this,{data: {id: v2}});
            }else{
                return options.inverse(this,{data: {tt: 'Đã giao hàng'}});
            }
        },
        checkNhanHang: (v1,v2,options) => {
            if(v1 == 'Đơn hàng đang giao'){
                return options.fn(this,{data: {id: v2}});
            }else if(v1 == 'Chờ xác nhận'){
                return options.inverse(this, {data: {tt: 'Chờ xác nhận'}});
            }
            else{
                return options.inverse(this, {data: {tt: 'Đã nhận hàng'}});
            }
        },

    }
}));

app.set('view engine', '.hbs');
app.set('views', './views');

app.use('/', indexRoute);
app.use('/api', apiRoute);

app.listen(port, () => {
    console.log('app listening on port ' + port);
})