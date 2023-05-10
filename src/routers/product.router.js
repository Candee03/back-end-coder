import { Router } from 'express';
import ProductManager from '../productManager.js';

const productManager = new ProductManager('src/productos.json')
const products = await productManager.getProducts()
const productRouter = Router();

//!---------METODO GET-----
productRouter.get('/', async(req, res) => {
	try{
        if (!req.query.limit) {
            return res.status(201).send(products)
        } else {
            return res.status(201).send(products.slice(0,Number(req.query.limit)))
        }
    }
    catch (err) {
        return res.status(400).send({error: `error en la request`})
    }
});
productRouter.get('/:pid', async(req, res) => {
    try {
        const productoEncontrado = await productManager.getProductById(Number(req.params.pid))
        if (productoEncontrado){
            res.status(201).send(productoEncontrado)
        } else {
            throw new Error(`El producto con id '${req.params.pid}' no existe`)
        }
    }
    catch (err) {
        return res.status(404).send({error: err.message})
    }
});

//!---------METODO POST-----
productRouter.post('/', async(req, res) => {
    try {
        const product = req.body;
        const agregado = await productManager.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.status,product.category, product.stock)
        if (!agregado) {
            throw new Error(`El producto no se pudo agregar`)
        } else {
            res.status(201).send(product)
        }
    }
    catch (err) {
        res.status(404).send({error: err.message})

    }
});

//!---------METODO PUT-----
productRouter.put('/:pid', async(req, res) => {
    try {
        const productUpdated = req.body
        const productoEncontrado = products.find(p => Number(req.params.pid) === p.id)
        if (productoEncontrado) {
            await productManager.updateProduct(Number(req.params.pid), productUpdated)
            res.status(201).send({modificacion: productUpdated, producto: productoEncontrado});
        } else {
            throw new Error(`El producto con id '${req.params.pid}' no existe, por lo tanto no se actualizó`)
        }
    }
    catch (err) {
        return res.send({error: err.message})
    }
});

//!---------METODO DELETE-----
productRouter.delete('/:pid', async(req, res) => {
    try {
        const productoEncontrado = products.find(p => Number(req.params.pid) === p.id)
        if (productoEncontrado) {
            await productManager.deleteProduct(Number(req.params.pid))
            res.status(201).send({status: `se elimino correctamente`});
        } else {
            throw new Error('No se elimino nada')
        }
    }
    catch (err) {
        res.status(400).send({error: err.message})
    }
});


export { productRouter, products };