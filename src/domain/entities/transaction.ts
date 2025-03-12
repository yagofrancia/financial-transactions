export interface Transaction {
  id: string;
  accountId: string;
  type: 'entrada' | 'saída';
  amount: number;
}
