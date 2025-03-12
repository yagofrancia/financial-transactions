import { v4 as uuid } from 'uuid';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Account } from 'src/domain/entities/account';
import { Transaction } from 'src/domain/entities/transaction';

@Injectable()
export class AccountService {
  private accounts: Map<string, Account> = new Map();
  private transactions: Transaction[] = [];

  createAccount = (name: string, initialBalance: number): Account => {
    const account: Account = { id: uuid(), name, balance: initialBalance };
    this.accounts.set(account.id, account);
    return account;
  };

  getBalance = (accountId: string): number => {
    const account = this.accounts.get(accountId);
    if (!account) throw new BadRequestException('Conta não encontrada');
    return account.balance;
  };

  createTransaction = (
    accountId: string,
    type: 'entrada' | 'saída',
    amount: number,
  ): Transaction => {
    // TODO: organize error handling
    const account = this.accounts.get(accountId);
    if (!account) throw new BadRequestException('Conta não encontrada');
    if (type !== 'entrada' && type !== 'saída') {
      throw new BadRequestException('Tipo de transação inválido');
    }

    if (type === 'saída' && account.balance < amount) {
      throw new BadRequestException('Saldo insuficiente');
    }

    const transaction: Transaction = { id: uuid(), accountId, type, amount };
    this.transactions.push(transaction);

    account.balance += type === 'entrada' ? amount : -amount;
    return transaction;
  };
}
