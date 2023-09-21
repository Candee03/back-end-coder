import {app, io } from './config/utils.js';
import handlebars from 'express-handlebars'
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import passport from "passport";
import initializePassport from './config/passport.js';

import ProductMongo from './product/product.DAO.js';
import CartMongo from './cart/cart.DAO.js';
import { messageModel } from './chat/message.model.js';

import productRouter from './routers/product.router.js'
import cartRouter from './routers/cart.router.js';
import usersRouter from './routers/user.router.js';
import sessionsRouter from './routers/session.router.js';
import viewsRouter from './routers/views.router.js';
import cookieParser from 'cookie-parser';
import mailRouter from './routers/mailer.router.js';
import errorHandlerMiddleware from './middleware/errorHandler.middleware.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';

//!CONFIGURACION DE SWAGGER
const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:'Proyecto E-Commerce',
            version:'1.0.0',
            description:'Proyecto Alfano Candela para CoderHouse',
        }
    },
    apis:['./src/routers/*.js']
}

const spects = swaggerJsDoc(swaggerOptions);

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
app.use(loggerMiddleware)
initializePassport()
app.use(passport.initialize())
app.use(cookieParser())

app.engine('handlebars', handlebars.engine())
app.set('views', 'src/views/')
app.set('view engine', 'handlebars')
app.use(getProduct)


//*----------ROUTERS-------------
app.use('/docs',swaggerUi.serve, swaggerUi.setup(spects));

app.use('/api/products', productRouter.getRouter());
app.use('/api/carts', cartRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());
app.use('/api/sessions', sessionsRouter);
app.use('/api/mail', mailRouter);
app.use('/', viewsRouter.getRouter());

app.get('/loggerTest', (req,res) => {
    try{
        req.logger.fatal('Fatal')
        req.logger.warning('Warning')
        req.logger.info('Info')
        req.logger.debug('Debug')
        throw new Error('Error test')
    }
    catch (err){
        req.logger.error(err.message)
        res.status(500).send('ok')
    }
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

app.use(errorHandlerMiddleware)