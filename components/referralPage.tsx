import React, { useState } from 'react';
import { UserState, AppSettings } from '../types';

interface ReferralPageProps {
  state: UserState;
  settings: AppSettings;
}

const ReferralPage: React.FC<ReferralPageProps> = ({ state, settings }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://t.me/ton_cloud_miner_bot?start=${state.userId}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    const text = `🚀 Start mining TON for free! Use my link to get a welcome bonus:\n\n${referralLink}`;
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`);
    } else {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-black text-white">Advanced Referral System</h2>
        <p className="text-slate-400 text-sm mt-1">Invite friends and share profits</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Your Commission</p>
            <p className="text-4xl font-black text-blue-400">{settings.referralCommission}%</p>
          </div>
          <div className="bg-blue-500/10 p-4 rounded-[1.5rem] border border-blue-500/20 shadow-inner">
             <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed font-bold">
          Earn <span className="text-blue-400 font-black">{settings.referralCommission}%</span> of the lifetime mining earnings from everyone who signs up through your link.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/60 backdrop-blur-md text-center shadow-sm">
          <p className="text-[10px] text-slate-500 mb-1 font-black uppercase">Referrals</p>
          <p className="text-2xl font-black text-white">{state.referralsCount}</p>
        </div>
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/60 backdrop-blur-md text-center shadow-sm">
          <p className="text-[10px] text-slate-500 mb-1 font-black uppercase">My Earnings</p>
          <p className="text-2xl font-black text-green-400 font-mono">{state.referralEarnings.toFixed(6)}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-inner">
        <h3 className="font-black text-slate-200 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
          Direct Referral Link
        </h3>
        
        <div className="relative group">
          <input 
            type="text" 
            readOnly 
            value={referralLink} 
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pr-4 pl-12 text-blue-400 font-mono text-xs outline-none focus:border-blue-500 transition-all text-left" 
            dir="ltr"
          />
          <button 
            onClick={handleCopy} 
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-blue-500 transition-colors"
          >
            {copied ? (
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleShare} 
            className="py-4 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14v-4H8l4-4 4 4h-3v4h-2z"/></svg>
            <span>Invite Friend</span>
          </button>
          <button 
            onClick={handleCopy} 
            className="py-4 rounded-2xl bg-slate-800 text-slate-200 font-black text-sm border border-slate-700 active:scale-95 transition-all"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-3xl flex items-start gap-3">
        <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider mb-1">How it works?</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
            When a friend uses your link, their account is permanently linked to yours. Every time they finish a mining session, your commission is automatically added to your balance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
