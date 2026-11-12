import { Request, Response } from "express";
import { envioRepository } from "../repository/EnvioRepository.js";
import { clienteRepository } from "../repository/ClienteRepository.js";

// 6. GET /api/clientes/:id/envios -> Historial de envíos vinculados a un cliente específico
export const getEnviosByCliente = async (req: Request, res: Response) => {
    try {
        const clienteId = Number(req.params.id);
        if (isNaN(clienteId)) {
            return res.status(400).json({ message: "ID de cliente inválido" });
        }

        const envios = await envioRepository.findByClienteId(clienteId);
        return res.json(envios);
    } catch (error: any) {
        return res.status(500).json({
            message: "Error al obtener el historial de envíos del cliente",
            error: error.message,
        });
    }
};

export const getAllClientes = async (req: Request, res: Response) => {
    try {
        const clientes = await clienteRepository.findAll();
        return res.json(clientes);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al obtener clientes", error: error.message });
    }
};

export const createCliente = async (req: Request, res: Response) => {
    try {
        const { nombre, correo, estado } = req.body;
        const limiteCredito = req.body.limiteCredito ?? req.body.limite_credito ?? 0;
        if (!nombre || !correo) {
            return res.status(400).json({ message: "nombre y correo son obligatorios" });
        }
        const cliente = await clienteRepository.create({
            nombre,
            correo,
            estado: estado ?? "ACTIVO",
            limiteCredito: Number(limiteCredito),
        });
        return res.status(201).json(cliente);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al crear cliente", error: error.message });
    }
};

export const createDireccionCliente = async (req: Request, res: Response) => {
    try {
        const clienteId = Number(req.params.id);
        const { calle, ciudad, tipo } = req.body;
        const codigoPostal = req.body.codigoPostal ?? req.body.codigo_postal;
        if (isNaN(clienteId) || !calle || !ciudad || !codigoPostal || !tipo) {
            return res.status(400).json({
                message: "clienteId, calle, ciudad, codigoPostal y tipo (ORIGEN/DESTINO) son obligatorios",
            });
        }
        const direccion = await clienteRepository.createDireccion({
            clienteId,
            calle,
            ciudad,
            codigoPostal,
            tipo,
        });
        return res.status(201).json(direccion);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al crear dirección", error: error.message });
    }
};

