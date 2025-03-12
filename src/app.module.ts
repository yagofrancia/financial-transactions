import {
  Module,
  Injectable,
  Controller,
  Post,
  Get,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Account } from './domain/entities/account';
import { Transaction } from './domain/entities/transaction';

@Injectable()
export class AccountService {
  private accounts: Map<string, Account> = new Map();
  private transactions: Transaction[] = [];

  createAccount(name: string, initialBalance: number): Account {
    const account: Account = { id: uuid(), name, balance: initialBalance };
    this.accounts.set(account.id, account);
    return account;
  }

  getBalance(accountId: string): number {
    const account = this.accounts.get(accountId);
    if (!account) throw new BadRequestException('Conta não encontrada');
    return account.balance;
  }

  createTransaction(
    accountId: string,
    type: 'entrada' | 'saída',
    amount: number,
  ): Transaction {
    const account = this.accounts.get(accountId);
    if (!account) throw new BadRequestException('Conta não encontrada');

    if (type === 'saída' && account.balance < amount) {
      throw new BadRequestException('Saldo insuficiente');
    }

    const transaction: Transaction = { id: uuid(), accountId, type, amount };
    this.transactions.push(transaction);

    account.balance += type === 'entrada' ? amount : -amount;
    return transaction;
  }
}

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  createAccount(@Body('name') name: string, @Body('balance') balance: number) {
    return this.accountService.createAccount(name, balance);
  }

  @Get(':id/balance')
  getBalance(@Param('id') id: string) {
    return { balance: this.accountService.getBalance(id) };
  }
}

@Controller('transactions')
export class TransactionController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  createTransaction(
    @Body()
    body: {
      accountId: string;
      type: 'entrada' | 'saída';
      amount: number;
    },
  ) {
    return this.accountService.createTransaction(
      body.accountId,
      body.type,
      body.amount,
    );
  }
}

@Module({
  controllers: [AccountController, TransactionController],
  providers: [AccountService],
})
export class AppModule {}
