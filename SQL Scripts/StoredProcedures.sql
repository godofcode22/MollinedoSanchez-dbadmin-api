USE ventas_db;

DROP PROCEDURE IF EXISTS sp_reporte_mensual_cliente;
DROP PROCEDURE IF EXISTS sp_obtener_hoja_ruta_envio;

DELIMITER //

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
