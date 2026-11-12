import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Direccion } from "./Direccion.js";
import { Envio } from "./Envio.js";

@Entity("clientes")
export class Cliente {
    @PrimaryGeneratedColumn({ name: "cliente_id" })
    clienteId!: number;

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre!: string;

    @Column({ type: "varchar", length: 100, nullable: false, unique: true })
    correo!: string;

    @Column({ type: "enum", enum: ["ACTIVO", "INACTIVO"], default: "ACTIVO" })
    estado!: "ACTIVO" | "INACTIVO";

    @Column({ type: "decimal", precision: 10, scale: 2, name: "limite_credito", default: 0.00 })
    limiteCredito!: number;

    @OneToMany(() => Direccion, (direccion) => direccion.cliente)
    direcciones!: Direccion[];

    @OneToMany(() => Envio, (envio) => envio.remitente)
    enviosEnviados!: Envio[];

    @OneToMany(() => Envio, (envio) => envio.destinatario)
    enviosRecibidos!: Envio[];
}

