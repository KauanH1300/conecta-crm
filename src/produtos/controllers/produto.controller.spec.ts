import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../entities/produto.entity';
import { DeleteResult } from 'typeorm';

describe('ProdutoController (Teste Unitário)', () => {
  let controller: ProdutoController;
  let service: ProdutoService;

  const mockProdutoService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByNome: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    atualizarStatus: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [
        {
          provide: ProdutoService,
          useValue: mockProdutoService,
        },
      ],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
    service = module.get<ProdutoService>(ProdutoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todos os produtos', async () => {
      const listaFake = [{ id: 1, nomeProduto: 'Bolo no Pote' }] as Produto[];
      mockProdutoService.findAll.mockResolvedValue(listaFake);

      const resultado = await controller.findAll();

      expect(resultado).toEqual(listaFake);
    });
  });

  describe('findByNome', () => {
    it('deve filtrar produtos pelo nome', async () => {
      const listaFake = [{ id: 2, nomeProduto: 'Brownie' }] as Produto[];
      mockProdutoService.findByNome.mockResolvedValue(listaFake);

      const resultado = await controller.findByNome('Brownie');

      expect(resultado).toEqual(listaFake);
    });
  });

  describe('atualizarStatus', () => {
    it('deve chamar o service para ativar o status do produto', async () => {
      const produtoAtualizado = { id: 1, nomeProduto: 'Alfajor', status: true } as Produto;
      mockProdutoService.atualizarStatus.mockResolvedValue(produtoAtualizado);

      // Se no seu controller a rota receber o ID como string/número, ele repassa pro service
      const resultado = await controller.atualizarStatus(1);

      expect(resultado.status).toBe(true);
    });
  });

  describe('delete', () => {
    it('deve deletar um produto com sucesso', async () => {
      const deleteResultFake: DeleteResult = { raw: [], affected: 1 };
      mockProdutoService.delete.mockResolvedValue(deleteResultFake);

      await controller.delete(1);

      expect(mockProdutoService.delete).toHaveBeenCalledWith(1);
    });
  });
});