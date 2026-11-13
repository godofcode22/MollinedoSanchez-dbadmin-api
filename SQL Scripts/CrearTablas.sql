USE ventas_db;


CREATE TABLE clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    limite_credito DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE direcciones (
    direccion_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    calle VARCHAR(150) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    tipo ENUM('ORIGEN', 'DESTINO') NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

CREATE TABLE almacenes (
    almacen_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(200) NOT NULL,
    capacidad_maxima INT NOT NULL
);

CREATE TABLE envios (
    envio_id INT AUTO_INCREMENT PRIMARY KEY,
    remitente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    direccion_origen_id INT NOT NULL,
    direccion_destino_id INT NOT NULL,
    costo_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_global ENUM('REGISTRADO', 'EN_TRANSITO', 'ENTREGADO', 'CANCELADO') NOT NULL DEFAULT 'REGISTRADO',
    FOREIGN KEY (remitente_id) REFERENCES clientes(cliente_id),
    FOREIGN KEY (destinatario_id) REFERENCES clientes(cliente_id),
    FOREIGN KEY (direccion_origen_id) REFERENCES direcciones(direccion_id),
    FOREIGN KEY (direccion_destino_id) REFERENCES direcciones(direccion_id)
);

CREATE TABLE paquetes (
    paquete_id INT AUTO_INCREMENT PRIMARY KEY,
    envio_id INT NOT NULL,
    almacen_id INT NULL,
    peso DECIMAL(8, 2) NOT NULL,
    dimensiones VARCHAR(50) NOT NULL,
    contenido VARCHAR(255) NOT NULL,
    FOREIGN KEY (envio_id) REFERENCES envios(envio_id),
    FOREIGN KEY (almacen_id) REFERENCES almacenes(almacen_id)
);

CREATE TABLE historial_rastreo (
    rastreo_id INT AUTO_INCREMENT PRIMARY KEY,
    envio_id INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ubicacion_actual VARCHAR(150) NOT NULL,
    estado_evento VARCHAR(50) NOT NULL,
    observaciones TEXT,
    FOREIGN KEY (envio_id) REFERENCES envios(envio_id)
);

CREATE TABLE auditoria_envios (
    auditoria_id INT AUTO_INCREMENT PRIMARY KEY,
    envio_id INT NOT NULL,
    costo_anterior DECIMAL(10, 2) NOT NULL,
    costo_nuevo DECIMAL(10, 2) NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    fecha_modificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (envio_id) REFERENCES envios(envio_id)
);
