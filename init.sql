CREATE DATABASE IF NOT EXISTS ventas_db;
USE ventas_db;

CREATE TABLE IF NOT EXISTS categorias (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria_id INT,
    CONSTRAINT fk_productos_categorias 
        FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ventas (
    venta_id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    cliente VARCHAR(100) NOT NULL,
    total DECIMAL(10, 2) DEFAULT 0.00
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS detalle_ventas (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_detalle_ventas 
        FOREIGN KEY (venta_id) REFERENCES ventas(venta_id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_productos 
        FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
) ENGINE=InnoDB;

-- Datos de prueba iniciales
INSERT INTO categorias (nombre) VALUES ('Electrónica'), ('Accesorios');

INSERT INTO productos (nombre, precio, stock, categoria_id) VALUES 
('Laptop Gamer', 12500.00, 10, 1),
('Mouse Inalámbrico', 350.00, 25, 2);
