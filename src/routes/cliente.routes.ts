import { Router } from "express";
import {
    getEnviosByCliente,
    getAllClientes,
    createCliente,
    createDireccionCliente,
} from "../controllers/cliente.controller.js";

const router = Router();

// 6. GET /api/clientes/:id/envios -> Historial de envíos vinculados a un cliente específico
router.get("/:id/envios", getEnviosByCliente);

// Rutas auxiliares de clientes y direcciones
router.get("/", getAllClientes);
router.post("/", createCliente);
router.post("/:id/direcciones", createDireccionCliente);

export default router;

