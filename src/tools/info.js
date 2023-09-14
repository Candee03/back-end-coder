//INFO PRODUCTS
export const createProductErrorInfo = (product) => {
    return `
    * Title> ${product.title}
    * Description> ${product.description}
    * Price> ${product.price}
    * Thumbnail> ${product.thumbnail}
    * Code> ${product.code}
    * Status> ${product.status}
    * Category> ${product.category}
    * Stock> ${product.stock}`
}
export const findProductInfo = (pid) => {
    return `
        * Id Producto> ${pid}`
}

//INFO CART
export const findCartInfo = (cid) => {
    return `
        * Id Carrito> ${cid}`
}