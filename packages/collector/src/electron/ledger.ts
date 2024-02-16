import { Transaction } from "./transaction.js";

export class Ledger {
  public transactions: Transaction[];

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
  }

  add(transaction: Transaction) {
    this.transactions.push(transaction);
  }
}
