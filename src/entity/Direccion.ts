import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Cliente } from "./Cliente.js";

@Entity("direcciones")
export class Direccion {
    @PrimaryGeneratedColumn({ name: "direccion_id" })
    direccionId!: number;

    @Column({ type: "int", name: "cliente_id" })
    clienteId!: number;

    @Column({ type: "varchar", length: 150, nullable: false })
    calle!: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    ciudad!: string;

    @Column({ type: "varchar", length: 10, name: "codigo_postal", nullable: false })
    codigoPostal!: string;

    @Column({ type: "enum", enum: ["ORIGEN", "DESTINO"], nullable: false })
    tipo!: "ORIGEN" | "DESTINO";

    @ManyToOne(() => Cliente, (cliente) => cliente.direcciones)
    @JoinColumn({ name: "cliente_id" })
    cliente!: Cliente;
}

