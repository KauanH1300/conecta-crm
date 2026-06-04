import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoService } from './produto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Produto } from '../entities/produto.entity';
import { CategoriaService } from '../../categoria/services/categoria.service';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';

describe('ProdutoService (Teste Unitário)', () => {
  let service: ProdutoService;
  let repository: Repository<Produto>;

  // 1. Criamos o Mock do Repositório de Produtos
  const mockProdutoRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  // 2. Criamos o Mock do CategoriaService (que é injetado no construtor)
  const mockCategoriaService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: getRepositoryToken(Produto),
          useValue: mockProdutoRepository,
        },
        {
          provide: CategoriaService,
          useValue: mockCategoriaService,
        },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
    repository = module.get<Repository<Produto>>(getRepositoryToken(Produto));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa o histórico para isolar os testes
  });

  describe('findById', () => {
    it('deve retornar um produto por ID se ele existir', async () => {
      const produtoFake = { id: 1, nomeProduto: 'Bolo de Pote' } as Produto;
      mockProdutoRepository.findOne.mockResolvedValue(produtoFake);

      const resultado = await service.findById(1);

      expect(resultado).toEqual(produtoFake);
    });

    it('deve lançar HttpException (404) se o produto não for encontrado', async () => {
      mockProdutoRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(
        new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findByNome', () => {
    it('deve retornar uma lista de produtos filtrados pelo nomeProduto', async () => {
      const listaProdutosFake = [{ id: 1, nomeProduto: 'Bolo de Chocolate' }] as Produto[];
      mockProdutoRepository.find.mockResolvedValue(listaProdutosFake);

      const resultado = await service.findByNome('Chocolate');

      expect(resultado).toEqual(listaProdutosFake);
    });
  });

  describe('atualizarStatus', () => {
    it('deve alterar o status do produto para true com sucesso', async () => {
      const produtoAntes = { id: 1, nomeProduto: 'Brownie', status: false } as Produto;
      const produtoDepois = { id: 1, nomeProduto: 'Brownie', status: true } as Produto;

      mockProdutoRepository.findOne.mockResolvedValue(produtoAntes);
      mockProdutoRepository.save.mockResolvedValue(produtoDepois);

      const resultado = await service.atualizarStatus(1);

      expect(resultado.status).toBe(true);
      expect(mockProdutoRepository.save).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se o produto não existir ao atualizar status', async () => {
      mockProdutoRepository.findOne.mockResolvedValue(null);

      await expect(service.atualizarStatus(999)).rejects.toThrow(
        new NotFoundException('Produto não encontrado'),
      );
    });
  });

  describe('create', () => {
    it('deve criar um produto com sucesso se a categoria associada existir', async () => {
      const categoriaFake = { id: 2, descricao: 'Doces' } as Categoria;
      const produtoInput = { nomeProduto: 'Alfajor', categoria: categoriaFake } as Produto;
      const produtoSalvo = { id: 10, nomeProduto: 'Alfajor', categoria: categoriaFake } as Produto;

      // Configuramos os mocks
      mockCategoriaService.findById.mockResolvedValue(categoriaFake); // Categoria existe!
      mockProdutoRepository.save.mockResolvedValue(produtoSalvo);

      const resultado = await service.create(produtoInput);

      expect(resultado).toEqual(produtoSalvo);
      expect(mockCategoriaService.findById).toHaveBeenCalledWith(2);
    });
  });

  describe('delete', () => {
    it('deve deletar um produto com sucesso se o ID for válido', async () => {
      const produtoFake = { id: 5, nomeProduto: 'Esfiha' } as Produto;
      const deleteResultFake: DeleteResult = { raw: [], affected: 1 };

      mockProdutoRepository.findOne.mockResolvedValue(produtoFake); // Acha no findById interno
      mockProdutoRepository.delete.mockResolvedValue(deleteResultFake);

      const resultado = await service.delete(5);

      expect(resultado).toEqual(deleteResultFake);
      expect(mockProdutoRepository.delete).toHaveBeenCalledWith(5);
    });
  });
});