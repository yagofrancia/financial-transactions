import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction-controller';
import { AccountService } from '../core/services/account-service';
import { Transaction } from 'src/domain/entities/transaction';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let accountService: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            createTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionController = module.get<TransactionController>(
      TransactionController,
    );
    accountService = module.get<AccountService>(AccountService);
  });

  it('should create a transaction successfully', () => {
    const transactionDto: Omit<Transaction, 'id'> = {
      accountId: 'test-account-id',
      type: 'entrada',
      amount: 100,
    };

    const result = {
      id: 'test-transaction-id',
      ...transactionDto,
    };

    jest
      .spyOn(accountService, 'createTransaction')
      .mockImplementation(() => result);

    expect(transactionController.createTransaction(transactionDto)).toBe(
      result,
    );
    expect(accountService.createTransaction).toHaveBeenCalledWith(
      transactionDto.accountId,
      transactionDto.type,
      transactionDto.amount,
    );
  });
});
