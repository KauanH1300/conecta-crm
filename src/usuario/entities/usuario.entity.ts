import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from '../../produtos/entities/produto.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tb_usuarios' })
export class Usuario {

  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @IsNotEmpty({message: "O nome é obrigatório"})
  @IsString({message: "O nome deve ser um texto"})
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  nome: string;

  @IsEmail()
  @IsString({message: "O usúario deve ser um texto"})
  @IsNotEmpty({message: "O usúario é obrigatório"})
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  usuario: string;

  @MinLength(8)
  @IsNotEmpty({message: "A senha não pode ser vazia"})
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  senha: string;

  @Column({ length: 5000 })
  @ApiProperty()
  foto: string;

  @IsNotEmpty({message: "O perfil não pode ser vazia"})
  @ApiProperty()
  @Column({ length: 50, nullable: false })
  perfil: string;

  @ApiProperty()
  @OneToMany(() => Produto, (produto) => produto.usuario)
  produto: Produto[];
}
