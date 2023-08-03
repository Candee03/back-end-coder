import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../product/product.controller.js';
import MakeRouter from './routers.js';

class ProductRouter extends MakeRouter {
    init() {
        //!---------METODO GET-------
        this.get('/', ['ADMIN', 'USER'], getAllProducts);

        this.get('/:pid', ['USER', 'ADMIN'], getProductById);

        //!---------METODO POST-------
        this.post('/', ['ADMIN'], addProduct);

        //!---------METODO PUT--------
        this.put('/:pid', ['ADMIN'], updateProduct);

        //!---------METODO DELETE-----
        this.delete('/:pid', ['ADMIN'], deleteProduct);
    }
}

const productRouter = new ProductRouter()

export default productRouter