import { io } from '../config/utils.js'
import ProductRepository from './product.repository.js'
import ProductMongo from "./product.DAO.js"

import CustomErrors from '../tools/customError.js'
import { createProductErrorInfo } from '../tools/info.js'
import EErrors from '../tools/EErrors.js'
import { userService } from '../user/user.controller.js'
import { ShowProductDto } from './product.DTO.js'

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
        const {title, category, description, price, stock} = req.body;
    
        if (title === undefined || category === undefined || description === undefined || price === undefined || stock === undefined){
            CustomErrors.createError({
                name: 'Error al crear el producto',
                message: 'Debes enviar todos los campos requeridos',
                cause: createProductErrorInfo(req.body),
                code: EErrors.INVALID_TYPE
            })
        }
        const p = new ShowProductDto(req.body).getProduct()
        //SOLO RECIBE USUARIOS PREMIUM
        p.owner = req.session.user.role === 'premium'? req.session.user.email : 'admin'

        await productService.addProduct(p)
        const products = await productService.getProducts()
        io.emit('products', products)//<--envia al socket
        return res.redirect('/')
    } catch (err) {
        req.logger.warning(`${err.name}: ${err.message}${err.cause}`)
        res.render('createProduct', {messageError: 'Debes enviar todos los campos requeridos'})
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

export const deleteProduct2 = async(req, res) => {
    try {
        const user = await userService.getByEmail(req.session.user.email)
        const product = await productService.getProductById(req.params.pid)
        req.logger.debug('1')
        if (user.role === 'premium' && user.email == product.owner) {
            // await productService.deleteProduct(req.params.pid)
            req.logger.debug('2')
            req.logger.info(`se eliminó correctamente`)
            return res.send('ok')
            // return res.status(302).redirect('/')
            // const products = await productService.getProducts()
            // io.emit('products', products)//<--envia al socket
        }
        
        if (user.role === 'admin') {
            // await productService.deleteProduct(req.params.pid)
            req.logger.debug('2')
            req.logger.info(`se eliminó correctamente`)
            return res.send('ok')
            // return res.status(302).redirect('/')
            // const products = await productService.getProducts()
            // io.emit('products', products)//<--envia al socket
        }
        
        req.logger.debug('3')
        req.logger.info('No estas autorizado a eliminar este producto')
        return res.status(400).send(`Esta operacion no se puede hacer`);
    }
    catch (err) {
        res.status(500).send({error: err})
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.pid)
        const user = await userService.getByEmail(req.user.user.email)

        if (user.role === 'premium' && user.email !== product.owner) {
            return req.logger.info(`no puedes borrar este producto`)
        }
        
        await productService.deleteProduct(req.params.pid)
        req.logger.info(`se eliminó correctamente`)
        return res.status(200).send('Se eliminó el producto!')
    }
    catch (err) {
        console.log(err);
    }
}