import { io } from '../config/utils.js'
import ProductRepository from './product.repository.js'
import ProductMongo from "./product.DAO.js"


export const productService = new ProductRepository(new ProductMongo())

export const getAllProducts = async(req, res) => {
	try{
        const { limit, page, sort, category, status } = req.query
        const products = await productService.getProducts(limit, page, sort, category, status )
        return res.status(200).send(products)
    }
    catch (err) {
        return res.status(400).send({error: `error en la request`})
    }
}

export const getProductById = async(req, res) => {
    try {
        const productoEncontrado = await productService.getProductById(req.params.pid)
        if (!productoEncontrado){
            throw new Error(`El producto con id '${req.params.pid}' no existe`)
        }
        res.status(200).send(productoEncontrado)
    }
    catch (err) {
        return res.status(404).send({error: err.message})
    }
}

export const addProduct = async(req, res) => {
    try {
        console.log('funcion');
        const product = req.body;
        const newProduct = await productService.addProduct(product)
        if (!newProduct) {
            throw new Error(`El producto no se pudo agregar`)
        } else {
            const products = await productService.getProducts()
            io.emit('products', products)//<--envia al socket
            res.status(201).send(product)
        }
    }
    catch (err) {
        res.status(404).send({error: err.message})
    }
}

export const updateProduct = async(req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.pid, req.body)
        const products = await productService.getProducts()
        io.emit('products', products)//<--envia al socket
        res.status(201).send(updatedProduct);
    }
    catch (err) {
        return res.status(500).send({error: err.message})
    }
}

export const deleteProduct = async(req, res) => {
    try {
        await productService.deleteProduct(req.params.pid)
        const products = await productService.getProducts()
        io.emit('products', products)//<--envia al socket
        res.status(204).send({status: `se elimino correctamente`});
    }
    catch (err) {
        res.status(500).send({error: err})
    }
}