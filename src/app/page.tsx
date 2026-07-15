'use client';

import { useEffect, useState } from 'react';
import AuditLog from './components/AuditLog';
import ApprovalQueue from './components/ApprovalQueue';
import TransactionSimulator from './components/TransactionSimulator';
import MarketIntel from './components/MarketIntel';

interface BalanceData {
  address: string;
  native: { balance: number; unit: string };
  usdc: { balance: number; unit: string };
  network: string;
}

interface ApprovalItem {
  id: string;
  timestamp: string;
  proposedAction: string;
  reason: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected' | 'executing' | 'completed';
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  explanation: string;
}

export default function Home() {
  const [data, setData] = useState<BalanceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [spendingLimit, setSpendingLimit] = useState(5);
  const [threshold, setThreshold] = useState(10);
  const [autoExecution, setAutoExecution] = useState(false);
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    {
      id: '1',
      timestamp: '2026-07-15 09:15:00',
      action: 'Balance Check',
      amount: '-',
      status: 'completed',
      explanation: 'Routine monitoring check. Balance: 20 USDC. Above threshold.'
    },
    {
      id: '2',
      timestamp: '2026-07-15 08:30:00',
      action: 'Risk Assessment',
      amount: '-',
      status: 'completed',
      explanation: 'Threshold: 10 USDC. Current: 20 USDC. Risk: LOW. No action needed.'
    },
    {
      id: '3',
      timestamp: '2026-07-14 17:45:00',
      action: 'Wallet Funded',
      amount: '+20 USDC',
      status: 'completed',
      explanation: 'Faucet deposit confirmed on Arc Testnet. Transaction: 0x8184...'
    },
    {
      id: '4',
      timestamp: '2026-07-14 17:30:00',
      action: 'Agent Created',
      amount: '-',
      status: 'completed',
      explanation: 'Agent wallet initialized on Arc Testnet. Address: 0x7a0f...'
    }
  ]);

  // Fetch balance
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

  // MONITORING LOOP - THE CORE AUTONOMY
  useEffect(() => {
    if (!autoExecution || killSwitchActive || !data) {
      setIsMonitoring(false);
      setAlertMessage(null);
      return;
    }
    
    setIsMonitoring(true);
    setAlertMessage('Spring is monitoring treasury... All systems normal.');
    
    const interval = setInterval(() => {
      const balance = data.usdc.balance;
      const ratio = balance / threshold;
      
      console.log('Spring monitoring... Balance:', balance, 'Threshold:', threshold, 'Ratio:', ratio);
      
      // CHECK 1: Critical - below 50% of threshold
      if (ratio < 0.5) {
        const newItem: ApprovalItem = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          proposedAction: 'EMERGENCY: Halt All Operations',
          reason: 'CRITICAL: Balance (' + balance.toFixed(2) + ' USDC) is below 50% of threshold (' + threshold + ' USDC). Immediate action required to prevent complete depletion.',
          amount: '-',
          status: 'pending'
        };
        
        setApprovalItems(prev => {
          if (prev.some(item => item.proposedAction === newItem.proposedAction && item.status === 'pending')) {
            return prev;
          }
          return [...prev, newItem];
        });
        
        setAlertMessage('CRITICAL: Balance critically low! Approval required.');
      }
      // CHECK 2: High - below threshold
      else if (ratio < 1) {
        const newItem: ApprovalItem = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          proposedAction: 'Pause Outgoing Payments',
          reason: 'Balance (' + balance.toFixed(2) + ' USDC) has fallen below threshold (' + threshold + ' USDC). Risk: HIGH. Pausing payments prevents further depletion.',
          amount: '-',
          status: 'pending'
        };
        
        setApprovalItems(prev => {
          if (prev.some(item => item.proposedAction === newItem.proposedAction && item.status === 'pending')) {
            return prev;
          }
          return [...prev, newItem];
        });
        
        setAlertMessage('WARNING: Balance below threshold. Approval required.');
      }
      // CHECK 3: Medium - approaching threshold
      else if (ratio < 1.5) {
        setAlertMessage('CAUTION: Balance approaching threshold. Monitor closely.');
      }
      // CHECK 4: Safe
      else {
        setAlertMessage('Spring is monitoring treasury... All systems normal.');
      }
    }, 5000);
    
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
      setAlertMessage(null);
    };
  }, [autoExecution, killSwitchActive, data, threshold]);

  const handleKillSwitch = () => {
    setKillSwitchActive(true);
    setAutoExecution(false);
    setAlertMessage('KILL SWITCH ACTIVATED. All operations halted.');
    
    const newEntry: AuditEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'Emergency Stop',
      amount: '-',
      status: 'completed',
      explanation: 'Kill switch activated by user. All autonomous operations halted immediately.'
    };
    setAuditLog(prev => [newEntry, ...prev]);
  };

  const handleApprove = (id: string) => {
    setApprovalItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newEntry: AuditEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            action: item.proposedAction,
            amount: item.amount,
            status: 'completed',
            explanation: 'Approved by user. ' + item.reason
          };
          setAuditLog(audit => [newEntry, ...audit]);
          
          return { ...item, status: 'completed' };
        }
        return item;
      })
    );
    setAlertMessage('Action approved and executed.');
  };

  const handleReject = (id: string) => {
    setApprovalItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newEntry: AuditEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            action: item.proposedAction,
            amount: item.amount,
            status: 'failed',
            explanation: 'Rejected by user. ' + item.reason
          };
          setAuditLog(audit => [newEntry, ...audit]);
          
          return { ...item, status: 'rejected' };
        }
        return item;
      })
    );
    setAlertMessage('Action rejected.');
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
      {/* Alert Banner */}
      {alertMessage && (
        <div className={'mb-4 p-4 rounded-lg ' + (alertMessage.includes('CRITICAL') ? 'bg-red-900 border border-red-500' : alertMessage.includes('WARNING') ? 'bg-orange-900 border border-orange-500' : alertMessage.includes('CAUTION') ? 'bg-yellow-900 border border-yellow-500' : 'bg-blue-900 border border-blue-500')}>
          <p className='font-medium'>{alertMessage}</p>
        </div>
      )}
      
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
              <span className={isMonitoring ? 'text-green-400 animate-pulse' : 'text-yellow-400'}>
                {isMonitoring ? 'Active' : 'Paused'}
              </span>
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
        <ApprovalQueue items={approvalItems} onApprove={handleApprove} onReject={handleReject} />
      </div>

      <div className='mt-6'>
        <MarketIntel />
      </div>

      <div className='mt-6'>
        <TransactionSimulator />
      </div>

      <div className='mt-6'>
        <AuditLog entries={auditLog} />
      </div>
    </main>
  );
}
