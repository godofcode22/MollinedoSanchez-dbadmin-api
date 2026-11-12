import { Request, Response } from "express";
import { ventaRepository } from "../repository/VentaRepository.js";

// GETALL: Obtener todas las ventas
export const getAllVentas = async (req: Request, res: Response) => {
    try {
        const ventas = await ventaRepository.findAll();
        return res.json(ventas);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al obtener las ventas", error: error.message });
    }
};

// GETBYID: Obtener venta por ID
export const getVentaById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de venta inválido" });
        }
        const venta = await ventaRepository.findById(id);
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        return res.json(venta);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al obtener la venta", error: error.message });
    }
};

// POST: Crear una nueva venta
export const createVenta = async (req: Request, res: Response) => {
    try {
        const { cliente, total, fecha, detalles } = req.body;
        if (!cliente) {
            return res.status(400).json({ message: "El campo cliente es obligatorio" });
        }

        // Si se incluyen detalles pero no subtotal o total calculado, calcularlo si es posible
        let totalCalculado = total !== undefined ? Number(total) : 0;
        let detallesFormateados = detalles;

        if (Array.isArray(detalles) && detalles.length > 0) {
            let suma = 0;
            detallesFormateados = detalles.map((d: any) => {
                const subtotal = d.subtotal !== undefined ? Number(d.subtotal) : (Number(d.precioUnitario || 0) * Number(d.cantidad || 1));
                suma += subtotal;
                return {
                    ...d,
                    subtotal
                };
            });
            if (total === undefined) {
                totalCalculado = suma;
            }
        }

        const nuevaVenta = await ventaRepository.create({
            cliente,
            total: totalCalculado,
            ...(fecha && { fecha: new Date(fecha) }),
            ...(detallesFormateados && { detalles: detallesFormateados })
        });

        return res.status(201).json(nuevaVenta);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al crear la venta", error: error.message });
    }
};

// PUT: Actualizar una venta existente
export const updateVenta = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de venta inválido" });
        }
        const existing = await ventaRepository.findById(id);
        if (!existing) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        const { cliente, total, fecha } = req.body;
        const ventaActualizada = await ventaRepository.update(id, {
            ...(cliente !== undefined && { cliente }),
            ...(total !== undefined && { total: Number(total) }),
            ...(fecha !== undefined && { fecha: new Date(fecha) })
        });

        return res.json(ventaActualizada);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al actualizar la venta", error: error.message });
    }
};

// DELETE: Eliminar una venta por ID
export const deleteVenta = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de venta inválido" });
        }
        const existing = await ventaRepository.findById(id);
        if (!existing) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        const eliminado = await ventaRepository.delete(id);
        if (!eliminado) {
            return res.status(404).json({ message: "No se pudo eliminar la venta" });
        }
        return res.json({ message: "Venta eliminada correctamente", id });
    } catch (error: any) {
        return res.status(500).json({ message: "Error al eliminar la venta", error: error.message });
    }
};

