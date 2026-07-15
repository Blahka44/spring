interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  explanation: string;
}

interface AuditLogProps {
  entries: AuditEntry[];
}

export default function AuditLog({ entries }: AuditLogProps) {
  return (
    <div className='bg-gray-800 rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4'>Audit Log ({entries.length} entries)</h2>
      <div className='space-y-3'>
        {entries.map((entry) => (
          <div key={entry.id} className='border-l-4 border-gray-600 pl-4 py-2'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm text-gray-400'>{entry.timestamp}</p>
                <p className='font-medium'>{entry.action}</p>
                {entry.amount !== '-' && (
                  <p className='text-green-400'>{entry.amount}</p>
                )}
              </div>
              <span className={'text-xs px-2 py-1 rounded ' + (
                entry.status === 'completed' ? 'bg-green-900 text-green-400' :
                entry.status === 'pending' ? 'bg-yellow-900 text-yellow-400' :
                'bg-red-900 text-red-400'
              )}>
                {entry.status}
              </span>
            </div>
            <p className='text-sm text-gray-400 mt-1'>{entry.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
