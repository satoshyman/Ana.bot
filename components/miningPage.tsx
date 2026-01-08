import React, { useState, useEffect, useMemo } from 'react';
import { UserState, AppSettings } from '../types';
import { DAY_IN_MS } from '../constants';

interface MiningPageProps {
  state: UserState;
  settings: AppSettings;
  onStart: () => void;
  onEnd: () => void;
  onClaimGift: () => void;
}

const MiningPage: React.FC<MiningPageProps> = ({ state, settings, onStart, onEnd, onClaimGift }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showEndNotification, setShowEndNotification] = useState(false);
  const [showGiftNotification, setShowGiftNotification] = useState(false);
  const [currentSessionEarnings, setCurrentSessionEarnings] = useState<number>(0);
  const [giftCountdown, setGiftCountdown] = useState<number>(0);
  const [adLoading, setAdLoading] = useState(false);

  const tonLogoUrl = "https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=040";

  useEffect(() => {
    let interval: any;
    if (state.isMining && state.miningStartTime) {
      const updateTimer = () => {
        const elapsed = Date.now() - (state.miningStartTime as number);
        const remaining = settings.sessionDurationMs - elapsed;
        
        if (remaining <= 0) {
          onEnd();
          setTimeLeft(0);
          setShowEndNotification(true);
          setTimeout(() => setShowEndNotification(false), 4000);
        } else {
          setTimeLeft(remaining);
          setCurrentSessionEarnings((elapsed / settings.sessionDurationMs) * settings.miningRatePerSession);
        }
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isMining, state.miningStartTime, onEnd, settings]);

  useEffect(() => {
    const updateGiftTimer = () => {
      const remaining = DAY_IN_MS - (Date.now() - (state.lastGiftClaimedTime || 0));
      setGiftCountdown(remaining > 0 ? remaining : 0);
    };
    updateGiftTimer();
    const interval = setInterval(updateGiftTimer, 1000);
    return () => clearInterval(interval);
  }, [state.lastGiftClaimedTime]);

  const showAd = async () => {
    if (!(window as any).Adsgram) return true;
    setAdLoading(true);
    try {
      const AdController = (window as any).Adsgram.init({ blockId: settings.adsgramBlockId });
      const result = await AdController.show();
      setAdLoading(false);
      return result.done;
    } catch {
      setAdLoading(false);
      return false;
    }
  };

  const handleOpenGift = async () => {
    if (giftCountdown > 0) return;
    if (await showAd()) {
      onClaimGift();
      setShowGiftNotification(true);
      setTimeout(() => setShowGiftNotification(false), 3000);
    }
  };

  const formatTime = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = state.isMining ? ((settings.sessionDurationMs - timeLeft) / settings.sessionDurationMs) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-4 py-2 pb-10 animate-fadeIn relative">
      {adLoading && (
        <div className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Gift Button */}
      <div className="absolute top-2 left-2 z-30">
        <button 
          onClick={handleOpenGift}
          disabled={giftCountdown > 0}
          className={`flex flex-col items-center gap-1 transition-all ${giftCountdown > 0 ? 'opacity-40' : 'animate-bounce'}`}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-yellow-200/50">
            <span className="text-xl">🎁</span>
          </div>
          <span className="text-[8px] font-black bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            {giftCountdown > 0 ? formatTime(giftCountdown) : 'GIFT'}
          </span>
        </button>
      </div>

      <div className="text-center mt-2">
        <h1 className="text-2xl font-black text-blue-400 tracking-tight">TON CLOUD</h1>
        <div className="h-1 w-12 bg-blue-500/50 mx-auto rounded-full"></div>
      </div>

      {/* Mining Circle - Reduced vertical margin to fit screen better */}
      <div className="relative flex items-center justify-center w-60 h-60 sm:w-72 sm:h-72 my-2">
        <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
          <circle cx="50%" cy="50%" r="46%" fill="transparent" stroke="#0f172a" strokeWidth="12" />
          <circle 
            cx="50%" cy="50%" r="46%" 
            fill="transparent" stroke="url(#g)" strokeWidth="12" 
            strokeDasharray="100 100" strokeDashoffset={100 - progress}
            pathLength="100" strokeLinecap="round" className="transition-all duration-1000"
          />
          <defs><linearGradient id="g"><stop offset="0%" stopColor="#0ea5e9"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
        </svg>

        <div className={`w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-slate-900 border-4 flex items-center justify-center shadow-2xl transition-all duration-500 ${state.isMining ? 'border-blue-400 mining-pulse shadow-blue-500/20' : 'border-slate-800'}`}>
          <img src={tonLogoUrl} className={`w-20 h-20 sm:w-24 sm:h-24 ${state.isMining ? 'opacity-100' : 'opacity-20 grayscale'}`} />
        </div>
      </div>

      {/* Stats Card */}
      <div className="w-full max-w-[320px] bg-slate-900 border border-slate-800 rounded-[2rem] p-5 flex flex-col items-center shadow-xl">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Session Earnings</span>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-mono font-black text-white">{currentSessionEarnings.toFixed(8)}</span>
          <span className="text-xs font-bold text-blue-400">TON</span>
        </div>
        <div className="px-6 py-2 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xl text-cyan-400 shadow-inner">
          {formatTime(state.isMining ? timeLeft : settings.sessionDurationMs)}
        </div>
      </div>

      {/* Action Button - Added more bottom margin to avoid overlap */}
      <div className="w-full max-w-[320px] mt-2 mb-10">
        {!state.isMining ? (
          <button 
            onClick={async () => { if (await showAd()) onStart(); }}
            className="w-full py-4 rounded-2xl ton-gradient text-white font-black text-lg shadow-lg active-scale transition-transform flex items-center justify-center gap-3"
          >
            <span>START MINING</span>
            <span className="text-xl">⛏️</span>
          </button>
        ) : (
          <div className="py-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-center text-blue-400 font-bold text-sm animate-pulse">
            Cloud Mining in progress...
          </div>
        )}
      </div>
    </div>
  );
};

export default MiningPage;
