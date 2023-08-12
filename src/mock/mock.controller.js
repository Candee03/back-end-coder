import { faker } from '@faker-js/faker'
import { ShowProductDto } from '../product/product.DTO.js'


faker.instead = 'es'
/**
 * 
 * @param {Number} limit limite de generacion de productos
 */
export const getMockingProducts = (limit) => {
    let products = {'docs': []}
    for (let i = 0; i < limit; i++) {
        products.docs.push(new ShowProductDto(generateProduct()).getProduct())
    }
    return products
}

const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: [faker.image.url()],
        code: faker.string.numeric({ length: 5, exclude: ['0'] }),
        status: true,
        category: faker.commerce.department(),
        stock: faker.number.int(10),
        _id: faker.database.mongodbObjectId(),
    }
}