import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../entities/categoria.entity';
import { HttpStatus } from '@nestjs/common';

describe('CategoriaController (Teste Unitário)', () => {
  let controller: CategoriaController;
  let service: CategoriaService;

  // Criamos o Mock (dublê) com todos os métodos que o seu Controller chama
  const mockCategoriaService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findAllByDescricao: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        {
          provide: CategoriaService,
          useValue: mockCategoriaService,
        },
      ],
    }).compile();

    controller = module.get<CategoriaController>(CategoriaController);
    service = module.get<CategoriaService>(CategoriaService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa o histórico de chamadas após cada teste
  });

  describe('findAll', () => {
    it('deve retornar uma lista de categorias com sucesso', async () => {
      const resultadoFake = [{ id: 1, descricao: 'Bicos e Barras' }] as Categoria[];
      mockCategoriaService.findAll.mockResolvedValue(resultadoFake);

      const resultado = await controller.findAll();

      expect(resultado).toEqual(resultadoFake);
      expect(mockCategoriaService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('deve retornar uma categoria buscando por ID', async () => {
      const categoriaFake = { id: 1, descricao: 'Embalagens' } as Categoria;
      mockCategoriaService.findById.mockResolvedValue(categoriaFake);

      const resultado = await controller.findById(1);

      expect(resultado).toEqual(categoriaFake);
      expect(mockCategoriaService.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('findAllBydescricao', () => {
    it('deve retornar categorias filtradas pela descrição', async () => {
      const resultadoFake = [{ id: 2, descricao: 'Formas de Acetato' }] as Categoria[];
      mockCategoriaService.findAllByDescricao.mockResolvedValue(resultadoFake);

      const resultado = await controller.findAllBydescricao('Formas');

      expect(resultado).toEqual(resultadoFake);
      expect(mockCategoriaService.findAllByDescricao).toHaveBeenCalledWith('Formas');
    });
  });

  describe('create', () => {
    it('deve chamar o método de criar categoria e retornar o objeto salvo', async () => {
      const novaCategoria = { descricao: 'Ingredientes' } as Categoria;
      const categoriaSalva = { id: 3, descricao: 'Ingredientes' } as Categoria;
      mockCategoriaService.create.mockResolvedValue(categoriaSalva);

      const resultado = await controller.create(novaCategoria);

      expect(resultado).toEqual(categoriaSalva);
      expect(mockCategoriaService.create).toHaveBeenCalledWith(novaCategoria);
    });
  });

  describe('update', () => {
    it('deve chamar o método de atualizar categoria com sucesso', async () => {
      const categoriaParaAtualizar = { id: 3, descricao: 'Ingredientes Premium' } as Categoria;
      mockCategoriaService.update.mockResolvedValue(categoriaParaAtualizar);

      const resultado = await controller.update(categoriaParaAtualizar);

      expect(resultado).toEqual(categoriaParaAtualizar);
      expect(mockCategoriaService.update).toHaveBeenCalledWith(categoriaParaAtualizar);
    });
  });

  describe('delete', () => {
    it('deve chamar o método de deletar passando o ID correto', async () => {
      // Como o seu método delete no controller não dá "return", simulamos uma resposta vazia (void)
      mockCategoriaService.delete.mockResolvedValue(undefined);

      await controller.delete(5);

      expect(mockCategoriaService.delete).toHaveBeenCalledWith(5);
      expect(mockCategoriaService.delete).toHaveBeenCalledTimes(1);
    });
  });
});