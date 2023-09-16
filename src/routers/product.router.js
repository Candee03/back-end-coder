import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../product/product.controller.js';
import MakeRouter from './routers.js';

class ProductRouter extends MakeRouter {
    init() {
        //!---------METODO GET-------
        this.get('/', ['ADMIN', 'USER', 'PREMIUM'], getAllProducts);

        this.get('/:pid', ['USER', 'ADMIN', 'PREMIUM'], getProductById);

        //!---------METODO POST-------
        this.post('/', ['ADMIN','PREMIUM'], addProduct);

        //!---------METODO PUT--------
        this.put('/:pid', ['ADMIN', 'PREMIUM'], updateProduct);

        //!---------METODO DELETE-----
        this.delete('/:pid', ['ADMIN', 'PREMIUM'], deleteProduct);
    }
}

const productRouter = new ProductRouter()

export default productRouter