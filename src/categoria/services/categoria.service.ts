import { InjectRepository } from "@nestjs/typeorm";
import { Categoria } from "../entities/categoria.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { DeleteResult } from "typeorm/browser";

@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>
    ) { }

    async findAll(): Promise<Categoria[]> {
        return await this.categoriaRepository.find({
         
        });
    }

    async findById(id: number): Promise<Categoria> {
        let categoria = await this.categoriaRepository.findOne({
            where: {
                id
            },
            relations: {
                produto: true
            }
        
        });

        if(!categoria)
            throw new HttpException('Categoria não encontrada!', HttpStatus.NOT_FOUND);

        return categoria;
    }

    async findAllByDescricao(descricao: string): Promise<Categoria[]> {
        return await this.categoriaRepository.find({
            where: {
                descricao: ILike(`%${descricao}`)
            },
            relations: {
                produto: true
            }
           
        });
    }

    //Metodo para criar uma categoria
    async create(categoria: Categoria): Promise<Categoria> {
        return await this.categoriaRepository.save(categoria)
    }

    //Metodo para atualizar uma categoria
    async update(categoria: Categoria): Promise<Categoria> {
        await this.findById(categoria.id);

        return await this.categoriaRepository.save(categoria);
    }

    //Metodo para deletar uma categoria
    async delete(id: number): Promise<DeleteResult>{
        await this.findById(id);

        return await this.categoriaRepository.delete(id);
    }

}