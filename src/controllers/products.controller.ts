import type { RequestHandler, Response } from 'express';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

import { pool } from '../conf/dbConnection.js';

type IdParams = {
  id: string;
};

type ProductInput = {
  name: string;
  price: number;
  stock: number;
  description: string;
  brand: string | null;
  img: string | null;
};

type ProductRow = RowDataPacket & {
  id: number;
  name: string;
  price: string;
  stock: number;
  description: string;
  brand: string | null;
  img: string | null;
  active: number;
};

type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; message: string };

const PRODUCT_COLUMNS =
  'id, name, price, stock, description, brand, img, active';

const PRODUCT_BODY_FIELDS = [
  'name',
  'price',
  'stock',
  'description',
  'brand',
  'img'
] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parsePositiveId = (value: string): number | null => {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
};

const validateRequiredText = (
  value: unknown,
  field: string,
  maxLength?: number
): ValidationResult<string> => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return {
      valid: false,
      message: `El campo ${field} es obligatorio y debe ser texto.`
    };
  }

  const normalizedValue = value.trim();

  if (maxLength !== undefined && normalizedValue.length > maxLength) {
    return {
      valid: false,
      message: `El campo ${field} no puede superar ${maxLength} caracteres.`
    };
  }

  return { valid: true, value: normalizedValue };
};

const validateOptionalText = (
  value: unknown,
  field: string,
  maxLength: number
): ValidationResult<string | null> => {
  if (value === undefined || value === null || value === '') {
    return { valid: true, value: null };
  }

  if (typeof value !== 'string') {
    return {
      valid: false,
      message: `El campo ${field} debe ser texto o null.`
    };
  }

  const normalizedValue = value.trim();

  if (normalizedValue.length > maxLength) {
    return {
      valid: false,
      message: `El campo ${field} no puede superar ${maxLength} caracteres.`
    };
  }

  return {
    valid: true,
    value: normalizedValue.length === 0 ? null : normalizedValue
  };
};

const validatePrice = (value: unknown): ValidationResult<number> => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return {
      valid: false,
      message: 'El precio debe ser un número mayor que cero.'
    };
  }

  if (value > 99_999_999.99) {
    return {
      valid: false,
      message: 'El precio supera el valor máximo permitido.'
    };
  }

  const roundedValue = Math.round(value * 100) / 100;

  if (Math.abs(value - roundedValue) > Number.EPSILON) {
    return {
      valid: false,
      message: 'El precio puede contener como máximo dos decimales.'
    };
  }

  return { valid: true, value: roundedValue };
};

const validateStock = (value: unknown): ValidationResult<number> => {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    return {
      valid: false,
      message: 'El stock debe ser un entero mayor o igual que cero.'
    };
  }

  return { valid: true, value };
};

const validateProductBody = (
  body: unknown
): ValidationResult<ProductInput> => {
  if (!isRecord(body)) {
    return {
      valid: false,
      message: 'El cuerpo de la solicitud debe ser un objeto JSON.'
    };
  }

  const allowedFields = new Set<string>(PRODUCT_BODY_FIELDS);
  const unexpectedField = Object.keys(body).find(
    (field) => !allowedFields.has(field)
  );

  if (unexpectedField !== undefined) {
    return {
      valid: false,
      message: `El campo ${unexpectedField} no está permitido.`
    };
  }

  const name = validateRequiredText(body.name, 'name', 150);
  if (!name.valid) return name;

  const price = validatePrice(body.price);
  if (!price.valid) return price;

  const stock = validateStock(body.stock);
  if (!stock.valid) return stock;

  const description = validateRequiredText(body.description, 'description');
  if (!description.valid) return description;

  const brand = validateOptionalText(body.brand, 'brand', 100);
  if (!brand.valid) return brand;

  const img = validateOptionalText(body.img, 'img', 500);
  if (!img.valid) return img;

  return {
    valid: true,
    value: {
      name: name.value,
      price: price.value,
      stock: stock.value,
      description: description.value,
      brand: brand.value,
      img: img.value
    }
  };
};

const validatePriceBody = (body: unknown): ValidationResult<number> => {
  if (!isRecord(body)) {
    return {
      valid: false,
      message: 'El cuerpo de la solicitud debe ser un objeto JSON.'
    };
  }

  const fields = Object.keys(body);

  if (fields.length !== 1 || fields[0] !== 'price') {
    return {
      valid: false,
      message: 'El cuerpo debe contener únicamente el campo price.'
    };
  }

  return validatePrice(body.price);
};

const serializeProduct = (product: ProductRow) => ({
  id: product.id,
  name: product.name,
  price: Number(product.price),
  stock: product.stock,
  description: product.description,
  brand: product.brand,
  img: product.img,
  active: Boolean(product.active)
});

