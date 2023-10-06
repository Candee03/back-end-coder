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
        const products = await productService.getProducts(limit, page, sort, category, status)
        return res.status(200).send(products)
    }
    catch (err) {
        req.logger.error(err)
        return res.status(400).send({error: `error en la request`, message: err.message})
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
        const owner = req.user.user.role === 'premium'? req.user.user.email : 'admin'
        const bodyProduct = req.body
        const p = new ShowProductDto({
            ...bodyProduct,
            owner: owner
        }).createProduct()

        await productService.addProduct(p)
        const products = await productService.getProducts()
        io.emit('products', products)//<--envia al socket
        return res.status(200).send(p)
        
    } catch (err) {
        req.logger.warning(`${err.name}: ${err.message}${err.cause}`)
        res.status(400).render('createProduct', {messageError: 'Debes enviar todos los campos requeridos'})
    }
}

export const updateProduct = async(req, res) => {
    try {
        const productUpdated = req.body
        //SI SE ENVIA EL BODY VACIO NO CAMBIA NADA
        if(Object.keys(productUpdated).length === 0) {
            return res.status(204).send({err:'no mandaste ninguna propiedad para modificar'})
        }
        //SI LA ID DEL PRODUCTO A MODIFICAR NO ES CORRECTA SALTA ERROR
        const product = await productService.getProductById(req.params.pid)
        .catch(err => {
            CustomErrors.createError({
                name: 'El producto que estas buscando no existe',
                message: err.message,
                cause: `Estas tratando de modificar el producto con la id ${req.params.pid} pero no es correcta`,
                code: EErrors.INVALID_TYPE
            })
        })

        const user = await userService.getByEmail(req.session.user.email)

        //SI EL PRODUCTO NO LE PERTENECE AL USUARIO PREMIUM SALTA ERROR
        if (user.role === 'premium' && user.email !== product.owner) {
            CustomErrors.createError({
                name: 'Error al modificar',
                message: 'No tienes permiso para modificar este producto',
                cause: 'El producto no es tuyo',
                code: EErrors.INVALID_TYPE
            })
        }
        //SI INTENTA CAMBIAR PROIEDADES QUE NO SE PUEDEN MODIFICAR
        if (productUpdated.owner || productUpdated._id || productUpdated.code) {
            CustomErrors.createError({
                name: 'No se puedo actualizar',
                message: 'hay propiedades que intentas cambiar que no se pueden modificar',
                cause: `No se pueden modificar esas propiedades`,
                code: EErrors.INVALID_TYPE
            })
        }

        const p = new ShowProductDto({
            ...product,
            ...productUpdated,
        }).getUpdated()

        await productService.updateProduct(req.params.pid, p)

        //ACTUALIZA EL SOCKET
        const products = await productService.getProducts()
        io.emit('products', products)//<--envia al socket
        req.logger.info('el producto se actualizó correctamente')
        return res.status(201).send(p);

    } catch (err) {
        req.logger.error(`${err.name}: ${err.message}`)
        return res.status(400).send(err)
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
        req.logger.error(`${err.name}: ${err.message}`)
        return res.status(400).send(err)
    }
}