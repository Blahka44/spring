import { NextResponse } from 'next/server';

export async function GET() {
  const walletAddress = '0x7a0fd23e979dc682d23dc3782cc6d9ae83b913b6';
  const rpcUrl = 'https://rpc.testnet.arc.network';
  
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [walletAddress, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json();
    const balanceWei = parseInt(data.result, 16);
    const balanceEth = balanceWei / 1e18;
    
    return NextResponse.json({ 
      address: walletAddress,
      balance: balanceEth,
      unit: 'ETH',
      network: 'Arc Testnet'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
