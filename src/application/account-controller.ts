import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountService } from '../core/services/account-service';

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
