var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const parser = bodyParser.urlencoded({ extended: true });
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const cartSchema = require('../models/cart');
const cartItemSchema = require('../models/cartitem');
const userSchema = require('../models/user');
const productSchema = require('../models/product');
const orderSchema = require('../models/order');
const orderItemSchema = require('../models/orderitem');
const { request } = require('http');
router.use(parser);
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    res.render('home', { layout: 'login' })
})

router.get('/manage', async (req, res) => {
    if(req.cookies.jwt){
        const user = await userSchema.findOne({_id: req.cookies.jwt});
        const product = await productSchema.find();
        res.render('home', { layout: 'manage' , user: user, product: product })
    }else{
        return res.redirect('/');
    }
    
})

router.get('/logout', (req, res) => {
    res.cookie("jwt", '',{httpOnly: true});
    return res.redirect('/');
})

router.get('/thongke', async (req, res) => {
    const user = await userSchema.findOne({_id: req.cookies.jwt});
    res.render('home', { layout: 'thongke' , user: user })
})

router.get('/product', async (req, res) => {
    if(req.cookies.jwt){
        const user = await userSchema.findOne({_id: req.cookies.jwt});
        if(user.role == 'admin'){
            const product = await productSchema.find();
            res.render('home', { layout: 'product' ,product: product})
        }else{
            return res.redirect('/');
        }
    }else{
        return res.redirect('/');
    }
    
})

router.get('/productDetails/:id',async (req, res) => {
    await productSchema.findOne({_id: req.params.id}).then((product) => {
        userSchema.findOne({_id: req.cookies.jwt}).then((user) => {
            res.render('home', { layout: 'prdetail' ,product: product,user: user });
        })
        
    })
})

router.get('/cart', async (req, res) => {
    let list = [];
    const user = await userSchema.findOne({_id: req.cookies.jwt})
    await cartSchema.findOne({user_id: req.cookies.jwt}).then((cart) => {
        cartItemSchema.find({cart_id: cart._id}).then((cartItem) => {
            for(let i =0 ; i< cartItem.length ; i++) {
                list.push(cartItem[i].product_id);
            }
            productSchema.find({_id: {
                $in: list
            }}).then((product) => {
                let tong = 0;
                for (let index = 0; index < product.length; index++) {
                    tong += product[index].price;
                    
                }
                res.render('home', { layout: 'cart',size: cartItem.length,product: product,item: cartItem,total: tong,user: user});
            });
        });
        
    })
    
})

router.get('/hoadon', async (req, res) => {
    const user = await userSchema.findOne({_id: req.cookies.jwt});
    if(user.role == 'admin'){
        const orderWait = await orderSchema.find({status: 'Chờ xác nhận'})
        const orderShip = await orderSchema.find({status: 'Đơn hàng đang giao'})
        const orderRecive = await orderSchema.find({status: 'Đã nhận hàng'})
        res.render('home', {layout: 'donhang',user: user ,orderShip: orderShip, orderRecive: orderRecive,orderWait: orderWait})
    }else{
        await orderSchema.find({user_id: req.cookies.jwt}).then((order) => {
            res.render('home', {layout: 'hoadon', user: user,order: order})
        })
    }
    
})

router.get('/orderdetails/:id', async (req, res) => {
    let list = [];
    let listproduct = [];
    const user = await userSchema.findOne({_id: req.cookies.jwt});
    const order = await orderSchema.findOne({_id: req.params.id});
    orderItemSchema.find({order_id: req.params.id}).then((item) => {
        for(let i =0 ; i< item.length ; i++) {
            list.push(item[i].product_id);
        }
        productSchema.find({_id: {
            $in: list
        }}).then((product) => {
            
            for (let i = 0; i < product.length; i++) {
                let a = product[i];
                a.item = item[i].quantyti;
                listproduct.push(a);
            }
            res.render('home', {layout: 'orderdetails', product: listproduct,user: user, orderdetail: item,order: order,order_id: req.params.id});
        })
        
    })
})

router.get('/giaoHang/:id', async (req, res) => {
    const user = await userSchema.findOne({_id: req.cookies.jwt})
    await orderSchema.updateOne({_id: req.params.id},{
        $set: {
            status: 'Đơn hàng đang giao'
        }
    }).then(
        res.redirect('/orderdetails/' + req.params.id)
    )
})

