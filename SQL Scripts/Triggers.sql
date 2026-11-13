USE ventas_db;

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

DELIMITER ;
