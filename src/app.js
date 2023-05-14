import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from "socket.io";

import { productRouter, products } from './routers/product.router.js'
import { cartRouter } from './routers/cart.router.js';

const app = express()
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine('handlebars', handlebars.engine())
app.set('views', 'views/')
app.set('view engine', 'handlebars')

//!---socket.io--------------------------------
const httpServer = app.listen(8080, () => {
    console.log('esta escuchando el server 8080')
})
const socketServer = new Server(httpServer)
//!---------------------------------------------

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

//&------GET LISTA DE PRODUCTOS----------
app.get('/', (req,res) => {
    const empty = products.length === 0
    res.render('home', {products, empty})
})
app.get('/realtimeproducts', (req,res) => {
    const empty = products.length === 0
    res.render('realtimeproducts', {empty})
})


//!------------SOCKET.IO----------------------------
socketServer.on('connection', (socket)=> {
    console.log('cliente conectado');
    socket.emit('products', products);
	socket.on('products', (products) => {
		socketServer.emit('products', products);
	});
})

export {socketServer}