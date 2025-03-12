import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account-service';
import { BadRequestException } from '@nestjs/common';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should create an account', () => {
    const account = service.createAccount('Test Account', 1000);
    expect(account).toHaveProperty('id');
    expect(account.name).toBe('Test Account');
    expect(account.balance).toBe(1000);
  });

  it('should get the balance of an account', () => {
    const account = service.createAccount('Test Account', 1000);
    const balance = service.getBalance(account.id);
    expect(balance).toBe(1000);
  });

  it('should throw an error when getting the balance of a non-existent account', () => {
    expect(() => service.getBalance('non-existent-id')).toThrow(
      BadRequestException,
    );
  });

  it('should create a transaction of type "entrada"', () => {
    const account = service.createAccount('Test Account', 1000);
    const transaction = service.createTransaction(account.id, 'entrada', 500);
    expect(transaction).toHaveProperty('id');
    expect(transaction.accountId).toBe(account.id);
    expect(transaction.type).toBe('entrada');
    expect(transaction.amount).toBe(500);
    expect(service.getBalance(account.id)).toBe(1500);
  });

  it('should create a transaction of type "saída"', () => {
    const account = service.createAccount('Test Account', 1000);
    const transaction = service.createTransaction(account.id, 'saída', 500);
    expect(transaction).toHaveProperty('id');
    expect(transaction.accountId).toBe(account.id);
    expect(transaction.type).toBe('saída');
    expect(transaction.amount).toBe(500);
    expect(service.getBalance(account.id)).toBe(500);
  });

  it('should throw an error when creating a "saída" transaction with insufficient balance', () => {
    const account = service.createAccount('Test Account', 1000);
    expect(() => service.createTransaction(account.id, 'saída', 1500)).toThrow(
      BadRequestException,
    );
  });
});
