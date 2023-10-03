import { cartModel } from "./cart.model.js";
import { productModel } from "../product/product.model.js";

import CustomErrors from "../tools/customError.js";
import { findCartInfo } from "../tools/info.js";
import EErrors from "../tools/EErrors.js";

class CartMongo{
    constructor() {
        this.model = cartModel
    }

    async create () {
        return await this.model.create({})
    }

    /**
     * @param {string} cid del carrito 
     * @param {string} pid del producto
     */
    async addProductToCart (cid, pid) {
        const cart = await this.model.findById(cid)
        .catch(err => {
            CustomErrors.createError({
                name: 'Error al modificar el carrito',
                message: 'No existe un carrito con ese id',
                cause: findCartInfo(cid),
                code: EErrors.INVALID_TYPE
            })
        })

        const productFound = cart.products.find(p => p.product.toString() === pid.toString())
        if (productFound !== undefined) {
            return await this.model.findOneAndUpdate({_id: cid, 'products.product': pid}, { $set: { 'products.$.quantity': productFound.quantity + 1 } })
        }
        cart.products.push({product: pid, quantity:1})
        return await cart.save()
    }

    /**
     * @param {string} cid del carrito 
     * @param {string} pid del producto
     */
    async deleteOne (cid, pid) {
        await this.model.updateOne({ _id: cid }, {$pull: { products: { product: pid } }})
    }
    
    /**
     * @param {string} cid del carrito 
     */
    async deleteAll (cid) {
        await this.model.findOneAndUpdate({ _id: cid }, {$set: { products: [] } })
    }

    async deleteCart(cid) {
        return await this.model.deleteOne({_id:cid})
    }

    /**
     * @returns todos los carritos
     */
    async get () {
        return await this.model.find().lean()
    }

    /**
     * @param {string} id 
     * @returns Carrito Encontrado
     */
    async getById (id) {
        const cartFound = await this.model.find({_id: id})
        if (cartFound) {
            return cartFound
        } else {
            throw new Error(`No existe un carrito con la id ${id}`)
        }
    }

    /**
     * 
     * @param {string} cid id del carrito
     * @param {Array} products array con los productos
     */
    async updateAll(cid, products) {
        await this.model.updateOne({_id: cid}, {products: products})
    }

    /**
     * @param {string} cid 
     * @param {string} pid 
     * @param {object} quantity 
     */

    async updateOne(cid, pid, quantity) {
        const q = quantity.quantity
        const productsInCart = (await this.model.findById(cid)).products
        if (productsInCart) {
            await this.model.findOneAndUpdate({_id: cid, 'products.product': pid}, { $set: { 'products.$.quantity': q } })
        } else {
            throw new Error('no esta agregado ese producto')
        }
    }

    async getProductsPopulated(cid) {
        return (await this.model.findById(cid).populate('products.product').lean()).products
    }
}

export default CartMongo