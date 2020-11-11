import {
  getCustomRepository,
  getRepository,
  TransactionRepository,
} from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const transactions = await transactionsRepository.find();
      const balance = await transactionsRepository.getBalance(transactions);

      if (balance.total < value) throw new AppError('Insufficient balance');
    }

    const categoriesRepository = getRepository(Category);

    const isThereCategoryWithThisName = await categoriesRepository.findOne({
      where: { title: category },
    });

    let selectedCategory;

    if (isThereCategoryWithThisName) {
      selectedCategory = isThereCategoryWithThisName;
    } else {
      selectedCategory = categoriesRepository.create({ title: category });
      await categoriesRepository.save(selectedCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: selectedCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
