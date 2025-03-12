import { Module, Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AccountService } from './core/services/account-service';
import { TransactionController } from './application/transaction-controller';

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

@Module({
  controllers: [AccountController, TransactionController],
  providers: [AccountService],
})
export class AppModule {}
