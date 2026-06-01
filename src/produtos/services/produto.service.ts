import { Injectable, HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike, DeleteResult } from "typeorm";
import { Produto } from "../entities/produto.entity";
import { CategoriaService } from "../../categoria/services/categoria.service";

@Injectable()
export class ProdutoService{
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
       private categoriaService: CategoriaService 
    ) {}

    async findAll(): Promise<Produto[]>{
        return await this.produtoRepository.find({
            relations:{
                usuario: true,
                categoria: true,
            } 
        });
    }

    async findById(id: number): Promise<Produto>{
        const produto = await this.produtoRepository.findOne({
            where: {
                id
            },
            relations:{
                usuario: true,
                categoria: true
            } 
        });

        if (!produto){
            throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND)};
            
            return produto;
        }

    async findByNome(nomeProduto: string): Promise<Produto[]>{
        return await this.produtoRepository.find({
            where:{
                nomeProduto: ILike(`%${nomeProduto}%`)
            },
           relations:{
                usuario: true,
                categoria: true
            } 
        })
    }

    
    async atualizarStatus(id: number): Promise<Produto> { 
        const produto = await this.produtoRepository.findOne({ 
            where: {
                id 
            } 
        });

        if (!produto) { 
            throw new NotFoundException('Produto não encontrado'); }
        
        produto.status = true;

        return await this.produtoRepository.save(produto);
    }



    async create (produto: Produto): Promise<Produto>{

        await this.categoriaService.findById(produto.categoria.id) //

        return await this.produtoRepository.save(produto);
     }

    async update (produto: Produto): Promise <Produto>{

        await this.findById(produto.id)
        
      await this.categoriaService.findById(produto.categoria.id) 

        return await this.produtoRepository.save(produto);
    }

    async delete(id: number): Promise <DeleteResult>{
        await this.findById(id)

        return await this.produtoRepository.delete(id)
        
    }

    }