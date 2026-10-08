import { Router } from 'express';

import {
  changePrice,
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct
} from '../controllers/products.controller.js';

const productsRouter = Router();

productsRouter.get('/getAll', getAllProducts);
productsRouter.get('/getById/:id', getProductById);
productsRouter.post('/create', createProduct);
productsRouter.put('/update/:id', updateProduct);
productsRouter.delete('/delete/:id', deleteProduct);
productsRouter.patch('/change-price/:id', changePrice);

export default productsRouter;

