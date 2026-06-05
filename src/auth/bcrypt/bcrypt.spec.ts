import { Test, TestingModule } from '@nestjs/testing';
import { Bcrypt } from './bcrypt';

describe('Bcrypt (Teste Unitário de Segurança)', () => {
  let bcryptService: Bcrypt;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Bcrypt], // Injeta a sua classe real que usa o package 'bcrypt'
    }).compile();

    bcryptService = module.get<Bcrypt>(Bcrypt);
  });

  describe('criptografarSenha', () => {
    it('deve transformar uma senha limpa em um hash embaralhado', async () => {
      const senhaLimpa = 'SenhaSecreta123';
      
      // Executa o seu método de criptografia
      const hash = await bcryptService.criptografarSenha(senhaLimpa);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(senhaLimpa); // Garante que a senha NÃO ficou em texto limpo
      expect(hash.length).toBeGreaterThan(10); // Garante que gerou um hash válido e longo
    });
  });

  describe('compararSenhas', () => {
    it('deve retornar TRUE quando a senha digitada for a correta', async () => {
      const senhaLimpa = 'MinhaSenhaCria';
      const hash = await bcryptService.criptografarSenha(senhaLimpa);

      // Compara a senha digitada com o hash usando o seu método 'compararSenhas'
      const resultado = await bcryptService.compararSenhas(senhaLimpa, hash);

      expect(resultado).toBe(true); // Tem que dar match!
    });

    it('deve retornar FALSE quando a senha digitada estiver errada', async () => {
      const senhaLimpa = 'SenhaCerta';
      const senhaErrada = 'SenhaErrada';
      const hash = await bcryptService.criptografarSenha(senhaLimpa);

      // Tenta comparar a senha errada com o hash da certa
      const resultado = await bcryptService.compararSenhas(senhaErrada, hash);

      expect(resultado).toBe(false); // Não pode dar match!
    });
  });
});