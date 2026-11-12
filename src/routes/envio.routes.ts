import { Router } from "express";
import {
    createEnvio,
    updateCostoEnvio,
    addRastreoEnvio,
    getEnviosActivos,
} from "../controllers/envio.controller.js";

const router = Router();

// 1. POST /api/envios -> Registra un nuevo envío y guarda sus paquetes iniciales
router.post("/", createEnvio);

// 2. PUT /api/envios/:id/costo -> Modifica el costo total -> Detona Trigger after_update_envio_costo
router.put("/:id/costo", updateCostoEnvio);

// 4. POST /api/envios/:id/rastreo -> Agrega rastreo -> Detona Trigger after_insert_historial_rastreo
router.post("/:id/rastreo", addRastreoEnvio);

// 5. GET /api/envios -> Consulta de envíos activos con TypeORM QueryBuilder
router.get("/", getEnviosActivos);

export default router;

