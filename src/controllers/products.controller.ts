import type { RequestHandler } from 'express';

const pending: RequestHandler = (_request, response) => {
  response.status(501).json({
    message: 'Endpoint pendiente de implementación'
  });
};

export const getAllProducts: RequestHandler = pending;
export const getProductById: RequestHandler = pending;
export const createProduct: RequestHandler = pending;
export const updateProduct: RequestHandler = pending;
export const deleteProduct: RequestHandler = pending;
export const changePrice: RequestHandler = pending;

