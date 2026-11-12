import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio.js";

@Entity("auditoria_envios")
export class AuditoriaEnvio {
    @PrimaryGeneratedColumn({ name: "auditoria_id" })
    auditoriaId!: number;

    @Column({ type: "int", name: "envio_id" })
    envioId!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "costo_anterior", nullable: false })
    costoAnterior!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "costo_nuevo", nullable: false })
    costoNuevo!: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    usuario!: string;

    @Column({ type: "datetime", name: "fecha_modificacion", default: () => "CURRENT_TIMESTAMP" })
    fechaModificacion!: Date;

    @ManyToOne(() => Envio, (envio) => envio.auditorias)
    @JoinColumn({ name: "envio_id" })
    envio!: Envio;
}

