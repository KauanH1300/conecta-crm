import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ProdutoModule } from './produtos/produto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ProdService } from './data/prod.service';
import { ConfigModule } from '@nestjs/config';
import { DevService } from './data/dev.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      // Alterna de forma inteligente: se tiver DATABASE_URL, usa produção, se não, usa dev local
      useClass: process.env.DATABASE_URL ? ProdService : DevService,
      imports: [ConfigModule],
    }),
    AuthModule,
    UsuarioModule,
    ProdutoModule,
    CategoriaModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}