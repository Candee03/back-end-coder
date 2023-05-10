import express from 'express'
import { productRouter } from './routers/product.router.js'
import { cartRouter } from './routers/cart.router.js';

const app = express()
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


app.listen(8080, () => {
    console.log('esta escuchando el puerto 8080');
})