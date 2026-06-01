import { Controller, Get, Delete, Post, Put, Param, ParseIntPipe, Body, HttpCode, HttpStatus, Patch, UseGuards } from "@nestjs/common";
import { Produto } from "../entities/produto.entity";
import { ProdutoService } from "../services/produto.service";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Produto')
@UseGuards(JwtAuthGuard)
@Controller("/produtos")
@ApiBearerAuth()
export class ProdutoController{
    constructor(private readonly produtoService: ProdutoService) {} 
    @ApiOperation({ summary: 'Buscar Todos os produtos' })
    @Get()  
    @HttpCode(HttpStatus.OK) 
    findAll(): Promise<Produto[]>{
        return this.produtoService.findAll(); 
    }
    

    @Get('/:id') 
    @ApiOperation({ summary: 'Buscar Produtos por ID' })
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<Produto>{ 
        
        return this.produtoService.findById(id);
    }

    @Get('/nome/:nome')
    @ApiOperation({ summary: 'Buscar Produtos por nome' })
    @HttpCode(HttpStatus.OK)
    findByNome(@Param('nome') nome: string): Promise<Produto[]>{
        return this.produtoService.findByNome(nome);
    }

    @Post() 
    @ApiOperation({ summary: 'Cadastrar Produto' })
    @HttpCode(HttpStatus.CREATED)
    create(@Body() produto: Produto): Promise<Produto>{ 
        return this.produtoService.create(produto);
    }

    @Put()
    @ApiOperation({ summary: 'Atualizar Produtos' })
    @HttpCode(HttpStatus.OK)
    update(@Body() produto: Produto): Promise<Produto>{
        return this.produtoService.update(produto);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Deletar Produto' })
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseIntPipe) id: number){
        return this.produtoService.delete(id);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Atualizar Status do Produto por ID' })
    @HttpCode(HttpStatus.OK)
    atualizarStatus(@Param('id', ParseIntPipe) id: number,): Promise<Produto>{
        return this.produtoService.atualizarStatus(id);
    }
    
}