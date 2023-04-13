class ProductManager {
    #id = 0

    products = []

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

    addProduct (title, description, price, thumbnail, code, stock) {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        let codigoRepetido = this.products.find(p => code === p.code)
        if (codigoRepetido) {
            console.log('ERROR: Código repetido');
        } else {
            this.products.push(product)
            product.id = this.#getId()
        }
    }

    getProductById (id) {
        let productoRepetido = this.products.find(p => id === p.id)
        if (productoRepetido){
            console.log(productoRepetido);
        } else {
            console.log('Not Found');
        }
    }

    getProducts () {
        console.log(this.products);
    }
}


//!-----------Pruebas------------

// const products = new ProductManager()
// products.getProducts();

// products.addProduct('fideos', 'paquete', 200, 'imagen', 'A54FT', 3)

// products.getProducts();

// products.addProduct('fideos', 'paquete', 200, 'imagen', 'A54FT', 3)

// products.getProductById(1);
// products.getProductById(6);