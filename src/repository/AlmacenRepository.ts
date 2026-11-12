import { AppDataSource } from "../config/data-source.js";
import { Almacen } from "../entity/Almacen.js";
import { Paquete } from "../entity/Paquete.js";

export class AlmacenRepository {
    private almacenRepo = AppDataSource.getRepository(Almacen);
    private paqueteRepo = AppDataSource.getRepository(Paquete);

    async findById(id: number): Promise<Almacen | null> {
        return await this.almacenRepo.findOne({
            where: { almacenId: id },
            relations: { paquetes: true },
        });
    }

    async findAll(): Promise<Almacen[]> {
        return await this.almacenRepo.find({
            relations: { paquetes: true },
        });
    }

    async create(data: Partial<Almacen>): Promise<Almacen> {
        const almacen = this.almacenRepo.create(data);
        return await this.almacenRepo.save(almacen);
    }

    async asignarPaquete(almacenId: number, paqueteData: Partial<Paquete>): Promise<Paquete> {
        const nuevoPaquete = this.paqueteRepo.create({
            ...paqueteData,
            almacenId,
        });
        return await this.paqueteRepo.save(nuevoPaquete);
    }
}

export const almacenRepository = new AlmacenRepository();

