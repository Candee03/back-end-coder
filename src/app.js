import handlebars from 'express-handlebars'
import ProductServices from './dao/productDAO.js';
import { productRouter } from './routers/product.router.js'
import { cartRouter } from './routers/cart.router.js';
import {app, io } from './config/utils.js';
import { messageModel } from './dao/models/message.model.js';


//&------VARIABLES CHAT--------
let messages = []
let connectedClients = []
//*-----VARIABLE PRODUCTOS-----
let productos
//*----------------------------


//?---------MIDDLEWARE----------
const getProduct = async (req, res, next) => {
    const productService = new ProductServices()
    const products = await productService.getProducts()
    productos = products
    req.products = products
    req.productService = productService
    next();
};

app.engine('handlebars', handlebars.engine())
app.set('views', 'views/')
app.set('view engine', 'handlebars')

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use(getProduct)

//&------GET VIEWS-----------------
app.get('/', async(req,res) => {
    const products = await req.productService.getProducts()
    const empty = products.length === 0
    res.render('home', {products, empty})
})
app.get('/chat', async(req,res) => {
    res.render('chat')
})
app.get('/realtimeproducts', async(req,res) => {
    const products = req.products
    const empty = products.length === 0
    res.render('realtimeproducts', {empty})
})
//!-----------------SOCKET SERVER----------------------------
io.on('connection', async (socket)=> {
    console.log('nuevo cliente conectado');
    connectedClients.push(socket.id);

    const model = await messageModel.find().lean()
    model.length !== messages.length ? model.map(m => messages.push(m)) :
    

    socket.emit('products', productos);
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