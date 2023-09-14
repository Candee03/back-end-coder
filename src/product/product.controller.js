import { io } from '../config/utils.js'
import ProductRepository from './product.repository.js'
import ProductMongo from "./product.DAO.js"

import CustomErrors from '../tools/customError.js'
import { createProductErrorInfo } from '../tools/info.js'
import EErrors from '../tools/EErrors.js'

export const productService = new ProductRepository(new ProductMongo())

export const getAllProducts = async(req, res) => {
	try{
        const { limit, page, sort, category, status } = req.query
        const products = await productService.getProducts(limit, page, sort, category, status )
        return res.status(200).send(products)
    }
    catch (err) {
        req.logger.error(err)
        return res.status(400).send({error: `error en la request`})
    }
}

export const getProductById = async(req, res) => {
    try {
        const productoEncontrado = await productService.getProductById(req.params.pid)
        res.status(200).send(productoEncontrado)
    }
    catch (err) {
        req.logger.error(`${err.name}: ${err.message}${err.cause}`)
        res.status(400).send(err)
    }
}

export const addProduct = async(req, res) => {
    try {
        const {title, category, status, description, price, code, stock} = req.body;
    
        if (title === undefined || category === undefined || status === undefined || description === undefined || price === undefined || code === undefined || stock === undefined){
            CustomErrors.createError({
                name: 'Error al crear el producto',
                message: 'Debes enviar todos los campos requeridos',
                cause: createProductErrorInfo(req.body),
                code: EErrors.INVALID_TYPE
            })
        }
        await productService.addProduct(req.body)
        const products = await productService.getProducts()
        io.emit('products', products)//<--envia al socket
        res.status(201).send(req.body)

    } catch (err) {
        req.logger.error(`${err.name}: ${err.message}${err.cause}`)
        res.status(400).send(err)
    }
}

export const updateProduct = async(req, res) => {
    try {
        await productService.getProductById(req.params.pid)

        await productService.updateProduct(req.params.pid, req.body)
        const products = await productService.getProducts()
        io.emit('products', products)//<--envia al socket
        req.logger.info('el producto se actualizo correctamente')
        res.status(201).send({status: 'ok', payload:'el producto se actualizo correctamente'});

    } catch (err) {
        req.logger.error(`${err.name}: ${err.message}${err.cause}`)
        res.status(400).send(err)
    }
}

export const deleteProduct = async(req, res) => {
    try {
        await productService.deleteProduct(req.params.pid)
        const products = await productService.getProducts()
        io.emit('products', products)//<--envia al socket
        req.logger.info(`se eliminó correctamente`)
        res.status(204).send({status: `se elimino correctamente`});
    }
    catch (err) {
        res.status(500).send({error: err})
    }
}