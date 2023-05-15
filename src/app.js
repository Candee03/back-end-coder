import handlebars from 'express-handlebars'
import { productRouter, products } from './routers/product.router.js'
import { cartRouter } from './routers/cart.router.js';
import { socketServer, app } from './config/utils.js';


app.engine('handlebars', handlebars.engine())
app.set('views', 'views/')
app.set('view engine', 'handlebars')

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

//&------GET LISTA DE PRODUCTOS-----------------
app.get('/', (req,res) => {
    const empty = products.length === 0
    res.render('home', {products, empty})
})
app.get('/realtimeproducts', (req,res) => {
    const empty = products.length === 0
    res.render('realtimeproducts', {empty})
})
//!---------------------------------------------

socketServer.on('connection', (socket)=> {
    console.log('cliente conectado');
    socket.emit('products', products);
	socket.on('products', (products) => {
		socketServer.emit('products', products);
	});
})