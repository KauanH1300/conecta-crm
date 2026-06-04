import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuarioService } from '../../usuario/services/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { Bcrypt } from '../bcrypt/bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsuarioLogin } from '../entities/usuariologin.entity';

describe('AuthService (Teste Unitário)', () => {
  let service: AuthService;

  // Criamos os Mocks das três dependências que o construtor pede
  const mockUsuarioService = {
    findByUsuario: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockBcrypt = {
    compararSenhas: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        // Injetamos as simulações no lugar das classes reais
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: Bcrypt, useValue: mockBcrypt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

//   Limpa as simulações depois de cada teste para um não atrapalhar o outro
   afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('deve retornar os dados do usuário (sem a senha) quando as credenciais forem válidas', async () => {
      const usuarioFake = { id: 1, nome: 'Kauan', usuario: 'kauan@email.com', senha: 'hashed_password' };
      
      mockUsuarioService.findByUsuario.mockResolvedValue(usuarioFake);
      mockBcrypt.compararSenhas.mockResolvedValue(true); // Finge que a senha bateu

      const resultado = await service.validateUser('kauan@email.com', 'senha123');

      expect(resultado).toEqual({ id: 1, nome: 'Kauan', usuario: 'kauan@email.com' });
    });

    it('deve lançar HttpException (404) se o usuário não for encontrado', async () => {
      mockUsuarioService.findByUsuario.mockResolvedValue(null); // Banco não acha ninguém

      await expect(service.validateUser('invalido@email.com', 'senha')).rejects.toThrow(
        new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('login', () => {
    it('deve retornar o objeto de login com o token JWT gerado', async () => {
      const usuarioLoginFake: UsuarioLogin = { usuario: 'kauan@email.com', senha: 'senha123', id: 0, nome: '', foto: '', token: '' };
      const usuarioDbFake = { id: 1, nome: 'Kauan', usuario: 'kauan@email.com', foto: 'foto.png' };

      mockUsuarioService.findByUsuario.mockResolvedValue(usuarioDbFake);
      mockJwtService.sign.mockReturnValue('token_jwt_de_teste');

      const resultado = await service.login(usuarioLoginFake);

      expect(resultado).toEqual({
        id: 1,
        nome: 'Kauan',
        usuario: 'kauan@email.com',
        senha: '',
        foto: 'foto.png',
        token: 'Bearer token_jwt_de_teste',
      });
    });
  });
});