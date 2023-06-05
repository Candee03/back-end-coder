import fs from 'fs';

class CartManager{
    constructor(path) {
        this.path = path
        this.carts = fs.promises.readFile(this.path, 'utf-8')
    }
    #id = 0
    async #getId () {
        let c = await this.getCarts()
        let maxID = 0
        if(c.length >= 1) {
            for (let i = 0; i < c.length; i++) {
                if (c[i].id > maxID) {
                    maxID = c[i].id
                }
            }
        }
        this.#id = maxID+1
        return this.#id
    }

    async createCart () {
        try {
            const cart = {
                products: []
            }
            const actualListCarts = await this.getCarts()

            cart.id = await this.#getId()
            actualListCarts.push(cart)
            await fs.promises.writeFile (this.path, JSON.stringify(actualListCarts))
        }
        catch (err) {
            console.log(`No se pudo crear el carrito`);
        }
    }

    /**
     * @param {number} id 
     * @param {object} producto
     */
    async addProductToCart (id, product) {
        try {
            const actualListCarts = await this.getCarts()
            const cart = await actualListCarts.find(c => id === c.id)
            if (cart && product !== undefined) {
                const newProduct = {
                    "product": product.id,
                    "quantity": 1
                }
                const productoRepetido = cart.products.find(p => product.id === p.product)
                if(productoRepetido) {
                    productoRepetido.quantity++
                } else {
                    cart.products.push(newProduct)
                }
                await fs.promises.writeFile (this.path, JSON.stringify(actualListCarts))
            } else {
                throw new Error('no existe un carrito con ese id')
            }
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
            const carts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            return carts
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * @param {number} id 
     * @returns Carrito Encontrado
     */
    async getCartById (id) {
        try{
            const carts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            let cartEncontrado = carts.find(c => id === c.id)
            if (cartEncontrado) {
                return cartEncontrado
            } else {
                throw new Error(`No existe un carrito con la id ${id}`)
            }
        } catch (err) {
            console.log(err.name, err.message);
        }
    }
}

export default CartManager