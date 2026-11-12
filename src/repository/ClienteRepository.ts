import { AppDataSource } from "../config/data-source.js";
import { Cliente } from "../entity/Cliente.js";
import { Direccion } from "../entity/Direccion.js";

export class ClienteRepository {
    private repository = AppDataSource.getRepository(Cliente);
    private direccionRepo = AppDataSource.getRepository(Direccion);

    async findById(id: number): Promise<Cliente | null> {
        return await this.repository.findOne({
            where: { clienteId: id },
            relations: { direcciones: true },
        });
    }

    async findAll(): Promise<Cliente[]> {
        return await this.repository.find({
            relations: { direcciones: true },
        });
    }

    async create(data: Partial<Cliente>): Promise<Cliente> {
        const cliente = this.repository.create(data);
        return await this.repository.save(cliente);
    }

    async createDireccion(data: Partial<Direccion>): Promise<Direccion> {
        const direccion = this.direccionRepo.create(data);
        return await this.direccionRepo.save(direccion);
    }
}

export const clienteRepository = new ClienteRepository();