router.get('/nhanHang/:id', async (req, res) => {
    const user = await userSchema.findOne({_id: req.cookies.jwt})
    await orderSchema.updateOne({_id: req.params.id},{
        $set: {
            status: 'Đã nhận hàng'
        }
    }).then(
        res.redirect('/orderdetails/' + req.params.id)
    )
})

router.get('/deleteItemInCart/:id', async (req, res) => {
    await cartItemSchema.deleteOne({product_id: req.params.id}).then(()=>{
        res.redirect('/cart');
    })
})

router.post('/signup', async (req, res) => {
    const body = req.body;
    await userSchema.insertMany({ name: body.name, email: body.email, phone: body.phone, password: body.pass, address: body.address, sex: body.sex, role: 'user' })
    await userSchema.findOne({email: body.email, password: body.pass}).then((user) => {
        cartSchema.insertMany({user_id: user._id})
    }).then((cart) =>res.redirect('/'))
    
    
});

router.post('/signin', async (req, res) => {
    const body = req.body;
    const a = await userSchema.findOne({ email: body.email, password: body.password });
    if (a) {
        res.cookie("jwt", a._id,{httpOnly: true});
        return res.redirect('/manage');
    } else {
        return res.redirect('/');
    }
});

router.post('/addProduct',upload.single('myFile'), async (req, res) => {
    const body = req.body;
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        contentType: req.file.mimetype,
        data: encode_img
    };
    await productSchema.insertMany({name: body.name,brand: body.brand,price: body.price,quantyti: body.quantyti,price: body.price,descaption: body.descaption,img: final_img})
    res.redirect('/product')
})

router.post('/updateProduct/:id', upload.single('myFile'), async (req,res) => {
    const body = req.body;
        if(req.file){
            var img = fs.readFileSync(req.file.path);
            var encode_img = img.toString('base64');
            var final_img = {
                contentType: req.file.mimetype,
                data: encode_img
            }
            await productSchema.updateOne({_id: req.params.id},{$set: {name: body.name,brand: body.brand,price: body.price,quantyti: body.quantyti,price: body.price,descaption: body.descaption,img: final_img}})
        }else{
            await productSchema.updateOne({_id: req.params.id},{$set: {name: body.name,brand: body.brand,price: body.price,quantyti: body.quantyti,price: body.price,descaption: body.descaption}})
        }
    res.redirect('/product')
})
router.get('/deleteProduct/:id', upload.single('myFile'), async (req,res) => {
    await productSchema.deleteOne({_id: req.params.id})
    res.redirect('/product')
})
router.get('/addToCart/:id', async (req, res) => {
    const cart = await cartSchema.findOne({user_id: req.cookies.jwt})
    const checkProductInCart = await cartItemSchema.findOne({cart_id: cart._id,product_id: req.params.id});
    if(checkProductInCart){

    }else{
        await cartItemSchema.insertMany({cart_id: cart._id,product_id: req.params.id,quantyti: 1});
    }
    
});
router.post('/thanhToan', async (req, res) => {
    let date = new Date().toJSON();
    const listQ = req.body.listQ;
    await orderSchema.insertMany({user_id: req.cookies.jwt,total: req.body.total,date: date,status: 'Chờ xác nhận'});
    await orderSchema.find().then((order) => {
        saveOrder = order[order.length - 1]._id;
    })
    await cartSchema.findOne({user_id: req.cookies.jwt}).then((cart)=> {
        cartItemSchema.find({cart_id: cart._id}).then((cartItem)=> {
            for (let i = 0; i < cartItem.length; i++) {
                orderItemSchema.insertMany({order_id: saveOrder, product_id: cartItem[i].product_id, quantyti: listQ[i]})
            }
        })
        .then(() => {
            cartItemSchema.deleteMany({cart_id: cart._id}).then(res.redirect('/cart'));
        })
    })
})

router.post('/thongke', async (req, res) => {
    let list = [];
    let from = new Date(req.body.begin);
    let to = new Date(req.body.end);
    const user = await userSchema.findOne({_id: req.cookies.jwt})
    await orderSchema.find({status: {
        $in: ['Đã nhận hàng','Đơn hàng đang giao']
    },date: {
        $gte: from, $lt: to
    }}).then((order)=> {
        let total = 0;
        for (let i = 0; i < order.length; i++) {
            total += order[i].total;
            
        }
        res.render('home', {layout: 'thongke', total: total,user: user})
    });
    
})

module.exports = router;