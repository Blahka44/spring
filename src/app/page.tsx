'use client';

import { useEffect, useState } from 'react';

interface BalanceData {
  address: string;
  native: { balance: number; unit: string };
  usdc: { balance: number; unit: string };
  network: string;
}

export default function Home() {
  const [data, setData] = useState<BalanceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/balance')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setData(data);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  const balanceClass = error ? 'text-red-400' : 'text-green-400';

  return (
    <main className='min-h-screen bg-gray-900 text-white p-8'>
      <h1 className='text-4xl font-bold mb-8'>Spring — AI Treasury Operator</h1>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-gray-800 rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Agent Wallet</h2>
          <div className='space-y-2'>
            <p className='text-sm text-gray-400'>Address</p>
            <p className='font-mono text-sm break-all'>
              {data?.address || '0x7a0fd23e979dc682d23dc3782cc6d9ae83b913b6'}
            </p>
            <p className='text-sm text-gray-400 mt-4'>Network</p>
            <p>{data?.network || 'Arc Testnet'}</p>
            
            <p className='text-sm text-gray-400 mt-4'>Native Balance</p>
            <p className='text-2xl font-bold text-blue-400'>
              {data ? data.native.balance.toFixed(4) + ' ' + data.native.unit : 'Loading...'}
            </p>
            
            <p className='text-sm text-gray-400 mt-4'>USDC Balance</p>
            <p className={'text-2xl font-bold ' + balanceClass}>
              {data ? data.usdc.balance.toFixed(2) + ' ' + data.usdc.unit : 'Loading...'}
            </p>
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

        <div className='bg-gray-800 rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Policy Engine</h2>
          <div className='space-y-4'>
            <div>
              <label className='text-sm text-gray-400'>Spending Limit (USDC)</label>
              <input 
                type='number' 
                defaultValue='5' 
                className='w-full mt-1 bg-gray-700 rounded px-3 py-2 text-white'
              />
            </div>
            <div>
              <label className='text-sm text-gray-400'>Balance Threshold (USDC)</label>
              <input 
                type='number' 
                defaultValue='10' 
                className='w-full mt-1 bg-gray-700 rounded px-3 py-2 text-white'
              />
            </div>
            <div className='flex justify-between items-center'>
              <span>Auto-Execution</span>
              <button className='bg-red-500 px-4 py-1 rounded text-sm'>Disabled</button>
            </div>
          </div>
        </div>

        <div className='bg-gray-800 rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Risk Assessment</h2>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <span>Current Balance</span>
              <span className='text-green-400'>{data ? data.usdc.balance.toFixed(2) + ' USDC' : 'Loading...'}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Threshold</span>
              <span className='text-yellow-400'>10 USDC</span>
            </div>
            <div className='border-t border-gray-700 pt-4'>
              <div className='flex justify-between items-center mb-2'>
                <span>Risk Score</span>
                <span className='text-2xl font-bold text-green-400'>LOW</span>
              </div>
              <div className='w-full bg-gray-700 rounded-full h-2'>
                <div className='bg-green-400 h-2 rounded-full' style={{width: '20%'}}></div>
              </div>
              <p className='text-sm text-gray-400 mt-2'>Balance is 2x above threshold</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}