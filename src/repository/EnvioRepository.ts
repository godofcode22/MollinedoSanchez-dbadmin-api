import { AppDataSource } from "../config/data-source.js";
import { Envio } from "../entity/Envio.js";

export class EnvioRepository {
    private repository = AppDataSource.getRepository(Envio);

    async createEnvioConPaquetes(envioData: Partial<Envio>): Promise<Envio> {
        const nuevoEnvio = this.repository.create(envioData);
        const guardado = await this.repository.save(nuevoEnvio);
        return (await this.findById(guardado.envioId)) ?? guardado;
    }

    async findById(id: number): Promise<Envio | null> {
        return await this.repository.findOne({
            where: { envioId: id },
            relations: {
                remitente: true,
                destinatario: true,
                direccionOrigen: true,
                direccionDestino: true,
                paquetes: true,
                historialRastreo: true,
                auditorias: true,
            },
        });
    }

    async updateCosto(id: number, nuevoCosto: number): Promise<Envio | null> {
        await this.repository.update({ envioId: id }, { costoTotal: nuevoCosto });
        return await this.findById(id);
    }

    async findActivosQueryBuilder(): Promise<Envio[]> {
        return await this.repository
            .createQueryBuilder("envio")
            .leftJoinAndSelect("envio.paquetes", "paquetes")
            .where("envio.estado_global IN (:...estados)", {
                estados: ["REGISTRADO", "EN_TRANSITO"],
            })
            .orderBy("envio.fecha", "DESC")
            .getMany();
    }

    async findByClienteId(clienteId: number): Promise<Envio[]> {
        return await this.repository.find({
            where: [{ remitenteId: clienteId }, { destinatarioId: clienteId }],
            relations: {
                remitente: true,
                destinatario: true,
                direccionOrigen: true,
                direccionDestino: true,
                paquetes: true,
                historialRastreo: true,
                auditorias: true,
            },
            order: { fecha: "DESC" },
        });
    }
}

export const envioRepository = new EnvioRepository();

