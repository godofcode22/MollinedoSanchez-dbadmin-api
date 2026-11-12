import { Router } from "express";
import {
    asignarPaqueteAlmacen,
    getAllAlmacenes,
    createAlmacen,
} from "../controllers/almacen.controller.js";

const router = Router();

// 3. POST /api/almacenes/:id/paquetes -> Asigna paquete -> Detona Trigger before_insert_paquete_almacen (45000 -> HTTP 400)
router.post("/:id/paquetes", asignarPaqueteAlmacen);

// Rutas auxiliares de almacenes
router.get("/", getAllAlmacenes);
router.post("/", createAlmacen);

export default router;

