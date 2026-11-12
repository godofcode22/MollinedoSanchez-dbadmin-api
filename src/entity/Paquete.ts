import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Envio } from "./Envio.js";
import { Almacen } from "./Almacen.js";

@Entity("paquetes")
export class Paquete {
    @PrimaryGeneratedColumn({ name: "paquete_id" })
    paqueteId!: number;

    @Column({ type: "int", name: "envio_id" })
    envioId!: number;

    @Column({ type: "int", name: "almacen_id", nullable: true })
    almacenId!: number | null;

    @Column({ type: "decimal", precision: 8, scale: 2, nullable: false })
    peso!: number;

    @Column({ type: "varchar", length: 50, nullable: false })
    dimensiones!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    contenido!: string;

    @ManyToOne(() => Envio, (envio) => envio.paquetes)
    @JoinColumn({ name: "envio_id" })
    envio!: Envio;

    @ManyToOne(() => Almacen, (almacen) => almacen.paquetes)
    @JoinColumn({ name: "almacen_id" })
    almacen!: Almacen | null;
}
