import express, { Request, Response } from 'express';
import userRoutes from './routes/user.routes.js';
import productoRoutes from './routes/producto.routes.js';
import ventaRoutes from './routes/venta.routes.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Registro de rutas
app.use('/api', userRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);

// Ruta de prueba/salud
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

export default app;
