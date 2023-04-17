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

const listProducts = [
    {
        nombre: 'fideos',
        description: 'paquete',
        precio: 200,
        img: 'imagen',
        codigo: 'A54FT',
        stock: 3
    },
    {
        nombre: 'arroz',
        description: 'paquete',
        precio: 400,
        img: 'imagen',
        codigo: 'BFF456',
        stock: 4
    },
    {
        nombre: 'polenta',
        description: 'paquete',
        precio: 300,
        img: 'imagen',
        codigo: 'PRS56T',
        stock: 5
    }
]

const agregar = () => {
    listProducts.map((p) => {
        products.addProduct(p.nombre, p.description, p.precio, p.img, p.codigo, p.stock)
    })
} 
agregar()



// products.getProducts();

// products.addProduct('fideos', 'paquete', 200, 'imagen', 'A54FT', 3)

// products.getProductById(1);
// products.getProductById(6);