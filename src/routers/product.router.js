import { Router } from 'express';
import { io } from '../config/utils.js';
import ProductServices from '../dao/productDAO.js';

import fs from 'fs';

const productRouter = Router();
const productService = new ProductServices()
const path = 'src/products.json'

//!---------METODO GET-------
productRouter.get('/', async(req, res) => {
	try{
        const { limit, page, sort, category, status } = req.query
        const products = await productService.getProducts(limit, page, sort, category, status )
        fs.promises.writeFile (path, JSON.stringify(products))
        return res.status(200).send(products)
    }
    catch (err) {
        return res.status(400).send({error: `error en la request`})
    }
});
productRouter.get('/:pid', async(req, res) => {
    try {
        const productoEncontrado = await productService.getProductById(req.params.pid)
        if (productoEncontrado){
            res.status(200).send(productoEncontrado)
        } else {
            throw new Error(`El producto con id '${req.params.pid}' no existe`)
        }
    }
    catch (err) {
        return res.status(404).send({error: err.message})
    }
});

//!---------METODO POST-------
productRouter.post('/', async(req, res) => {
    try {
        const product = req.body;
        const newProduct = await productService.addProduct(product)
        if (!newProduct) {
            throw new Error(`El producto no se pudo agregar`)
        } else {
            const products = await productService.getProducts()
            io.emit('products', products)//<--envia al socket
            fs.promises.writeFile (path, JSON.stringify(products))
            res.status(201).send(product)
        }
    }
    catch (err) {
        res.status(404).send({error: err.message})
    }
});

//!---------METODO PUT--------
productRouter.put('/:pid', async(req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.pid, req.body)
        const products = await productService.getProducts()
        fs.promises.writeFile (path, JSON.stringify(products))
        io.emit('products', products)//<--envia al socket
        res.status(201).send(updatedProduct);
    }
    catch (err) {
        return res.status(500).send({error: err.message})
    }
});

//!---------METODO DELETE-----
productRouter.delete('/:pid', async(req, res) => {
    try {
        await productService.deleteProduct(req.params.pid)
        const products = await productService.getProducts()
        fs.promises.writeFile (path, JSON.stringify(products))
        io.emit('products', products)//<--envia al socket
        res.status(204).send({status: `se elimino correctamente`});
    }
    catch (err) {
        res.status(500).send({error: err})
    }
});

export { productRouter, productService};