import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(transactions: Transaction[]): Promise<Balance> {
    let income = 0;
    let outcome = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'income') income += transaction.value;
      else if (transaction.type === 'outcome') outcome += transaction.value;

      delete transaction.category_id;
    });

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;