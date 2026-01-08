import React, { useState } from 'react';
import { UserState, AppSettings } from '../types';

interface WalletPageProps {
  state: UserState;
  settings: AppSettings;
  onUpdateAddress: (address: string) => void;
  onWithdraw: (amount: number, address: string) => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ state, settings, onUpdateAddress, onWithdraw }) => {
  const [address, setAddress] = useState(state.withdrawalAddress);

  const handleWithdraw = () => {
    if (address.length < 10) return alert('Invalid address');
    if (state.balance < settings.minWithdrawal + 0.01) return alert('Insufficient balance');
    onWithdraw(state.balance - 0.01, address);
  };

  return (
    <div className="flex flex-col gap-4 py-2 animate-fadeIn">
      <div className="ton-gradient rounded-3xl p-6 text-center shadow-lg">
        <p className="text-xs font-bold text-blue-100 opacity-80 mb-1">Withdrawable Balance</p>
        <h2 className="text-3xl font-mono font-black">{state.balance.toFixed(8)} <span className="text-sm">TON</span></h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h3 className="font-black text-sm text-slate-300">Request Withdrawal</h3>
        
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 ml-2 font-black uppercase">Wallet Address</label>
          <input 
            type="text" value={address}
            onChange={(e) => { setAddress(e.target.value); onUpdateAddress(e.target.value); }}
            placeholder="UQ... or EQ..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-blue-400 text-xs font-mono outline-none focus:border-blue-500"
          />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl space-y-2 text-[10px] font-bold">
          <div className="flex justify-between">
            <span className="text-slate-500">Min Withdrawal:</span>
            <span>{settings.minWithdrawal} TON</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Fee:</span>
            <span className="text-blue-400">0.0100 TON</span>
          </div>
        </div>

        <button 
          onClick={handleWithdraw}
          className="w-full py-4 rounded-xl bg-white text-slate-950 font-black active-scale transition-all"
        >
          Withdraw Balance
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
        <h3 className="text-sm font-black mb-3">Transaction History</h3>
        {state.withdrawalHistory.length === 0 ? (
          <p className="text-center text-[10px] text-slate-600 py-6">No recent withdrawals</p>
        ) : (
          <div className="space-y-2">
            {state.withdrawalHistory.map(h => (
              <div key={h.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div className="text-[10px]">
                  <p className="font-black text-white">{h.amount.toFixed(4)} TON</p>
                  <p className="text-slate-600 font-mono text-[8px] truncate w-24">{h.address}</p>
                </div>
                <span className={`text-[8px] font-black px-2 py-1 rounded-lg ${h.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' : h.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {h.status === 'Processing' ? 'Under Review' : h.status === 'Completed' ? 'Completed' : 'Rejected'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;