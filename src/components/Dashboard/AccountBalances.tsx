import React, { useState } from 'react';
import { CreditCard, Wallet, Edit2, Check, X } from 'lucide-react';
import { AccountBalances } from '../../types';

interface AccountBalancesProps {
  balances: AccountBalances;
  onUpdateBalances: (balances: AccountBalances) => void;
}

const AccountBalancesComponent: React.FC<AccountBalancesProps> = ({
  balances,
  onUpdateBalances
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editBalances, setEditBalances] = useState(balances);

  const handleEdit = () => {
    setEditBalances(balances);
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateBalances(editBalances);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditBalances(balances);
    setIsEditing(false);
  };

  const totalBalance = balances.bank + balances.wallet;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Balances</h3>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="inline-flex items-center justify-center space-x-2 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Check className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Bank Account */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Bank Account</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Primary banking balance</p>
            </div>
          </div>
          <div className="w-full sm:w-auto text-left sm:text-right">
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={editBalances.bank}
                onChange={(e) => setEditBalances(prev => ({ 
                  ...prev, 
                  bank: parseFloat(e.target.value) || 0 
                }))}
                className="w-full sm:w-32 px-3 py-1 text-right border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                ₹{balances.bank.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Wallet */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Wallet Cash</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Physical cash on hand</p>
            </div>
          </div>
          <div className="w-full sm:w-auto text-left sm:text-right">
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={editBalances.wallet}
                onChange={(e) => setEditBalances(prev => ({ 
                  ...prev, 
                  wallet: parseFloat(e.target.value) || 0 
                }))}
                className="w-full sm:w-32 px-3 py-1 text-right border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ) : (
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                ₹{balances.wallet.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Total Balance */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Total Balance</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Combined account balance</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{totalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {!isEditing && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>• Bank and wallet balances are automatically updated with each transaction</p>
          <p>• Use the edit button to set initial balances or make manual adjustments</p>
        </div>
      )}
    </div>
  );
};

export default AccountBalancesComponent;