import { supabase } from '../lib/supabase';
import { Transaction, AccountBalances, ExpenseLimit } from '../types';
import { Database } from '../lib/database.types';

type DbTransactionRow = Database['public']['Tables']['transactions']['Row'];
type DbTransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type DbTransactionUpdate = Database['public']['Tables']['transactions']['Update'];
type DbAccountBalanceRow = Database['public']['Tables']['account_balances']['Row'];
type DbAccountBalanceInsert = Database['public']['Tables']['account_balances']['Insert'];
type DbAccountBalanceUpdate = Database['public']['Tables']['account_balances']['Update'];
type DbExpenseLimitRow = Database['public']['Tables']['expense_limits']['Row'];
type DbExpenseLimitInsert = Database['public']['Tables']['expense_limits']['Insert'];
type DbExpenseLimitUpdate = Database['public']['Tables']['expense_limits']['Update'];

// Helper function to convert database transaction to app transaction
const dbToAppTransaction = (dbTransaction: DbTransactionRow): Transaction => ({
  id: dbTransaction.id,
  amount: dbTransaction.amount,
  category: dbTransaction.category,
  description: dbTransaction.description,
  date: dbTransaction.date,
  type: dbTransaction.type,
  source: dbTransaction.source ?? undefined,
  destination: dbTransaction.destination ?? undefined,
});

// Helper function to convert app transaction to database transaction
const appToDbTransactionInsert = (transaction: Transaction, userId: string): DbTransactionInsert => ({
  user_id: userId,
  amount: transaction.amount,
  category: transaction.category,
  description: transaction.description ?? '',
  date: transaction.date,
  type: transaction.type,
  source: transaction.source ?? null,
  destination: transaction.destination ?? null,
});

const appToDbTransactionUpdate = (transaction: Transaction, userId: string): DbTransactionUpdate => ({
  user_id: userId,
  amount: transaction.amount,
  category: transaction.category,
  description: transaction.description ?? '',
  date: transaction.date,
  type: transaction.type,
  source: transaction.source ?? null,
  destination: transaction.destination ?? null,
});

const dbToAppBalances = (row: DbAccountBalanceRow): AccountBalances => ({
  bank: row.bank ?? 0,
  wallet: row.wallet ?? 0,
});

const appToDbBalancesInsert = (balances: AccountBalances, userId: string): DbAccountBalanceInsert => ({
  user_id: userId,
  bank: balances.bank,
  wallet: balances.wallet,
});

const appToDbBalancesUpdate = (balances: AccountBalances, userId: string): DbAccountBalanceUpdate => ({
  user_id: userId,
  bank: balances.bank,
  wallet: balances.wallet,
});

const dbToAppExpenseLimit = (row: DbExpenseLimitRow): ExpenseLimit => ({
  category: row.category,
  limit: row.limit_amount,
  month: row.month,
});

const appToDbExpenseLimitInsert = (limit: ExpenseLimit, userId: string): DbExpenseLimitInsert => ({
  user_id: userId,
  category: limit.category,
  limit_amount: limit.limit,
  month: limit.month,
});

const appToDbExpenseLimitUpdate = (limit: ExpenseLimit, userId: string): DbExpenseLimitUpdate => ({
  user_id: userId,
  category: limit.category,
  limit_amount: limit.limit,
  month: limit.month,
});

export class SupabaseService {
  // Transactions
  static async getTransactions(): Promise<Transaction[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    const rows = (data ?? []) as DbTransactionRow[];
    return rows.map(dbToAppTransaction);
  }

  static async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const payload = appToDbTransactionInsert(transaction as Transaction, user.id);

    const { data, error } = await supabase
      .from('transactions')
      .insert(payload as DbTransactionInsert)
      .select()
      .single();

    if (error) throw error;
    return dbToAppTransaction(data as DbTransactionRow);
  }

  static async updateTransaction(id: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const payload = appToDbTransactionUpdate(transaction as Transaction, user.id);

    const { data, error } = await supabase
      .from('transactions')
      .update(payload as DbTransactionUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return dbToAppTransaction(data as DbTransactionRow);
  }

  static async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Account Balances
  static async getAccountBalances(): Promise<AccountBalances> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('account_balances')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return await this.createAccountBalances({ bank: 0, wallet: 0 });
    }

  return dbToAppBalances(data as DbAccountBalanceRow);
  }

  static async createAccountBalances(balances: AccountBalances): Promise<AccountBalances> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const payload = appToDbBalancesInsert(balances, user.id);

    const { data, error } = await supabase
      .from('account_balances')
      .insert(payload as DbAccountBalanceInsert)
      .select()
      .single();

    if (error) throw error;
    return dbToAppBalances(data as DbAccountBalanceRow);
  }

  static async updateAccountBalances(balances: AccountBalances): Promise<AccountBalances> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const payload = appToDbBalancesUpdate(balances, user.id);

    const { data, error } = await supabase
      .from('account_balances')
      .upsert(payload as DbAccountBalanceInsert, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return dbToAppBalances(data as DbAccountBalanceRow);
  }

  // Expense Limits
  static async getExpenseLimits(): Promise<ExpenseLimit[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('expense_limits')
      .select('*')
      .eq('user_id', user.id)
      .order('month', { ascending: false });

    if (error) throw error;
    const rows = (data ?? []) as DbExpenseLimitRow[];
    return rows.map(dbToAppExpenseLimit);
  }

  static async addExpenseLimit(limit: ExpenseLimit): Promise<ExpenseLimit> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const payload = appToDbExpenseLimitInsert(limit, user.id);

    const { data, error } = await supabase
      .from('expense_limits')
      .insert(payload as DbExpenseLimitInsert)
      .select()
      .single();

    if (error) throw error;
    return dbToAppExpenseLimit(data as DbExpenseLimitRow);
  }

  static async updateExpenseLimit(limit: ExpenseLimit): Promise<ExpenseLimit> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const payload = appToDbExpenseLimitUpdate(limit, user.id);

    const { data, error } = await supabase
      .from('expense_limits')
      .upsert(payload as DbExpenseLimitInsert, { onConflict: 'user_id,category,month' })
      .select()
      .single();

    if (error) throw error;
    return dbToAppExpenseLimit(data as DbExpenseLimitRow);
  }

  static async deleteExpenseLimit(category: string, month: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('expense_limits')
      .delete()
      .eq('user_id', user.id)
      .eq('category', category)
      .eq('month', month);

    if (error) throw error;
  }

  static async updateExpenseLimits(limits: ExpenseLimit[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Delete existing limits for the user
    await supabase
      .from('expense_limits')
      .delete()
      .eq('user_id', user.id);

    // Insert new limits
    if (limits.length > 0) {
      const payload = limits.map(limit => appToDbExpenseLimitInsert(limit, user.id));
      const { error } = await supabase
        .from('expense_limits')
        .insert(payload as DbExpenseLimitInsert[]);

      if (error) throw error;
    }
  }
}