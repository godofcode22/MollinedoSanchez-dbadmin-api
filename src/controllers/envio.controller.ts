import { Request, Response } from "express";
import { envioRepository } from "../repository/EnvioRepository.js";
import { historialRastreoRepository } from "../repository/HistorialRastreoRepository.js";

// 1. POST /api/envios -> Registra un nuevo envío y guarda sus paquetes iniciales en TypeORM
export const createEnvio = async (req: Request, res: Response) => {
    try {
        const remitenteId = req.body.remitenteId ?? req.body.remitente_id;
        const destinatarioId = req.body.destinatarioId ?? req.body.destinatario_id;
        const direccionOrigenId = req.body.direccionOrigenId ?? req.body.direccion_origen_id;
        const direccionDestinoId = req.body.direccionDestinoId ?? req.body.direccion_destino_id;
        const costoTotal = req.body.costoTotal ?? req.body.costo_total ?? 0;
        const estadoGlobal = req.body.estadoGlobal ?? req.body.estado_global ?? "REGISTRADO";
        const paquetes = Array.isArray(req.body.paquetes)
            ? req.body.paquetes.map((p: any) => ({
                  peso: p.peso,
                  dimensiones: p.dimensiones,
                  contenido: p.contenido,
                  almacenId: p.almacenId ?? p.almacen_id ?? null,
              }))
            : [];

        if (!remitenteId || !destinatarioId || !direccionOrigenId || !direccionDestinoId) {
            return res.status(400).json({
                message: "remitenteId, destinatarioId, direccionOrigenId y direccionDestinoId son obligatorios",
            });
        }

        const nuevoEnvio = await envioRepository.createEnvioConPaquetes({
            remitenteId: Number(remitenteId),
            destinatarioId: Number(destinatarioId),
            direccionOrigenId: Number(direccionOrigenId),
            direccionDestinoId: Number(direccionDestinoId),
            costoTotal: Number(costoTotal),
            estadoGlobal,
            paquetes,
        });

        return res.status(201).json(nuevoEnvio);
    } catch (error: any) {
        if (
            error?.sqlState === "45000" ||
            error?.driverError?.sqlState === "45000" ||
            error?.code === "ER_SIGNAL_EXCEPTION"
        ) {
            return res.status(400).json({
                message: error?.sqlMessage || error?.driverError?.sqlMessage || error.message,
                sqlState: "45000",
            });
        }
        return res.status(500).json({ message: "Error al registrar el envío", error: error.message });
    }
};

// 2. PUT /api/envios/:id/costo -> Modifica el costo total -> Detona Trigger after_update_envio_costo
export const updateCostoEnvio = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const nuevoCosto = req.body.costoTotal ?? req.body.costo_total ?? req.body.costo;

        if (isNaN(id) || nuevoCosto === undefined) {
            return res.status(400).json({
                message: "ID de envío válido y campo costoTotal (o costo_total) son obligatorios",
            });
        }

        const existe = await envioRepository.findById(id);
        if (!existe) {
            return res.status(404).json({ message: "Envío no encontrado" });
        }

        const envioActualizado = await envioRepository.updateCosto(id, Number(nuevoCosto));
        return res.json(envioActualizado);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al modificar el costo del envío", error: error.message });
    }
};

// 4. POST /api/envios/:id/rastreo -> Agrega rastreo -> Detona Trigger after_insert_historial_rastreo
export const addRastreoEnvio = async (req: Request, res: Response) => {
    try {
        const envioId = Number(req.params.id);
        if (isNaN(envioId)) {
            return res.status(400).json({ message: "ID de envío inválido" });
        }

        const existe = await envioRepository.findById(envioId);
        if (!existe) {
            return res.status(404).json({ message: "Envío no encontrado" });
        }

        const ubicacionActual = req.body.ubicacionActual ?? req.body.ubicacion_actual;
        const estadoEvento = req.body.estadoEvento ?? req.body.estado_evento;
        const observaciones = req.body.observaciones ?? null;

        if (!ubicacionActual || !estadoEvento) {
            return res.status(400).json({
                message: "ubicacionActual y estadoEvento son obligatorios",
            });
        }

        const nuevoRastreo = await historialRastreoRepository.create({
            envioId,
            ubicacionActual,
            estadoEvento,
            observaciones,
        });

        const envioActualizado = await envioRepository.findById(envioId);

        return res.status(201).json({
            rastreo: nuevoRastreo,
            estadoGlobalEnvio: envioActualizado?.estadoGlobal,
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Error al registrar evento de rastreo", error: error.message });
    }
};

// 5. GET /api/envios -> Consulta de envíos activos con TypeORM QueryBuilder
export const getEnviosActivos = async (req: Request, res: Response) => {
    try {
        const envios = await envioRepository.findActivosQueryBuilder();
        return res.json(envios);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al consultar envíos activos", error: error.message });
    }
};

