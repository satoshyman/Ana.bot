export const DEFAULT_SETTINGS = {
  // --- Earning and Time Settings ---
  miningRatePerSession: 0.00550000, 
  sessionDurationMs: 3 * 60 * 60 * 1000, 
  
  // --- Financial Settings ---
  referralCommission: 10, 
  minWithdrawal: 0.10000000, 
  dailyGiftAmount: 0.00150000, 
  
  // --- Technical Settings ---
  adsgramBlockId: '3946', 
  adminBotToken: '', 
  adminChatId: '', 
  adminPassword: '123', 
  
  // --- Default Task List ---
  tasks: [
    { id: 'ad1', title: 'Watch Quick Ad 1', reward: 0.00015000, type: 'ad' },
    { id: 'ad2', title: 'Watch Quick Ad 2', reward: 0.00020000, type: 'ad' },
    { id: 'join_tg', title: 'Join Official Telegram Channel', reward: 0.00100000, type: 'social' },
  ]
};

export const UPDATE_INTERVAL_MS = 1000;
export const DAY_IN_MS = 24 * 60 * 60 * 1000;