import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Account } from 'src/domain/entities/account';
import { Transaction } from 'src/domain/entities/transaction';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/accounts (POST) - criar conta', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send({ name: 'Conta Teste', balance: 1000 })
      .expect(201);
    const accountResponseBody = response.body as Account;

    expect(accountResponseBody).toHaveProperty('id');
    expect(accountResponseBody.name).toBe('Conta Teste');
    expect(accountResponseBody.balance).toBe(1000);
  });

  it('/accounts/:id/balance (GET) - verificar saldo', async () => {
    const accountResponse = await request(app.getHttpServer())
      .post('/accounts')
      .send({ name: 'Conta Teste', balance: 1000 })
      .expect(201);
    const accountResponseBody = accountResponse.body as Account;
    const accountId = accountResponseBody.id;

    const balanceResponse = await request(app.getHttpServer())
      .get(`/accounts/${accountId}/balance`)
      .expect(200);

    expect((balanceResponse.body as Account).balance).toBe(1000);
  });

  it('/transactions (POST) - criar transação de entrada', async () => {
    const accountResponse = await request(app.getHttpServer())
      .post('/accounts')
      .send({ name: 'Conta Teste', balance: 1000 })
      .expect(201);

    const accountResponseBody = accountResponse.body as Account;
    const accountId = accountResponseBody.id;

    const transactionResponse = await request(app.getHttpServer())
      .post('/transactions')
      .send({ accountId, type: 'entrada', amount: 500 })
      .expect(201);

    const transactionResponseBody = transactionResponse.body as Transaction;

    expect(transactionResponseBody).toHaveProperty('id');
    expect(transactionResponseBody.accountId).toBe(accountId);
    expect(transactionResponseBody.type).toBe('entrada');
    expect(transactionResponseBody.amount).toBe(500);

    const balanceResponse = await request(app.getHttpServer())
      .get(`/accounts/${accountId}/balance`)
      .expect(200);

    const balanceResponseBody = balanceResponse.body as Account;

    expect(balanceResponseBody.balance).toBe(1500);
  });

  it('/transactions (POST) - criar transação de saída', async () => {
    const accountResponse = await request(app.getHttpServer())
      .post('/accounts')
      .send({ name: 'Conta Teste', balance: 1000 })
      .expect(201);

    const accountResponseBody = accountResponse.body as Account;
    const accountId = accountResponseBody.id;

    const transactionResponse = await request(app.getHttpServer())
      .post('/transactions')
      .send({ accountId, type: 'saída', amount: 300 })
      .expect(201);

    const transactionResponseBody = transactionResponse.body as Transaction;

    expect(transactionResponseBody).toHaveProperty('id');
    expect(transactionResponseBody.accountId).toBe(accountId);
    expect(transactionResponseBody.type).toBe('saída');
    expect(transactionResponseBody.amount).toBe(300);

    const balanceResponse = await request(app.getHttpServer())
      .get(`/accounts/${accountId}/balance`)
      .expect(200);

    const balanceResponseBody = balanceResponse.body as Account;
    expect(balanceResponseBody.balance).toBe(700);
  });
});
