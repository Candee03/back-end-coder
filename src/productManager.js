import fs from 'fs';

class ProductManager{
    constructor(path) {
        this.path = path
        this.products = fs.promises.readFile(this.path, 'utf-8')
    }

    #id = 0

    async #getId () {
        let p = await this.getProducts()
        let maxID = 0
        if(p.length >= 1) {
            for (let i = 0; i < p.length; i++) {
                if (p[i].id > maxID) {
                    maxID = p[i].id
                }
            }
        }
        this.#id = maxID+1
        return this.#id
    }

    /**
     * @param {string} title Nombre del producto
	 * @param {string} description Descripción del producto
     * @param {number} price Precio
	 * @param {array} thumbnail Array de strings de rutas de imagenes
	 * @param {string} code Código identificador
     * @param {boolean} status Estado true por defecto
	 * @param {string} category Categoria
	 * @param {number} stock Número de piezas disponibles
     * @returns true si se pudo agregar el producto
     */
    async addProduct (title, description, price, thumbnail, code, status, category, stock) {
        try {
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                status,
                category,
                stock
            }
            if (product.title === undefined || product.category === undefined || product.status === undefined || product.description === undefined || product.price === undefined || product.code === undefined || product.stock === undefined){
                throw new Error(`Debes enviar todos los campos requeridos`)
            }
            const actualListProducts = await this.getProducts()
            let codigoRepetido = actualListProducts.find(p => code === p.code)

            if (codigoRepetido) {
                throw new Error('el codigo ingresado ya se usó')
            } else {
                product.id = await this.#getId()
                actualListProducts.push(product)
                await fs.promises.writeFile (this.path, JSON.stringify(actualListProducts))
                return true
            }
        }
        catch (err) {
            console.log(`No se pudo agregar porque ${err.message}`);
        }
    }

    /**
    * @param {number} id Id del producto a eliminar
    */
    async deleteProduct (id) {
        try{
            const actualListProducts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            let newList = await actualListProducts.filter(p => p.id !== id)

            if (await newList.length !== await actualListProducts.length) {
                await fs.promises.writeFile (this.path, JSON.stringify(newList))
            } else {
                throw new Error('Algo salio mal no se pudo borrar')
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    /**
     * @param {number} id Id del producto a eliminar
     * @param {string} title Nombre del producto
	 * @param {string} description Descripción del producto
     * @param {number} price Precio
	 * @param {string} thumbnail Ruta de imagen
	 * @param {number} stock Número de piezas disponibles
    */
    async updateProduct (id, updatedProduct) {
        try {
            const actualListProducts = await this.getProducts()
            const product = await actualListProducts.find(p => id === p.id)
            let index = await actualListProducts.findIndex((e) => e.id === product.id)

            const newProduct = {
                ...product,
                ...updatedProduct,
            }

            actualListProducts.splice(index, 1, newProduct)
            await fs.promises.writeFile (this.path, JSON.stringify(actualListProducts))
        }
        catch (err) {
            console.log(`No se puede modificar el producto con id ${id} porque no existe`);
        }
    }

    /**
     * @param {number} id 
     * @returns producto Encontrado
     */
    async getProductById (id) {
        try{
            const products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            const productoEncontrado = await products.find(p => id === p.id)
            if (await productoEncontrado === undefined) {
                throw new Error('Producto no encontrado')
            } else {
                return productoEncontrado
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    async getProducts () {
        try{
            const products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            return products
        } catch (err) {
            console.log(err);
        }
    }
}

export default ProductManager