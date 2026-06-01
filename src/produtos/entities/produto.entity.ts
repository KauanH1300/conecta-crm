import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator"
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Usuario } from "../../usuario/entities/usuario.entity";
import { Categoria } from "../../categoria/entities/categoria.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: "tb_produtos"})
export class Produto{
    
    @PrimaryGeneratedColumn()
    @ApiProperty() 
    id: number

    @IsNotEmpty({message: "O nomé é obrigatório"})
    @IsString({message: "O nome deve ser um texto"})
    @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
    @ApiProperty()
    @Column({length: 255, nullable: false})
    nomeProduto: string

    @IsNotEmpty({message: "A descrição é obrigatório"})
    @MaxLength(200, { message: 'O nome deve ter no máximo 100 caracteres' })
    @IsString({message: "A descrição deve ser um texto"})
    @Column('text')
    descricao: string;

    @IsNotEmpty({ message: 'O preço é obrigatório' })
    @IsNumber({}, { message: 'O preço deve ser um número' })
    @IsPositive({ message: 'O preço deve ser maior que zero' })
    @Column({type: 'decimal', precision: 10, scale: 2})
    @ApiProperty() 
    preco: number;

    @IsNotEmpty()
    @Column({type: 'boolean', nullable: false})
    @ApiProperty()
    status: boolean;

    @ApiProperty()
    @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
        onDelete: "CASCADE"
    })
    usuario: Usuario;

    @ApiProperty()
    @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
        onDelete: "CASCADE"
    })
    categoria: Categoria;

}