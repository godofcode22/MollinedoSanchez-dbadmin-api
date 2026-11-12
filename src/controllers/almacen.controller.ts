import { Request, Response } from "express";
import { almacenRepository } from "../repository/AlmacenRepository.js";

// 3. POST /api/almacenes/:id/paquetes -> Asigna paquete -> Detona Trigger before_insert_paquete_almacen (Capturar error 45000 -> HTTP 400)
export const asignarPaqueteAlmacen = async (req: Request, res: Response) => {
    try {
        const almacenId = Number(req.params.id);
        if (isNaN(almacenId)) {
            return res.status(400).json({ message: "ID de almacén inválido" });
        }

        const envioId = req.body.envioId ?? req.body.envio_id;
        const { peso, dimensiones, contenido } = req.body;

        if (!envioId || peso === undefined || !dimensiones || !contenido) {
            return res.status(400).json({
                message: "envioId, peso, dimensiones y contenido son obligatorios",
            });
        }

        const paqueteCreado = await almacenRepository.asignarPaquete(almacenId, {
            envioId: Number(envioId),
            peso: Number(peso),
            dimensiones,
            contenido,
        });

        return res.status(201).json(paqueteCreado);
    } catch (error: any) {
        if (
            error?.sqlState === "45000" ||
            error?.driverError?.sqlState === "45000" ||
            error?.code === "ER_SIGNAL_EXCEPTION" ||
            error?.errno === 1644
        ) {
            return res.status(400).json({
                message: error?.sqlMessage || error?.driverError?.sqlMessage || "Capacidad maxima del almacen superada",
                sqlState: "45000",
            });
        }
        return res.status(500).json({ message: "Error al asignar paquete al almacén", error: error.message });
    }
};

export const getAllAlmacenes = async (req: Request, res: Response) => {
    try {
        const almacenes = await almacenRepository.findAll();
        return res.json(almacenes);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al obtener almacenes", error: error.message });
    }
};

export const createAlmacen = async (req: Request, res: Response) => {
    try {
        const { nombre, ubicacion } = req.body;
        const capacidadMaxima = req.body.capacidadMaxima ?? req.body.capacidad_maxima;
        if (!nombre || !ubicacion || capacidadMaxima === undefined) {
            return res.status(400).json({ message: "nombre, ubicacion y capacidadMaxima son obligatorios" });
        }
        const almacen = await almacenRepository.create({
            nombre,
            ubicacion,
            capacidadMaxima: Number(capacidadMaxima),
        });
        return res.status(201).json(almacen);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al crear almacén", error: error.message });
    }
};

