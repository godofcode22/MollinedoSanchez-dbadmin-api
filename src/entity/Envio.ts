import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Cliente } from "./Cliente.js";
import { Direccion } from "./Direccion.js";
import { Paquete } from "./Paquete.js";
import { HistorialRastreo } from "./HistorialRastreo.js";
import { AuditoriaEnvio } from "./AuditoriaEnvio.js";

@Entity("envios")
export class Envio {
    @PrimaryGeneratedColumn({ name: "envio_id" })
    envioId!: number;

    @Column({ type: "int", name: "remitente_id" })
    remitenteId!: number;

    @Column({ type: "int", name: "destinatario_id" })
    destinatarioId!: number;

    @Column({ type: "int", name: "direccion_origen_id" })
    direccionOrigenId!: number;

    @Column({ type: "int", name: "direccion_destino_id" })
    direccionDestinoId!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "costo_total", default: 0.00 })
    costoTotal!: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    fecha!: Date;

    @Column({
        type: "enum",
        enum: ["REGISTRADO", "EN_TRANSITO", "ENTREGADO", "CANCELADO"],
        name: "estado_global",
        default: "REGISTRADO"
    })
    estadoGlobal!: "REGISTRADO" | "EN_TRANSITO" | "ENTREGADO" | "CANCELADO";

    @ManyToOne(() => Cliente, (cliente) => cliente.enviosEnviados)
    @JoinColumn({ name: "remitente_id" })
    remitente!: Cliente;

    @ManyToOne(() => Cliente, (cliente) => cliente.enviosRecibidos)
    @JoinColumn({ name: "destinatario_id" })
    destinatario!: Cliente;

    @ManyToOne(() => Direccion)
    @JoinColumn({ name: "direccion_origen_id" })
    direccionOrigen!: Direccion;

    @ManyToOne(() => Direccion)
    @JoinColumn({ name: "direccion_destino_id" })
    direccionDestino!: Direccion;

    @OneToMany(() => Paquete, (paquete) => paquete.envio, { cascade: true })
    paquetes!: Paquete[];

    @OneToMany(() => HistorialRastreo, (historial) => historial.envio)
    historialRastreo!: HistorialRastreo[];

    @OneToMany(() => AuditoriaEnvio, (auditoria) => auditoria.envio)
    auditorias!: AuditoriaEnvio[];
}
