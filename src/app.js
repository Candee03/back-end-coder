import {app, io } from './config/utils.js';
import handlebars from 'express-handlebars'

import passport from "passport";
import initializePassport from './config/passport.js';

import ProductMongo from './product/product.DAO.js';
import CartMongo from './cart/cart.DAO.js';
import { messageModel } from './message.model.js';

import productRouter from './routers/product.router.js'
import cartRouter from './routers/cart.router.js';
import usersRouter from './routers/user.router.js';
import sessionsRouter from './routers/session.router.js';
import viewsRouter from './routers/views.router.js';
import cookieParser from 'cookie-parser';

//&------VARIABLES CHAT--------
let messages = []
let connectedClients = []
//*-----VARIABLE PRODUCTOS-----
let productos

//?---------MIDDLEWARE----------
export const getProduct = async (req, res, next) => {
    const productService = new ProductMongo()
    const cartService = new CartMongo()
    const products = await productService.getProductsRealTime()
    productos = products
    req.productService = productService
    req.cartService = cartService
    next();
};
initializePassport()
app.use(passport.initialize())
app.use(cookieParser())
// app.use(passport.session())

app.engine('handlebars', handlebars.engine())
app.set('views', 'views/')
app.set('view engine', 'handlebars')
app.use(getProduct)


//*----------ROUTERS-------------
app.use('/api/products', productRouter.getRouter());
app.use('/api/carts', cartRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

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