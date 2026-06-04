import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaService } from './categoria.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Categoria } from '../entities/categoria.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';

describe('CategoriaService (Teste Unitário)', () => {
  let service: CategoriaService;
  let repository: Repository<Categoria>;

  // Criamos o Mock do repositório com os métodos exatos que você usa
  const mockCategoriaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
        {
          provide: getRepositoryToken(Categoria),
          useValue: mockCategoriaRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
    repository = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de categorias', async () => {
      const listaCategoriasFake = [
        { id: 1, descricao: 'Eletrônicos' },
        { id: 2, descricao: 'Roupas' },
      ] as Categoria[];
      
      mockCategoriaRepository.find.mockResolvedValue(listaCategoriasFake);

      const resultado = await service.findAll();

      expect(resultado).toEqual(listaCategoriasFake);
    });
  });

  describe('findById', () => {
    it('deve retornar uma categoria por ID se ela existir', async () => {
      const categoriaFake = { id: 1, descricao: 'Eletrônicos' } as Categoria;
      mockCategoriaRepository.findOne.mockResolvedValue(categoriaFake);

      const resultado = await service.findById(1);

      expect(resultado).toEqual(categoriaFake);
    });

    it('deve lançar HttpException (404) se a categoria não for encontrada', async () => {
      mockCategoriaRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(
        new HttpException('Categoria não encontrada!', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findAllByDescricao', () => {
    it('deve retornar categorias que correspondam à descrição informada', async () => {
      const resultadoFake = [{ id: 1, descricao: 'Doces Tradicionais' }] as Categoria[];
      mockCategoriaRepository.find.mockResolvedValue(resultadoFake);

      const resultado = await service.findAllByDescricao('Doces');

      expect(resultado).toEqual(resultadoFake);
      expect(mockCategoriaRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('deve criar e retornar uma nova categoria com sucesso', async () => {
      const novaCategoria = { descricao: 'Nova Categoria' } as Categoria;
      const categoriaSalva = { id: 1, descricao: 'Nova Categoria' } as Categoria;
      
      mockCategoriaRepository.save.mockResolvedValue(categoriaSalva);

      const resultado = await service.create(novaCategoria);

      expect(resultado).toEqual(categoriaSalva);
    });
  });

  describe('delete', () => {
    it('deve deletar uma categoria com sucesso se ela existir no banco', async () => {
      const categoriaFake = { id: 1, descricao: 'Eletrônicos' } as Categoria;
      const deleteResultFake: DeleteResult = { raw: [], affected: 1 };

      // 1. O delete chama o findById interno, então simulamos que ele encontra a categoria
      mockCategoriaRepository.findOne.mockResolvedValue(categoriaFake);
      // 2. Simulamos o retorno de sucesso do comando delete do TypeORM
      mockCategoriaRepository.delete.mockResolvedValue(deleteResultFake);

      const resultado = await service.delete(1);

      expect(resultado).toEqual(deleteResultFake);
      expect(mockCategoriaRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});