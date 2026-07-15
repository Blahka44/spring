'use client';

import { useEffect, useState } from 'react';
import AuditLog from './components/AuditLog';
import ApprovalQueue from './components/ApprovalQueue';

interface BalanceData {
  address: string;
  native: { balance: number; unit: string };
  usdc: { balance: number; unit: string };
  network: string;
}

export default function Home() {
  const [data, setData] = useState<BalanceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [spendingLimit, setSpendingLimit] = useState(5);
  const [threshold, setThreshold] = useState(10);
  const [autoExecution, setAutoExecution] = useState(false);
  const [killSwitchActive, setKillSwitchActive] = useState(false);

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

  const handleKillSwitch = () => {
    setKillSwitchActive(true);
    setAutoExecution(false);
  };

  const balance = data?.usdc.balance || 0;
  const ratio = balance / threshold;
  let riskScore = 'LOW';
  let riskColor = 'text-green-400';
  let barColor = 'bg-green-400';
  let barWidth = '20%';
  
  if (ratio < 0.5) {
    riskScore = 'CRITICAL';
    riskColor = 'text-red-500';
    barColor = 'bg-red-500';
    barWidth = '90%';
  } else if (ratio < 1) {
    riskScore = 'HIGH';
    riskColor = 'text-orange-400';
    barColor = 'bg-orange-400';
    barWidth = '70%';
  } else if (ratio < 1.5) {
    riskScore = 'MEDIUM';
    riskColor = 'text-yellow-400';
    barColor = 'bg-yellow-400';
    barWidth = '45%';
  }

  const balanceClass = error ? 'text-red-400' : 'text-green-400';

  return (
    <main className='min-h-screen bg-gray-900 text-white p-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold'>Spring — AI Treasury Operator</h1>
        <button 
          onClick={handleKillSwitch}
          disabled={killSwitchActive}
          className={'px-6 py-2 rounded font-bold ' + (killSwitchActive ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500')}
        >
          {killSwitchActive ? 'STOPPED' : 'KILL SWITCH'}
        </button>
      </div>
      
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
              <span className={killSwitchActive ? 'text-red-400' : 'text-green-400'}>
                {killSwitchActive ? 'Stopped' : 'Active'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Monitoring</span>
              <span className='text-yellow-400'>Paused</span>
            </div>
            <div className='flex justify-between'>
              <span>Auto-Execution</span>
              <span className={autoExecution ? 'text-green-400' : 'text-red-400'}>
                {autoExecution ? 'Enabled' : 'Disabled'}
              </span>
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
                value={spendingLimit}
                onChange={(e) => setSpendingLimit(Number(e.target.value))}
                disabled={killSwitchActive}
                className='w-full mt-1 bg-gray-700 rounded px-3 py-2 text-white disabled:opacity-50'
              />
            </div>
            <div>
              <label className='text-sm text-gray-400'>Balance Threshold (USDC)</label>
              <input 
                type='number' 
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                disabled={killSwitchActive}
                className='w-full mt-1 bg-gray-700 rounded px-3 py-2 text-white disabled:opacity-50'
              />
            </div>
            <div className='flex justify-between items-center'>
              <span>Auto-Execution</span>
              <button 
                onClick={() => setAutoExecution(!autoExecution)}
                disabled={killSwitchActive}
                className={'px-4 py-1 rounded text-sm ' + (autoExecution ? 'bg-green-500' : 'bg-red-500') + (killSwitchActive ? ' opacity-50' : '')}
              >
                {autoExecution ? 'Enabled' : 'Disabled'}
              </button>
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
              <span className='text-yellow-400'>{threshold} USDC</span>
            </div>
            <div className='border-t border-gray-700 pt-4'>
              <div className='flex justify-between items-center mb-2'>
                <span>Risk Score</span>
                <span className={'text-2xl font-bold ' + riskColor}>{riskScore}</span>
              </div>
              <div className='w-full bg-gray-700 rounded-full h-2'>
                <div className={barColor + ' h-2 rounded-full transition-all duration-500'} style={{width: barWidth}}></div>
              </div>
              <p className='text-sm text-gray-400 mt-2'>
                {ratio >= 1 ? 'Balance is ' + ratio.toFixed(1) + 'x above threshold' : 'Balance is ' + (ratio * 100).toFixed(0) + '% of threshold'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <ApprovalQueue />
      </div>

      <div className='mt-6'>
        <AuditLog />
      </div>
    </main>
  );
}
