import { Module } from '@nestjs/common';
import { AccountService } from './core/services/account-service';
import { TransactionController } from './application/transaction-controller';
import { AccountController } from './application/account-controller';

@Module({
  controllers: [AccountController, TransactionController],
  providers: [AccountService],
})
export class AppModule {}
