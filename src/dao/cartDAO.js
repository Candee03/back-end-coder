import { cartModel } from "./models/cart.model.js"

class CartService{
    constructor() {
        this.model = cartModel
    }

    async createCart () {
        try {
            return await this.model.create({})
        }
        catch (err) {
            console.log(`No se pudo crear el carrito`);
        }
    }

    /**
     * @param {string} id del carrito 
     * @param {object} producto
     */
    async addProductToCart (id, product) {
        try {
            const cart = await this.model.findById(id)
            const productsInCart = cart.products
            let exists = false
            const products = productsInCart.map(p => {
                if (p.pid === product._id.toString()) {
                    console.log('here');
                    exists = true
                    p.quantity ++
                }
                return p
            })
            if (!exists) products.push({pid: product._id.toString(), quantity: 1})
            await this.model.findByIdAndUpdate({_id : id}, {products: products }, { new: true })
        }
        catch (err) {
            console.log(err.name, err.message);
        }
    }

    /**
     * 
     * @returns todos los carritos
     */
    async getCarts () {
        try{
            // const carts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            return await this.model.find().lean()
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * @param {string} id 
     * @returns Carrito Encontrado
     */
    async getCartById (id) {
        try{
            // const carts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            let cartFound = await this.model.findById(id).lean()
            if (cartFound) {
                return cartFound
            } else {
                throw new Error(`No existe un carrito con la id ${id}`)
            }
        } catch (err) {
            console.log(err.name, err.message);
        }
    }
}

export default CartService