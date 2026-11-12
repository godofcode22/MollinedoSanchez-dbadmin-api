import express, { Request, Response } from 'express';
import envioRoutes from './routes/envio.routes.js';
import almacenRoutes from './routes/almacen.routes.js';
import clienteRoutes from './routes/cliente.routes.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Registro de rutas del sistema de envíos
app.use('/api/envios', envioRoutes);
app.use('/api/almacenes', almacenRoutes);
app.use('/api/clientes', clienteRoutes);

// Ruta de prueba/salud
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

export default app;
