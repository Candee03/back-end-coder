import { Router } from 'express';
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../product/product.controller.js';
import { isAdmin } from '../middleware/auth.middleware.js';

const productRouter = Router();

//!---------METODO GET-------
productRouter.get('/', getAllProducts);

productRouter.get('/:pid', getProductById);

//!---------METODO POST-------
productRouter.post('/', isAdmin, addProduct);

//!---------METODO PUT--------
productRouter.put('/:pid', updateProduct);

//!---------METODO DELETE-----
productRouter.delete('/:pid', deleteProduct);

export default productRouter