const respondWithInternalError = (
  response: Response,
  operation: string,
  error: unknown
): void => {
  const errorCode =
    isRecord(error) && typeof error.code === 'string'
      ? error.code
      : 'UNKNOWN_ERROR';
  console.error(`[products] ${operation} (${errorCode})`);

  response.status(500).json({
    message: 'Ocurrió un error interno al procesar la solicitud.'
  });
};

export const getAllProducts: RequestHandler = async (_request, response) => {
  try {
    const [rows] = await pool.execute<ProductRow[]>(
      `SELECT ${PRODUCT_COLUMNS} FROM products WHERE active = TRUE`
    );

    response.status(200).json(rows.map(serializeProduct));
  } catch (error: unknown) {
    respondWithInternalError(response, 'No fue posible consultar los productos', error);
  }
};

export const getProductById: RequestHandler<IdParams> = async (
  request,
  response
) => {
  const id = parsePositiveId(request.params.id);

  if (id === null) {
    response.status(400).json({
      message: 'El ID debe ser un entero positivo.'
    });
    return;
  }

  try {
    const [rows] = await pool.execute<ProductRow[]>(
      `SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = ? AND active = TRUE`,
      [id]
    );

    const product = rows[0];

    if (product === undefined) {
      response.status(404).json({
        message: 'Producto no encontrado.'
      });
      return;
    }

    response.status(200).json(serializeProduct(product));
  } catch (error: unknown) {
    respondWithInternalError(response, 'No fue posible consultar el producto', error);
  }
};

export const createProduct: RequestHandler<
  Record<string, never>,
  unknown,
  unknown
> = async (request, response) => {
  const validation = validateProductBody(request.body);

  if (!validation.valid) {
    response.status(400).json({ message: validation.message });
    return;
  }

  const product = validation.value;

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO products (name, price, stock, description, brand, img)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.price,
        product.stock,
        product.description,
        product.brand,
        product.img
      ]
    );

    response.status(201).json({
      message: 'Producto creado correctamente.',
      product: {
        id: result.insertId,
        ...product,
        active: true
      }
    });
  } catch (error: unknown) {
    respondWithInternalError(response, 'No fue posible crear el producto', error);
  }
};

export const updateProduct: RequestHandler<IdParams, unknown, unknown> = async (
  request,
  response
) => {
  const id = parsePositiveId(request.params.id);

  if (id === null) {
    response.status(400).json({
      message: 'El ID debe ser un entero positivo.'
    });
    return;
  }

  const validation = validateProductBody(request.body);

  if (!validation.valid) {
    response.status(400).json({ message: validation.message });
    return;
  }

  const product = validation.value;

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE products
       SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ?
       WHERE id = ? AND active = TRUE`,
      [
        product.name,
        product.price,
        product.stock,
        product.description,
        product.brand,
        product.img,
        id
      ]
    );

    if (result.affectedRows === 0) {
      response.status(404).json({
        message: 'Producto no encontrado.'
      });
      return;
    }

    response.status(200).json({
      message: 'Producto actualizado correctamente.',
      product: {
        id,
        ...product,
        active: true
      }
    });
  } catch (error: unknown) {
    respondWithInternalError(response, 'No fue posible actualizar el producto', error);
  }
};

export const deleteProduct: RequestHandler<IdParams> = async (
  request,
  response
) => {
  const id = parsePositiveId(request.params.id);

  if (id === null) {
    response.status(400).json({
      message: 'El ID debe ser un entero positivo.'
    });
    return;
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE',
      [id]
    );

    if (result.affectedRows === 0) {
      response.status(404).json({
        message: 'Producto no encontrado.'
      });
      return;
    }

    response.status(200).json({
      message: 'Producto dado de baja correctamente.'
    });
  } catch (error: unknown) {
    respondWithInternalError(response, 'No fue posible dar de baja el producto', error);
  }
};

export const changePrice: RequestHandler<IdParams, unknown, unknown> = async (
  request,
  response
) => {
  const id = parsePositiveId(request.params.id);

  if (id === null) {
    response.status(400).json({
      message: 'El ID debe ser un entero positivo.'
    });
    return;
  }

  const validation = validatePriceBody(request.body);

  if (!validation.valid) {
    response.status(400).json({ message: validation.message });
    return;
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE products SET price = ? WHERE id = ? AND active = TRUE',
      [validation.value, id]
    );

    if (result.affectedRows === 0) {
      response.status(404).json({
        message: 'Producto no encontrado.'
      });
      return;
    }

    response.status(200).json({
      message: 'Precio actualizado correctamente.',
      product: {
        id,
        price: validation.value
      }
    });
  } catch (error: unknown) {
    respondWithInternalError(response, 'No fue posible cambiar el precio', error);
  }
};
