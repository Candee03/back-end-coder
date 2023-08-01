import { cartModel } from "./cart.model.js";
import { productModel } from "../product/product.model.js";

class CartMongo{
    constructor() {
        this.model = cartModel
    }

    async create () {
        try {
            return await this.model.create({})
        }
        catch (err) {
            console.log(`No se pudo crear el carrito`);
        }
    }

    /**
     * @param {string} cid del carrito 
     * @param {string} pid del producto
     */
    async addProductToCart (cid, pid) {
        try {
            const cart = await this.model.findById(cid)
            const productFound = cart.products.find(p => p.product.toString() === pid.toString())
            if (productFound !== undefined) {
                return await this.model.findOneAndUpdate({_id: cid, 'products.product': pid}, { $set: { 'products.$.quantity': productFound.quantity + 1 } })
            }
            cart.products.push({product: pid, quantity:1})
            return await cart.save()
        }
        catch (err) {
            console.log(err.name, err.message);
        }
    }

    /**
     * @param {string} cid del carrito 
     * @param {string} pid del producto
     */
    async deleteOne (cid, pid) {
        try {
            await this.model.updateOne({ _id: cid }, {$pull: { products: { product: pid } }})
        }
        catch (err) {
            console.log(err.name, err.message);
        }
    }
    
    /**
     * @param {string} cid del carrito 
     */
    async deleteAll (cid) {
        try {
            await this.model.findOneAndUpdate({ _id: cid }, {$set: { products: [] } })
        }
        catch (err) {
            console.log(err.name, err.message);
        }
    }

    /**
     * @returns todos los carritos
     */
    async get () {
        try{
            return await this.model.find().lean()
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * @param {string} id 
     * @returns Carrito Encontrado
     */
    async getById (id) {
        try{
            const cartFound = await this.model.find({_id: id})
            if (cartFound) {
                return cartFound
            } else {
                throw new Error(`No existe un carrito con la id ${id}`)
            }
        } catch (err) {
            console.log(err.name, err.message);
        }
    }

    /**
     * 
     * @param {string} cid id del carrito
     * @param {Array} products array con los productos
     */
    async updateAll(cid, products) {
        try {
            await this.model.updateOne({_id: cid}, {products: products})
        }
        catch (err) {
            console.log(err);
        }
    }

    /**
     * @param {string} cid 
     * @param {string} pid 
     * @param {object} quantity 
     */

    async updateOne(cid, pid, quantity) {
        try {
            const q = quantity.quantity
            const productsInCart = (await this.model.findById(cid)).products
            if (productsInCart) {
                await this.model.findOneAndUpdate({_id: cid, 'products.product': pid}, { $set: { 'products.$.quantity': q } })
            } else {
                throw new Error('no esta agregado ese producto')
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    async getProductsPopulated(cid) {
        return (await this.model.findById(cid).populate('products.product').lean()).products
    }
}

export default CartMongo