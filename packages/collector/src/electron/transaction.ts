export enum TransactionType {
  DEBIT,
  CREDIT
}

export class Transaction {
  date: Date;
  type: TransactionType;
  amount: number;
  quantity: number;
  item: string;
  tags: string[];

  constructor() {
    this.tags = [];
  }
}
