import { Router } from 'express';
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../product/product.controller.js';
import { allowedModifyProducts } from '../middleware/auth.middleware.js';


const productRouter = Router();

//!---------METODO GET-------
productRouter.get('/', allowedModifyProducts, getAllProducts);

productRouter.get('/:pid', getProductById);

//!---------METODO POST-------
productRouter.post('/', allowedModifyProducts, addProduct);

//!---------METODO PUT--------
productRouter.put('/:pid', allowedModifyProducts, updateProduct);

//!---------METODO DELETE-----
productRouter.delete('/:pid', allowedModifyProducts, deleteProduct);

export default productRouter