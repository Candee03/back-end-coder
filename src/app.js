import express from 'express'
import ProductManager from './productManager.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const productManager = new ProductManager('src/productos.json')

app.get('/products', async(req, res) => {
    try{
        const products = await productManager.getProducts()
        if (!req.query.limit) {
            return res.send(products)
        } else {
            return res.send(products.slice(0,Number(req.query.limit)))
        }
    }
    catch (err) {
        console.log(err);
    }
})

app.get('/products/:pid', async (req, res) => {
    try {
        const productoEncontrado = await productManager.getProductById(Number(req.params.pid))
        if (productoEncontrado) {
            return res.send(productoEncontrado)
        } else {
            return err
        }
    }
    catch (err) {
        return res.send({error: `El producto con id '${req.params.pid}' no existe`})
    }
})

app.listen(8080, () => {
    console.log('esta escuchando el puerto 8080');
})