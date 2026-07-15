'use client';

import { useState } from 'react';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp: string;
}

export default function TransactionSimulator() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      from: '0x7a0f...913b6',
      to: '0x1234...5678',
      amount: '5 USDC',
      status: 'pending',
      timestamp: '2026-07-15 14:45:00'
    }
  ]);

  const executeTransaction = (id: string) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === id ? { ...tx, status: 'executing' } : tx
      )
    );

    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === id ? { ...tx, status: 'completed', timestamp: new Date().toISOString() } : tx
        )
      );
    }, 2000);
  };

  return (
    <div className='bg-gray-800 rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4'>Transaction Simulator</h2>
      <div className='space-y-3'>
        {transactions.map((tx) => (
          <div key={tx.id} className='border border-gray-600 rounded-lg p-4'>
            <div className='flex justify-between items-start mb-2'>
              <div>
                <p className='text-sm text-gray-400'>{tx.timestamp}</p>
                <p className='font-medium'>Send {tx.amount}</p>
                <p className='text-xs text-gray-500'>From: {tx.from}</p>
                <p className='text-xs text-gray-500'>To: {tx.to}</p>
              </div>
              <span className='text-xs px-2 py-1 rounded bg-yellow-900 text-yellow-400'>
                {tx.status}
              </span>
            </div>
            
            {tx.status === 'pending' && (
              <button 
                onClick={() => executeTransaction(tx.id)}
                className='w-full bg-green-600 hover:bg-green-500 py-2 rounded text-sm font-medium'
              >
                Execute Transaction
              </button>
            )}
            
            {tx.status === 'executing' && (
              <div className='w-full bg-blue-900 py-2 rounded text-sm text-center text-blue-400 animate-pulse'>
                Processing on Arc Testnet...
              </div>
            )}
            
            {tx.status === 'completed' && (
              <div className='w-full bg-green-900 py-2 rounded text-sm text-center text-green-400'>
                Confirmed on-chain
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
