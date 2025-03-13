# Financial Transactions

## Inicialização do Projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/yagofrancia/financial-transactions.git
   cd financial-transactions
   ```

2. Instale as dependências:

   ```bash
   yarn
   ```

3. Inicie o servidor:
   ```bash
   yarn start
   ```

## Exemplos de Requisição

### Criar Conta

```bash
curl -X POST http://localhost:3000/accounts \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Conta Exemplo",
    "balance": 1000
  }'
```

### Consultar Saldo

```bash
curl -X GET http://localhost:3000/accounts/{accountId}/balance
```

### Criar Transação

```bash
curl -X POST http://localhost:3000/transactions \
  -H 'Content-Type: application/json' \
  -d '{
    "accountId": "{accountId}",
    "type": "entrada",
    "amount": 500
  }'
```
