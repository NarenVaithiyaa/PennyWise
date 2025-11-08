import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/Auth/AuthForm';
import { SupabaseService } from './services/supabaseService';
import Navigation from './components/Navigation/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import ExpenseTracker from './components/ExpenseTracker/ExpenseTracker';
import IncomeTracker from './components/IncomeTracker/IncomeTracker';
import SavingsView from './components/SavingsView/SavingsView';
import QuoteFooter from './components/common/QuoteFooter';
import InstallPrompt from './components/common/InstallPrompt';
import { Transaction, AccountBalances, ExpenseLimit } from './types';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [income, setIncome] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState<AccountBalances>({ bank: 0, wallet: 0 });
  const [expenseLimits, setExpenseLimits] = useState<ExpenseLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      loadDataFromSupabase();
    }
  }, [user]);

  const loadDataFromSupabase = async () => {
    try {
      setLoading(true);
      const [transactionsData, balancesData, limitsData] = await Promise.all([
        SupabaseService.getTransactions(),
        SupabaseService.getAccountBalances(),
        SupabaseService.getExpenseLimits(),
      ]);

      // Separate transactions by type
      const expenseTransactions = transactionsData.filter(t => t.type === 'expense');
      const incomeTransactions = transactionsData.filter(t => t.type === 'income');

      setExpenses(expenseTransactions);
      setIncome(incomeTransactions);
      setBalances(balancesData);
      setExpenseLimits(limitsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data from server');
    } finally {
      setLoading(false);
    }
  };

  const updateBalances = (transaction: Transaction, isAdding: boolean) => {
    const multiplier = isAdding ? 1 : -1;
    const account = transaction.source || transaction.destination;
    
    if (!account) return;

    setBalances(prev => ({
      ...prev,
      [account]: prev[account] + (transaction.type === 'income' ? 
        transaction.amount * multiplier : 
        -transaction.amount * multiplier)
    }));
  };

  const addExpense = async (expense: Transaction) => {
    try {
      const newExpense = await SupabaseService.addTransaction(expense);
      setExpenses(prev => [...prev, newExpense]);
      updateBalances(newExpense, true);
      
      // Update balances in database
      const newBalances = { ...balances };
      const account = newExpense.source;
      if (account) {
        newBalances[account] -= newExpense.amount;
        await SupabaseService.updateAccountBalances(newBalances);
        setBalances(newBalances);
      }
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense');
    }
  };

  const addIncome = async (incomeItem: Transaction) => {
    try {
      const newIncome = await SupabaseService.addTransaction(incomeItem);
      setIncome(prev => [...prev, newIncome]);
      updateBalances(newIncome, true);
      
      // Update balances in database
      const newBalances = { ...balances };
      const account = newIncome.destination;
      if (account) {
        newBalances[account] += newIncome.amount;
        await SupabaseService.updateAccountBalances(newBalances);
        setBalances(newBalances);
      }
    } catch (err) {
      console.error('Error adding income:', err);
      setError('Failed to add income');
    }
  };

  const updateExpense = async (id: string, updatedExpense: Transaction) => {
    try {
      const oldExpense = expenses.find(e => e.id === id);
      const updated = await SupabaseService.updateTransaction(id, updatedExpense);
      
      setExpenses(prev => prev.map(expense => 
        expense.id === id ? updated : expense
      ));
      
      // Update balances if account changed
      if (oldExpense) {
        const newBalances = { ...balances };
        
        // Reverse old transaction
        if (oldExpense.source) {
          newBalances[oldExpense.source] += oldExpense.amount;
        }
        
        // Apply new transaction
        if (updated.source) {
          newBalances[updated.source] -= updated.amount;
        }
        
        await SupabaseService.updateAccountBalances(newBalances);
        setBalances(newBalances);
      }
    } catch (err) {
      console.error('Error updating expense:', err);
      setError('Failed to update expense');
    }
  };

  const updateIncome = async (id: string, updatedIncome: Transaction) => {
    try {
      const oldIncome = income.find(i => i.id === id);
      const updated = await SupabaseService.updateTransaction(id, updatedIncome);
      
      setIncome(prev => prev.map(incomeItem => 
        incomeItem.id === id ? updated : incomeItem
      ));
      
      // Update balances if account changed
      if (oldIncome) {
        const newBalances = { ...balances };
        
        // Reverse old transaction
        if (oldIncome.destination) {
          newBalances[oldIncome.destination] -= oldIncome.amount;
        }
        
        // Apply new transaction
        if (updated.destination) {
          newBalances[updated.destination] += updated.amount;
        }
        
        await SupabaseService.updateAccountBalances(newBalances);
        setBalances(newBalances);
      }
    } catch (err) {
      console.error('Error updating income:', err);
      setError('Failed to update income');
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const expense = expenses.find(e => e.id === id);
      await SupabaseService.deleteTransaction(id);
      
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      
      // Update balances
      if (expense && expense.source) {
        const newBalances = { ...balances };
        newBalances[expense.source] += expense.amount;
        await SupabaseService.updateAccountBalances(newBalances);
        setBalances(newBalances);
      }
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense');
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      const incomeItem = income.find(i => i.id === id);
      await SupabaseService.deleteTransaction(id);
      
      setIncome(prev => prev.filter(incomeItem => incomeItem.id !== id));
      
      // Update balances
      if (incomeItem && incomeItem.destination) {
        const newBalances = { ...balances };
        newBalances[incomeItem.destination] -= incomeItem.amount;
        await SupabaseService.updateAccountBalances(newBalances);
        setBalances(newBalances);
      }
    } catch (err) {
      console.error('Error deleting income:', err);
      setError('Failed to delete income');
    }
  };

  const updateAccountBalances = async (newBalances: AccountBalances) => {
    try {
      await SupabaseService.updateAccountBalances(newBalances);
      setBalances(newBalances);
    } catch (err) {
      console.error('Error updating balances:', err);
      setError('Failed to update account balances');
    }
  };

  const updateExpenseLimits = async (newLimits: ExpenseLimit[]) => {
    try {
      await SupabaseService.updateExpenseLimits(newLimits);
      setExpenseLimits(newLimits);
    } catch (err) {
      console.error('Error updating expense limits:', err);
      setError('Failed to update expense limits');
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if user is not authenticated
  if (!user) {
    return <AuthForm />;
  }

  // Show loading screen while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            expenses={expenses} 
            income={income} 
            balances={balances}
            expenseLimits={expenseLimits}
            onUpdateBalances={updateAccountBalances}
          />
        );
      case 'expenses':
        return (
          <ExpenseTracker
            expenses={expenses}
            expenseLimits={expenseLimits}
            onAddExpense={addExpense}
            onUpdateExpense={updateExpense}
            onDeleteExpense={deleteExpense}
            onUpdateExpenseLimits={updateExpenseLimits}
          />
        );
      case 'income':
        return (
          <IncomeTracker
            income={income}
            onAddIncome={addIncome}
            onUpdateIncome={updateIncome}
            onDeleteIncome={deleteIncome}
          />
        );
      case 'savings':
        return <SavingsView expenses={expenses} income={income} />;
      default:
        return (
          <Dashboard 
            expenses={expenses} 
            income={income} 
            balances={balances}
            expenseLimits={expenseLimits}
            onUpdateBalances={updateAccountBalances}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-inter flex flex-col transition-colors duration-300">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-700 p-4">
          <div className="container mx-auto max-w-7xl">
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 underline hover:no-underline"
              >
                Dismiss
              </button>
            </p>
          </div>
        </div>
      )}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {user?.email && (
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-3 max-w-7xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">Welcome, {user.email}</p>
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 py-8 max-w-7xl flex-1">
        {renderActiveTab()}
      </main>
      <InstallPrompt />
      <QuoteFooter />
    </div>
  );
}

export default App;