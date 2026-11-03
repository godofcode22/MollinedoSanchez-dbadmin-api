import { Request, Response } from "express";
import { productoRepository } from "../repository/ProductoRepository.js";

// GETALL: Obtener todos los productos
export const getAllProductos = async (req: Request, res: Response) => {
    try {
        const productos = await productoRepository.findAll();
        return res.json(productos);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al obtener los productos", error: error.message });
    }
};

// GETBYID: Obtener producto por ID
export const getProductoById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de producto inválido" });
        }
        const producto = await productoRepository.findById(id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        return res.json(producto);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
};

// Compatibilidad previa
export const getProducto = async (req: Request, res: Response) => {
    if (req.params.id) {
        return getProductoById(req, res);
    }
    return getAllProductos(req, res);
};

// POST: Crear un nuevo producto
export const createProducto = async (req: Request, res: Response) => {
    try {
        const { nombre, precio, stock, categoriaId } = req.body;
        if (!nombre || precio === undefined) {
            return res.status(400).json({ message: "Nombre y precio son obligatorios" });
        }
        const producto = await productoRepository.create({
            nombre,
            precio,
            stock: stock ?? 0,
            categoriaId
        });
        return res.status(201).json(producto);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al crear el producto", error: error.message });
    }
};

// PUT: Actualizar un producto existente
export const updateProducto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de producto inválido" });
        }
        const existing = await productoRepository.findById(id);
        if (!existing) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        const { nombre, precio, stock, categoriaId } = req.body;
        const productoActualizado = await productoRepository.update(id, {
            ...(nombre !== undefined && { nombre }),
            ...(precio !== undefined && { precio }),
            ...(stock !== undefined && { stock }),
            ...(categoriaId !== undefined && { categoriaId })
        });
        return res.json(productoActualizado);
    } catch (error: any) {
        return res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
    }
};

// DELETE: Eliminar un producto por ID
export const deleteProducto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de producto inválido" });
        }
        const existing = await productoRepository.findById(id);
        if (!existing) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        const eliminado = await productoRepository.delete(id);
        if (!eliminado) {
            return res.status(404).json({ message: "No se pudo eliminar el producto" });
        }
        return res.json({ message: "Producto eliminado correctamente", id });
    } catch (error: any) {
        return res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
    }
};
