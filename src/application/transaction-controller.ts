import { Controller, Post, Body } from '@nestjs/common';
import { AccountService } from '../core/services/account-service';

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
