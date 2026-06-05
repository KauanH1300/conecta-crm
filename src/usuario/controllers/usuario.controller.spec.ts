import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../entities/usuario.entity';

describe('UsuarioController (Teste Unitário)', () => {
  let controller: UsuarioController;
  let service: UsuarioService;

  const mockUsuarioService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get<UsuarioService>(UsuarioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de usuários', async () => {
      const resultadoFake = [{ id: 1, nome: 'Kauan', usuario: 'kauan@email.com' }] as Usuario[];
      mockUsuarioService.findAll.mockResolvedValue(resultadoFake);

      const resultado = await controller.findAll();

      expect(resultado).toEqual(resultadoFake);
    });
  });

  describe('findById', () => {
    it('deve retornar um usuário por ID', async () => {
      const usuarioFake = { id: 1, nome: 'Kauan' } as Usuario;
      mockUsuarioService.findById.mockResolvedValue(usuarioFake);

      const resultado = await controller.findById(1);

      expect(resultado).toEqual(usuarioFake);
    });
  });

  describe('create', () => {
    it('deve cadastrar um novo usuário com sucesso', async () => {
      const novoUsuario = { nome: 'Andresa', usuario: 'andresa@email.com', senha: '123' } as Usuario;
      mockUsuarioService.create.mockResolvedValue({ id: 2, ...novoUsuario });

      const resultado = await controller.create(novoUsuario);

      expect(resultado.id).toBeDefined();
    });
  });
});