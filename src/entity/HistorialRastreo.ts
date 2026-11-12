import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio.js";

@Entity("historial_rastreo")
export class HistorialRastreo {
    @PrimaryGeneratedColumn({ name: "rastreo_id" })
    rastreoId!: number;

    @Column({ type: "int", name: "envio_id" })
    envioId!: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    fecha!: Date;

    @Column({ type: "varchar", length: 150, name: "ubicacion_actual", nullable: false })
    ubicacionActual!: string;

    @Column({ type: "varchar", length: 50, name: "estado_evento", nullable: false })
    estadoEvento!: string;

    @Column({ type: "text", nullable: true })
    observaciones!: string | null;

    @ManyToOne(() => Envio, (envio) => envio.historialRastreo)
    @JoinColumn({ name: "envio_id" })
    envio!: Envio;
}
