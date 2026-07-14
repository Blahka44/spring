'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [balance, setBalance] = useState('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/balance')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setBalance(data.balance.toFixed(4) + ' ' + data.unit);
      })
      .catch(err => {
        setError(err.message);
        setBalance('Error');
      });
  }, []);

  const balanceClass = error 
    ? 'text-2xl font-bold text-red-400' 
    : 'text-2xl font-bold text-green-400';

  return (
    <main className='min-h-screen bg-gray-900 text-white p-8'>
      <h1 className='text-4xl font-bold mb-8'>Spring — AI Treasury Operator</h1>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-gray-800 rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Agent Wallet</h2>
          <div className='space-y-2'>
            <p className='text-sm text-gray-400'>Address</p>
            <p className='font-mono text-sm break-all'>0x7a0fd23e979dc682d23dc3782cc6d9ae83b913b6</p>
            <p className='text-sm text-gray-400 mt-4'>Network</p>
            <p>Arc Testnet</p>
            <p className='text-sm text-gray-400 mt-4'>Balance</p>
            <p className={balanceClass}>{balance}</p>
            {error && <p className='text-sm text-red-400'>{error}</p>}
          </div>
        </div>

        <div className='bg-gray-800 rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>System Status</h2>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Agent Status</span>
              <span className='text-green-400'>Active</span>
            </div>
            <div className='flex justify-between'>
              <span>Monitoring</span>
              <span className='text-yellow-400'>Paused</span>
            </div>
            <div className='flex justify-between'>
              <span>Auto-Execution</span>
              <span className='text-red-400'>Disabled</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}