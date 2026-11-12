import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Paquete } from "./Paquete.js";

@Entity("almacenes")
export class Almacen {
    @PrimaryGeneratedColumn({ name: "almacen_id" })
    almacenId!: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre!: string;

    @Column({ type: "varchar", length: 200, nullable: false })
    ubicacion!: string;

    @Column({ type: "int", name: "capacidad_maxima", nullable: false })
    capacidadMaxima!: number;

    @OneToMany(() => Paquete, (paquete) => paquete.almacen)
    paquetes!: Paquete[];
}
