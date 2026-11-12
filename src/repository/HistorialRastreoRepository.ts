import { AppDataSource } from "../config/data-source.js";
import { HistorialRastreo } from "../entity/HistorialRastreo.js";

export class HistorialRastreoRepository {
    private repository = AppDataSource.getRepository(HistorialRastreo);

    async create(data: Partial<HistorialRastreo>): Promise<HistorialRastreo> {
        const registro = this.repository.create(data);
        return await this.repository.save(registro);
    }

    async findByEnvioId(envioId: number): Promise<HistorialRastreo[]> {
        return await this.repository.find({
            where: { envioId },
            order: { fecha: "ASC", rastreoId: "ASC" },
        });
    }
}

export const historialRastreoRepository = new HistorialRastreoRepository();

