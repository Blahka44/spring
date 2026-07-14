import { NextResponse } from 'next/server';

export async function GET() {
  const walletAddress = '0x7a0fd23e979dc682d23dc3782cc6d9ae83b913b6';
  const rpcUrl = 'https://rpc.testnet.arc.network';
  const usdcContract = '0x3600000000000000000000000000000000000000';
  
  try {
    // Fetch native balance (ETH)
    const nativeResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [walletAddress, 'latest'],
        id: 1
      })
    });
    
    const nativeData = await nativeResponse.json();
    const nativeWei = parseInt(nativeData.result, 16);
    const nativeEth = nativeWei / 1e18;

    // Fetch USDC balance (ERC-20)
    const balanceOfData = '0x70a08231000000000000000000000000' + walletAddress.slice(2);
    
    const usdcResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [{ to: usdcContract, data: balanceOfData }, 'latest'],
        id: 2
      })
    });
    
    const usdcData = await usdcResponse.json();
    const usdcRaw = parseInt(usdcData.result, 16);
    const usdcBalance = usdcRaw / 1e6; // USDC has 6 decimals

    return NextResponse.json({ 
      address: walletAddress,
      native: {
        balance: nativeEth,
        unit: 'ETH'
      },
      usdc: {
        balance: usdcBalance,
        unit: 'USDC'
      },
      network: 'Arc Testnet'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch balances' }, { status: 500 });
  }
}