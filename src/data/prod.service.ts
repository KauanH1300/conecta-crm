import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class ProdService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',              // O tipo do seu banco na Render
      url: process.env.DATABASE_URL, // <-- Captura a string única da Render diretamente
      logging: false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,             // Sincroniza as tabelas automaticamente
      ssl: {
        rejectUnauthorized: false,   // Exigido pela Render para conexões seguras de banco
      },
    };
  }
}