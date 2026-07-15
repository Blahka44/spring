interface ApprovalItem {
  id: string;
  timestamp: string;
  proposedAction: string;
  reason: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected' | 'executing' | 'completed';
}

interface ApprovalQueueProps {
  items: ApprovalItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function ApprovalQueue({ items, onApprove, onReject }: ApprovalQueueProps) {
  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <div className='bg-gray-800 rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4'>Approval Queue ({pendingCount} pending)</h2>
      
      {items.length === 0 ? (
        <p className='text-gray-400'>No pending approvals. Spring is monitoring...</p>
      ) : (
        <div className='space-y-4'>
          {items.map((item) => (
            <div key={item.id} className='border border-gray-600 rounded-lg p-4'>
              <div className='flex justify-between items-start mb-2'>
                <div>
                  <p className='text-sm text-gray-400'>{item.timestamp}</p>
                  <p className='font-medium text-lg'>{item.proposedAction}</p>
                </div>
                <span className={'text-xs px-2 py-1 rounded ' + (
                  item.status === 'completed' ? 'bg-green-900 text-green-400' :
                  item.status === 'rejected' ? 'bg-red-900 text-red-400' :
                  'bg-yellow-900 text-yellow-400'
                )}>
                  {item.status}
                </span>
              </div>
              
              <div className='bg-gray-900 rounded p-3 mb-3'>
                <p className='text-sm text-gray-300 mb-1'>Why Spring recommends this:</p>
                <p className='text-sm text-gray-400'>{item.reason}</p>
              </div>
              
              {item.status === 'pending' && (
                <div className='flex gap-2'>
                  <button 
                    onClick={() => onApprove(item.id)}
                    className='flex-1 bg-green-600 hover:bg-green-500 py-2 rounded text-sm font-medium'
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => onReject(item.id)}
                    className='flex-1 bg-red-600 hover:bg-red-500 py-2 rounded text-sm font-medium'
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
