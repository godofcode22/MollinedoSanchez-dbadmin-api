USE ventas_db;

INSERT INTO clientes (nombre, correo, estado, limite_credito) VALUES
('Dylan Mollinedo', 'dylan@correo.com', 'ACTIVO', 15000.00),
('Carlos Mendoza', 'carlos@correo.com', 'ACTIVO', 10000.00);

INSERT INTO direcciones (cliente_id, calle, ciudad, codigo_postal, tipo) VALUES
(1, 'Av. Reforma 123', 'CDMX', '06600', 'ORIGEN'),
(2, 'Calle Juarez 456', 'Monterrey', '64000', 'DESTINO');

INSERT INTO almacenes (nombre, ubicacion, capacidad_maxima) VALUES
('Almacen Central CDMX', 'Zona Industrial Norte', 2),
('Almacen Hub Monterrey', 'Parque Logistico Apodaca', 50);
