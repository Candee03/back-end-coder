const fs = require('fs')

class ProductManager{
    constructor(path) {
        this.path = path
        this.products = fs.promises.writeFile (this.path, JSON.stringify([]))
    }

    #id = 0
    #getId () {
        this.#id++
        return this.#id
    }

    /**
     * @param {string} title Nombre del producto
	 * @param {string} description Descripción del producto
     * @param {number} price Precio
	 * @param {string} thumbnail Ruta de imagen
	 * @param {string} code Código identificador
	 * @param {number} stock Número de piezas disponibles
     */
    async addProduct (title, description, price, thumbnail, code, stock) {
        try {
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
            if (product.title === undefined || product.code === undefined || product.stock === undefined) return err
            
            const actualListProducts = await this.getProducts()
            let codigoRepetido = actualListProducts.find(p => code === p.code)

            if (codigoRepetido) {
                console.log('ERROR: Código repetido');
                return err
            } else {
                product.id = this.#getId()
                actualListProducts.push(product)
                await fs.promises.writeFile (this.path, JSON.stringify(actualListProducts))
            }
        }
        catch (err) {
            console.log(`No se pudo agregar`);
        }
    }

    /**
    * @param {number} id Id del producto a eliminar
    */
    async deleteProduct (id) {
        try{
            const actualListProducts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            let newList = actualListProducts.filter(p => p.id !== id)
            if (newList.length === actualListProducts.length) {
                return err
            } else {
                await fs.promises.writeFile (this.path, JSON.stringify(newList))
            }
        } catch (err) {
            console.log('No se pudo borrar');
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
    async updateProduct (id, title, description, price, thumbnail, stock) {
        try {
            const actualListProducts = await this.getProducts()
            const product = await actualListProducts.find(p => id === p.id)
            let index = await actualListProducts.findIndex((e) => e.id === product.id)

            const updatedProduct = {
                ...product,
                title: title ?? product.title,
                description: description ?? product.description,
                price: price ?? product.price,
                thumbnail: thumbnail ?? product.thumbnail,
                stock:stock ?? product.stock
            }

            actualListProducts.splice(index, 1, updatedProduct)
            await fs.promises.writeFile (this.path, JSON.stringify(actualListProducts))
        }
        catch (err) {
            console.log(`No se puede modificar el producto con id ${id} porque no existe`);
        }
    }

    /**
     * @param {number} id 
     * @returns productoEncontrado
     */
    async getProductById (id) {
        try{
            const products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            let productoEncontrado = products.find(p => id === p.id)
            if (productoEncontrado === undefined) {
                return err
            } else {
                return productoEncontrado
            }
        } catch (err) {
            console.log('Not Found');
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


//!-----------Pruebas------------

// const products = new ProductManager('./productos.json')

// setTimeout(()=>{test()},3000)

// const test = async () => {
//     // console.log(await products.getProducts());

//     await products.addProduct('fideos', 'paquete', 200, 'imagen', 'A54FT', 3)
//     await products.addProduct('arroz', 'paquete', 600, 'imagen', 'PFFG45', 5)
//     await products.addProduct('polenta', 'paquete', 300, 'imagen', 'DFR56', 5)
    
//     // console.log(await products.getProducts());
    
//     // console.log(await products.getProductById(1))
//     // console.log(await products.getProductById(6))
//     await products.updateProduct(1,'fideitos','paquete de 500gr', null, null, 20)
    
//     await products.deleteProduct(1)
//     console.log(await products.getProducts());
// }