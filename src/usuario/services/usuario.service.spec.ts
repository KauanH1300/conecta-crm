import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('UsuarioService (Teste Unitário)', () => {
  let service: UsuarioService;
  let repository: Repository<Usuario>;

  // 1. Criamos os Mocks das dependências
  const mockUsuarioRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockBcrypt = {
    criptografarSenha: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        // Como o seu service usa o @InjectRepository(Usuario), usamos essa função do NestJS para mockar
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
        { provide: Bcrypt, useValue: mockBcrypt },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa o histórico de chamadas após cada teste
  });

  describe('findById', () => {
    it('deve retornar um usuário se ele existir no banco', async () => {
      const usuarioFake = { id: 1, nome: 'Kauan', usuario: 'kauan@email.com' } as Usuario;
      mockUsuarioRepository.findOne.mockResolvedValue(usuarioFake);

      const resultado = await service.findById(1);

      expect(resultado).toEqual(usuarioFake);
    });

    it('deve lançar HttpException (404) se o usuário não for encontrado', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null); // Banco não acha o ID

      await expect(service.findById(999)).rejects.toThrow(
        new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('create', () => {
    it('deve cadastrar um usuário com sucesso e criptografar a senha', async () => {
      const usuarioInput = { nome: 'Kauan', usuario: 'kauan@email.com', senha: '123' } as Usuario;
      const usuarioSalvo = { id: 1, nome: 'Kauan', usuario: 'kauan@email.com', senha: 'senha_criptografada' } as Usuario;

      // Configuramos os dublês (Mocks)
      mockUsuarioRepository.findOne.mockResolvedValue(null); // Prova que o e-mail está livre
      mockBcrypt.criptografarSenha.mockResolvedValue('senha_criptografada');
      mockUsuarioRepository.save.mockResolvedValue(usuarioSalvo);

      const resultado = await service.create(usuarioInput);

      expect(resultado).toEqual(usuarioSalvo);
      expect(mockBcrypt.criptografarSenha).toHaveBeenCalledWith('123'); // Garante que a senha passou pela criptografia
    });

    it('deve lançar HttpException (400) se o usuário já existir', async () => {
      const usuarioExistente = { id: 1, usuario: 'kauan@email.com' } as Usuario;
      const usuarioInput = { usuario: 'kauan@email.com', senha: '123' } as Usuario;

      mockUsuarioRepository.findOne.mockResolvedValue(usuarioExistente); // O e-mail já está em uso!

      await expect(service.create(usuarioInput)).rejects.toThrow(
        new HttpException('O Usuario já existe!', HttpStatus.BAD_REQUEST),
      );
    });
  });
});