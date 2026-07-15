interface IntelSource {
  name: string;
  status: 'active' | 'inactive';
  lastUpdate: string;
  cost: string;
  data: string;
}

const sources: IntelSource[] = [
  {
    name: 'Price Oracle',
    status: 'active',
    lastUpdate: '2026-07-15 14:55:00',
    cost: '0.0001 USDC',
    data: 'USDC/USD: 1.000'
  },
  {
    name: 'Risk Index',
    status: 'active',
    lastUpdate: '2026-07-15 14:55:00',
    cost: '0.0002 USDC',
    data: 'Market Risk: LOW'
  },
  {
    name: 'Liquidity Depth',
    status: 'active',
    lastUpdate: '2026-07-15 14:55:00',
    cost: '0.0001 USDC',
    data: 'Arc DEX: .4M TVL'
  }
];

export default function MarketIntel() {
  return (
    <div className='bg-gray-800 rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4'>Market Intelligence</h2>
      <p className='text-sm text-gray-400 mb-4'>Spring queries real-time data via Circle Nano Payments</p>
      
      <div className='space-y-3'>
        {sources.map((source, idx) => (
          <div key={idx} className='flex justify-between items-center bg-gray-900 rounded p-3'>
            <div>
              <p className='font-medium'>{source.name}</p>
              <p className='text-xs text-gray-400'>Cost: {source.cost}</p>
              <p className='text-xs text-gray-500'>Updated: {source.lastUpdate}</p>
            </div>
            <div className='text-right'>
              <p className='text-green-400 text-sm'>{source.data}</p>
              <span className='text-xs text-green-500'>● {source.status}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className='mt-4 pt-4 border-t border-gray-700'>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-400'>Total Query Cost</span>
          <span className='text-yellow-400'>0.0004 USDC</span>
        </div>
        <div className='flex justify-between text-sm mt-1'>
          <span className='text-gray-400'>Payment Method</span>
          <span className='text-blue-400'>Nano Payments</span>
        </div>
      </div>
    </div>
  );
}
