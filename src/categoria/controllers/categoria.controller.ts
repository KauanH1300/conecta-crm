import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { Categoria } from "../entities/categoria.entity";
import { CategoriaService } from "../services/categoria.service";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

  @ApiTags('Categoria')
  @UseGuards(JwtAuthGuard)
  @Controller("/categoria")
  @ApiBearerAuth()
  export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) {}

    @Get()
    @ApiOperation({ summary: 'Buscar todas as Categorias' })
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Categoria[]> {
        return this.categoriaService.findAll();
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Buscar Categoria por ID' })
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<Categoria>{
        return this.categoriaService.findById(id)
    }

    @Get('/descricao/:descricao')
    @ApiOperation({ summary: 'Buscar Categoria por descrição' })
    @HttpCode(HttpStatus.OK)
    findAllBydescricao(@Param('descricao') descricao: string): Promise<Categoria[]>{
        return this.categoriaService.findAllByDescricao(descricao);
    }

    @Post()
    @ApiOperation({ summary: 'Cadastrar Categoria' })
    @HttpCode(HttpStatus.CREATED)
    create(@Body() categoria: Categoria): Promise<Categoria>{
        return this.categoriaService.create(categoria)
    }

    @Put()
    @ApiOperation({ summary: 'Atualizar Categoria' })
    @HttpCode(HttpStatus.OK)
    update(@Body() categoria: Categoria): Promise<Categoria>{
        return this.categoriaService.update(categoria)
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Deletar Categoria' })
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseIntPipe) id: number){
        return this.categoriaService.delete(id)
    }
}