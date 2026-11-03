import { Router } from "express";
import {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
} from "../controllers/producto.controller.js";

const router = Router();

// GETALL: Obtener todos los productos
router.get("/", getAllProductos);

// GETBYID: Obtener producto por ID
router.get("/:id", getProductoById);

// POST: Crear nuevo producto
router.post("/", createProducto);
router.post("/create", createProducto);

// PUT: Actualizar producto existente por ID
router.put("/:id", updateProducto);

// DELETE: Eliminar producto por ID
router.delete("/:id", deleteProducto);

export default router;
