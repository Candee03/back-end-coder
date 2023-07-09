import {app, io } from './config/utils.js';
import handlebars from 'express-handlebars'
import { isGuest, isAuth, onlyAdmin } from './middleware/auth.middleware.js';
import passport from "passport";
import initializePassport from './config/passport.js';

import ProductServices from './dao/productDAO.js';
import { messageModel } from './dao/models/message.model.js';
import CartService from './dao/cartDAO.js';
import { userService } from './routers/user.router.js';

import { productRouter } from './routers/product.router.js'
import { cartRouter } from './routers/cart.router.js';
import usersRouter from './routers/user.router.js';
import sessionsRouter from './routers/session.router.js';

//&------VARIABLES CHAT--------
let messages = []
let connectedClients = []
//*-----VARIABLE PRODUCTOS-----
let productos
//*----------------------------


//?---------MIDDLEWARE----------
const getProduct = async (req, res, next) => {
    const productService = new ProductServices()
    const cartService = new CartService()
    const products = await productService.getProductsRealTime()
    productos = products
    req.productService = productService
    req.cartService = cartService
    next();
};
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', handlebars.engine())
app.set('views', 'views/')
app.set('view engine', 'handlebars')

//ROUTERS
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use(getProduct)

//&------GET VIEWS-----------------
app.get('/', isAuth, async(req,res) => {
    const { limit, page, sort, category, status } = req.query
    const products = await req.productService.getProducts( limit, page, sort, category, status )
    res.render('home', {products})
})
app.get('/products', isAuth, async(req,res) => {
    const { limit, page, sort, category, status } = req.query
    const products = await req.productService.getProducts( limit, page, sort, category, status )
    const { user } = req.session;
    delete user.password;
    const admin = user.role === 'admin' ? true : false
    res.render('products', {products, user, admin})
})
app.get('/details/:pid', isAuth, async(req,res) => {
    const product = await req.productService.getProductById(req.params.pid.toString())
    res.render('details', product)
})
app.get('/carts/:cid', async(req,res) => {
    const cart = await req.cartService.getProductsFromCart(req.params.cid.toString())
    res.render('cart', {cart})
})
app.get('/chat', async(req,res) => {
    res.render('chat')
})
app.get('/realtimeproducts', async(req,res) => {
    res.render('realtimeproducts',{})
})
app.get('/register', isGuest, async (req, res) => {
    res.render('register', {})
})
app.get('/login', isGuest, async (req, res) => {
    res.render('login', {})
})
app.get('/users', onlyAdmin, async (req, res) => {
    const users = await userService.getAll()
    res.render('users', {users})
})
//!-----------------SOCKET SERVER----------------------------
io.on('connection', async (socket)=> {
    console.log('nuevo cliente conectado');
    connectedClients.push(socket.id);
    socket.emit('products', productos);

    const model = await messageModel.find().lean()
    model.length !== messages.length ? model.map(m => messages.push(m)) :
    

	socket.on('products', (products) => {
		io.emit('products', products);
	});
    
    socket.emit('messages', messages);
    
	socket.on('new-message', async(message) => {
        messages.push(message)
        messageModel.create(message)
		io.emit('messages', messages);
	});

    socket.on('sayhello', (data) => {
		socket.broadcast.emit('connected', data);
	});

    socket.on('disconnect', () => {
        // Encontrar el índice del cliente desconectado en el array
        const index = connectedClients.indexOf(socket.id);
        // Si el cliente se encuentra en el array, removerlo
        if (index !== -1) {
            connectedClients.splice(index, 1);
        }

        if (connectedClients.length === 0) {
            connectedClients = [];
            messages = []
        }
        });
})