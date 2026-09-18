import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DailyStat {
  stat_date: string;
  active_users: number;
  new_users: number;
  total_raised_bdt: number;
  trade_volume_bdt: number;
  trades_count: number;
  investments_count: number;
  deposits_bdt: number;
  withdrawals_bdt: number;
  ad_revenue_bdt: number;
}

interface StatsStore {
  dailyStats: DailyStat[];
  
  // Generate snapshot for a date
  generateSnapshot: (date?: string) => DailyStat;
  
  // Get stats for a date range
  getStats: (from?: string, to?: string) => DailyStat[];
  
  // Get KPIs for last 30 days
  getKPIs: () => {
    total_raised: number;
    trade_volume: number;
    trades_count: number;
    new_users: number;
    active_users: number;
    ad_revenue: number;
  };
  
  // Get trend data
  getTrend: (metric: keyof DailyStat, days?: number) => { date: string; value: number }[];
}

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      dailyStats: [],
      
      generateSnapshot: (date) => {
        const statDate = date || new Date().toISOString().split('T')[0];
        
        // In a real implementation, this would query actual data
        // For demo, we'll generate realistic mock data
        const mockStat: DailyStat = {
          stat_date: statDate,
          active_users: Math.floor(Math.random() * 100) + 50,
          new_users: Math.floor(Math.random() * 20) + 5,
          total_raised_bdt: Math.floor(Math.random() * 50000) + 10000,
          trade_volume_bdt: Math.floor(Math.random() * 30000) + 5000,
          trades_count: Math.floor(Math.random() * 50) + 10,
          investments_count: Math.floor(Math.random() * 30) + 5,
          deposits_bdt: Math.floor(Math.random() * 40000) + 8000,
          withdrawals_bdt: Math.floor(Math.random() * 20000) + 3000,
          ad_revenue_bdt: Math.floor(Math.random() * 5000) + 1000,
        };
        
        set((state) => {
          const existing = state.dailyStats.findIndex((s) => s.stat_date === statDate);
          if (existing >= 0) {
            const updated = [...state.dailyStats];
            updated[existing] = mockStat;
            return { dailyStats: updated };
          }
          return { dailyStats: [...state.dailyStats, mockStat] };
        });
        
        return mockStat;
      },
      
      getStats: (from, to) => {
        let stats = [...get().dailyStats];
        
        if (from) {
          stats = stats.filter((s) => s.stat_date >= from);
        }
        
        if (to) {
          stats = stats.filter((s) => s.stat_date <= to);
        }
        
        return stats.sort((a, b) => a.stat_date.localeCompare(b.stat_date));
      },
      
      getKPIs: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
        
        const stats = get().getStats(fromDate);
        
        return {
          total_raised: stats.reduce((sum, s) => sum + s.total_raised_bdt, 0),
          trade_volume: stats.reduce((sum, s) => sum + s.trade_volume_bdt, 0),
          trades_count: stats.reduce((sum, s) => sum + s.trades_count, 0),
          new_users: stats.reduce((sum, s) => sum + s.new_users, 0),
          active_users: stats.reduce((sum, s) => sum + s.active_users, 0),
          ad_revenue: stats.reduce((sum, s) => sum + s.ad_revenue_bdt, 0),
        };
      },
      
      getTrend: (metric, days = 30) => {
        const stats = get().getStats();
        const recentStats = stats.slice(-days);
        
        return recentStats.map((s) => ({
          date: s.stat_date,
          value: s[metric] as number,
        }));
      },
    }),
    { name: 'capitaldb-stats' }
  )
);
