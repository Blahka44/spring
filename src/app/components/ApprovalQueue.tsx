interface ApprovalItem {
  id: string;
  timestamp: string;
  proposedAction: string;
  reason: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
}

const approvalData: ApprovalItem[] = [
  {
    id: '1',
    timestamp: '2026-07-15 13:00:00',
    proposedAction: 'Pause Outgoing Payments',
    reason: 'USDC balance (20.00) is approaching threshold (25.00). Risk: HIGH. Pausing payments prevents further depletion.',
    amount: '-',
    status: 'pending'
  }
];

export default function ApprovalQueue() {
  return (
    <div className='bg-gray-800 rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4'>Approval Queue</h2>
      <div className='space-y-4'>
        {approvalData.map((item) => (
          <div key={item.id} className='border border-gray-600 rounded-lg p-4'>
            <div className='flex justify-between items-start mb-2'>
              <div>
                <p className='text-sm text-gray-400'>{item.timestamp}</p>
                <p className='font-medium text-lg'>{item.proposedAction}</p>
              </div>
              <span className='text-xs px-2 py-1 rounded bg-yellow-900 text-yellow-400'>
                {item.status}
              </span>
            </div>
            
            <div className='bg-gray-900 rounded p-3 mb-3'>
              <p className='text-sm text-gray-300 mb-1'>Why Spring recommends this:</p>
              <p className='text-sm text-gray-400'>{item.reason}</p>
            </div>
            
            <div className='flex gap-2'>
              <button className='flex-1 bg-green-600 hover:bg-green-500 py-2 rounded text-sm font-medium'>
                Approve
              </button>
              <button className='flex-1 bg-red-600 hover:bg-red-500 py-2 rounded text-sm font-medium'>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
