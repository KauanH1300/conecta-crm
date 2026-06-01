import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from '../../produtos/entities/produto.entity';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_categorias' })
export class Categoria {

  @PrimaryGeneratedColumn()
  @ApiProperty() 
  id: number;

  @IsNotEmpty({message: "O nomé é obrigatório"})
  @IsString({message: "O nome deve ser um texto"})
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  @Column({ length: 100, unique: true })
  nome: string;

  @IsNotEmpty({message: "A descrição é obrigatório"})
  @IsString({message: "A descrição deve ser um texto"})
  @MaxLength(200, { message: 'O nome deve ter no máximo 100 caracteres' })
  @ApiProperty() 
  @Column({ length: 255, nullable: false })
  descricao: string;

  @ApiProperty()
  @OneToMany(() => Produto, (produto) => produto.usuario)
  produto: Produto[];

}
