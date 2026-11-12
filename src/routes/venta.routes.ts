import { Router } from "express";
import {
    getAllVentas,
    getVentaById,
    createVenta,
    updateVenta,
    deleteVenta
} from "../controllers/venta.controller.js";

const router = Router();

// GETALL: Obtener todas las ventas
router.get("/", getAllVentas);

// GETBYID: Obtener venta por ID
router.get("/:id", getVentaById);

// POST: Crear nueva venta
router.post("/", createVenta);
router.post("/create", createVenta);

// PUT: Actualizar venta existente por ID
router.put("/:id", updateVenta);

// DELETE: Eliminar venta por ID
router.delete("/:id", deleteVenta);

export default router;

