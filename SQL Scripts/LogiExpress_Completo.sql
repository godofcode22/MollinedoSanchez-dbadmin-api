USE ventas_db;

DROP TABLE IF EXISTS auditoria_envios;
DROP TABLE IF EXISTS historial_rastreo;
DROP TABLE IF EXISTS paquetes;
DROP TABLE IF EXISTS envios;
DROP TABLE IF EXISTS almacenes;
DROP TABLE IF EXISTS direcciones;
DROP TABLE IF EXISTS clientes;

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

DROP TRIGGER IF EXISTS before_insert_paquete_almacen;
DROP TRIGGER IF EXISTS after_update_envio_costo;
DROP TRIGGER IF EXISTS after_insert_historial_rastreo;

DELIMITER //

CREATE TRIGGER before_insert_paquete_almacen
BEFORE INSERT ON paquetes
FOR EACH ROW
BEGIN
    DECLARE v_capacidad_maxima INT;
    DECLARE v_ocupacion_actual INT;

    IF NEW.almacen_id IS NOT NULL THEN
        SELECT capacidad_maxima INTO v_capacidad_maxima
        FROM almacenes
        WHERE almacen_id = NEW.almacen_id;

        SELECT COUNT(*) INTO v_ocupacion_actual
        FROM paquetes
        WHERE almacen_id = NEW.almacen_id;

        IF v_ocupacion_actual >= v_capacidad_maxima THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Capacidad maxima del almacen superada';
        END IF;
    END IF;
END //

CREATE TRIGGER after_update_envio_costo
AFTER UPDATE ON envios
FOR EACH ROW
BEGIN
    IF OLD.costo_total <> NEW.costo_total THEN
        INSERT INTO auditoria_envios (envio_id, costo_anterior, costo_nuevo, usuario, fecha_modificacion)
        VALUES (NEW.envio_id, OLD.costo_total, NEW.costo_total, CURRENT_USER(), NOW());
    END IF;
END //

CREATE TRIGGER after_insert_historial_rastreo
AFTER INSERT ON historial_rastreo
FOR EACH ROW
BEGIN
    IF NEW.estado_evento = 'ENTREGADO' THEN
        UPDATE envios
        SET estado_global = 'ENTREGADO'
        WHERE envio_id = NEW.envio_id;
    END IF;
END //

DROP PROCEDURE IF EXISTS sp_reporte_mensual_cliente //
DROP PROCEDURE IF EXISTS sp_obtener_hoja_ruta_envio //

CREATE PROCEDURE sp_reporte_mensual_cliente(
    IN p_cliente_id INT,
    IN p_mes INT,
    IN p_anio INT
)
BEGIN
    SELECT 
        c.cliente_id,
        c.nombre,
        c.correo,
        COUNT(DISTINCT e.envio_id) AS total_envios_mes,
        COUNT(DISTINCT CASE WHEN e.estado_global = 'ENTREGADO' THEN e.envio_id END) AS envios_entregados,
        COALESCE(SUM(DISTINCT e.costo_total), 0.00) AS facturacion_total,
        ROUND(
            AVG(
                CASE 
                    WHEN e.estado_global = 'ENTREGADO' AND hr.estado_evento = 'ENTREGADO' 
                    THEN TIMESTAMPDIFF(MINUTE, e.fecha, hr.fecha) / 60.0 
                END
            ), 2
        ) AS tiempo_promedio_entrega_horas
    FROM clientes c
    LEFT JOIN envios e 
        ON c.cliente_id = e.remitente_id 
        AND MONTH(e.fecha) = p_mes 
        AND YEAR(e.fecha) = p_anio
    LEFT JOIN historial_rastreo hr 
        ON e.envio_id = hr.envio_id 
        AND hr.estado_evento = 'ENTREGADO'
    WHERE c.cliente_id = p_cliente_id
    GROUP BY c.cliente_id, c.nombre, c.correo;
END //

CREATE PROCEDURE sp_obtener_hoja_ruta_envio(
    IN p_envio_id INT
)
BEGIN
    SELECT 
        e.envio_id,
        e.fecha AS fecha_envio,
        e.estado_global,
        e.costo_total,
        rem.nombre AS remitente,
        dest.nombre AS destinatario,
        dir_o.calle AS calle_origen,
        dir_o.ciudad AS ciudad_origen,
        dir_d.calle AS calle_destino,
        dir_d.ciudad AS ciudad_destino,
        p.paquete_id,
        p.peso,
        p.dimensiones,
        p.contenido,
        hr.rastreo_id,
        hr.fecha AS fecha_evento,
        hr.ubicacion_actual,
        hr.estado_evento,
        hr.observaciones
    FROM envios e
    INNER JOIN clientes rem ON e.remitente_id = rem.cliente_id
    INNER JOIN clientes dest ON e.destinatario_id = dest.cliente_id
    INNER JOIN direcciones dir_o ON e.direccion_origen_id = dir_o.direccion_id
    INNER JOIN direcciones dir_d ON e.direccion_destino_id = dir_d.direccion_id
    LEFT JOIN paquetes p ON e.envio_id = p.envio_id
    LEFT JOIN historial_rastreo hr ON e.envio_id = hr.envio_id
    WHERE e.envio_id = p_envio_id
    ORDER BY hr.fecha ASC, hr.rastreo_id ASC;
END //

DELIMITER ;

INSERT INTO clientes (nombre, correo, estado, limite_credito) VALUES
('Dylan Mollinedo', 'dylan@correo.com', 'ACTIVO', 15000.00),
('Carlos Mendoza', 'carlos@correo.com', 'ACTIVO', 10000.00);

INSERT INTO direcciones (cliente_id, calle, ciudad, codigo_postal, tipo) VALUES
(1, 'Av. Reforma 123', 'CDMX', '06600', 'ORIGEN'),
(2, 'Calle Juarez 456', 'Monterrey', '64000', 'DESTINO');

INSERT INTO almacenes (nombre, ubicacion, capacidad_maxima) VALUES
('Almacen Central CDMX', 'Zona Industrial Norte', 2),
('Almacen Hub Monterrey', 'Parque Logistico Apodaca', 50);

