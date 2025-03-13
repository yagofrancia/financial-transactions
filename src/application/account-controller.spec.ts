import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account-controller';
import { AccountService } from '../core/services/account-service';
import { BadRequestException } from '@nestjs/common';

describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            createAccount: jest.fn(),
            getBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    accountController = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
  });

  it('should create an account successfully', () => {
    const accountDto = { name: 'Test Account', balance: 1000 };
    const result = { id: 'test-account-id', ...accountDto };

    jest
      .spyOn(accountService, 'createAccount')
      .mockImplementation(() => result);

    expect(
      accountController.createAccount(accountDto.name, accountDto.balance),
    ).toBe(result);
    expect(accountService.createAccount).toHaveBeenCalledWith(
      accountDto.name,
      accountDto.balance,
    );
  });

  it('should get account balance successfully', () => {
    const accountId = 'test-account-id';
    const balance = 1000;

    jest.spyOn(accountService, 'getBalance').mockImplementation(() => balance);

    expect(accountController.getBalance(accountId)).toEqual({ balance });
    expect(accountService.getBalance).toHaveBeenCalledWith(accountId);
  });

  it('should throw an error if account not found when getting balance', () => {
    const accountId = 'non-existent-account-id';

    jest.spyOn(accountService, 'getBalance').mockImplementation(() => {
      throw new BadRequestException('Conta não encontrada');
    });

    expect(() => accountController.getBalance(accountId)).toThrow(
      BadRequestException,
    );
    expect(accountService.getBalance).toHaveBeenCalledWith(accountId);
  });
});
