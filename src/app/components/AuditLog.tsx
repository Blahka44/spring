interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  explanation: string;
}

const auditData: AuditEntry[] = [
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
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'completed') {
    return <span className='text-xs px-2 py-1 rounded bg-green-900 text-green-400'>completed</span>;
  }
  if (status === 'pending') {
    return <span className='text-xs px-2 py-1 rounded bg-yellow-900 text-yellow-400'>pending</span>;
  }
  return <span className='text-xs px-2 py-1 rounded bg-red-900 text-red-400'>failed</span>;
}

export default function AuditLog() {
  return (
    <div className='bg-gray-800 rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4'>Audit Log</h2>
      <div className='space-y-3'>
        {auditData.map((entry) => (
          <div key={entry.id} className='border-l-4 border-gray-600 pl-4 py-2'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm text-gray-400'>{entry.timestamp}</p>
                <p className='font-medium'>{entry.action}</p>
                {entry.amount !== '-' && (
                  <p className='text-green-400'>{entry.amount}</p>
                )}
              </div>
              <StatusBadge status={entry.status} />
            </div>
            <p className='text-sm text-gray-400 mt-1'>{entry.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
