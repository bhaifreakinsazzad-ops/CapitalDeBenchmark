import { useBusinessStore } from './business';
import { notify } from './notify';

export interface TrustJob {
  id: string;
  started_at: string;
  finished_at?: string;
  businesses_scanned: number;
  events_created: number;
  error_message?: string;
}

export interface TrustRule {
  name: string;
  check: (business: any) => { shouldApply: boolean; delta: number; reason: string };
}

// Trust score automation rules
export const trustRules: TrustRule[] = [
  // Follower milestones
  {
    name: 'followers_10',
    check: (business) => ({
      shouldApply: business.followers_count >= 10,
      delta: 2,
      reason: 'Followers 10',
    }),
  },
  {
    name: 'followers_100',
    check: (business) => ({
      shouldApply: business.followers_count >= 100,
      delta: 5,
      reason: 'Followers 100',
    }),
  },
  {
    name: 'followers_500',
    check: (business) => ({
      shouldApply: business.followers_count >= 500,
      delta: 8,
      reason: 'Followers 500',
    }),
  },
  
  // Funding milestones
  {
    name: 'funding_50',
    check: (business) => {
      const progress = (business.shares_sold / business.total_shares) * 100;
      return {
        shouldApply: progress >= 50,
        delta: 3,
        reason: 'Funding 50%',
      };
    },
  },
  {
    name: 'funding_100',
    check: (business) => {
      const progress = (business.shares_sold / business.total_shares) * 100;
      return {
        shouldApply: progress >= 100,
        delta: 5,
        reason: 'Funding 100%',
      };
    },
  },
  
  // Update activity
  {
    name: 'active_update_7d',
    check: (business) => {
      if (!business.last_update_at) return { shouldApply: false, delta: 0, reason: '' };
      const daysSinceUpdate = (Date.now() - new Date(business.last_update_at).getTime()) / (1000 * 60 * 60 * 24);
      return {
        shouldApply: daysSinceUpdate <= 7,
        delta: 1,
        reason: 'Active update last 7d',
      };
    },
  },
  {
    name: 'stale_30d',
    check: (business) => {
      if (!business.last_update_at) return { shouldApply: false, delta: 0, reason: '' };
      const daysSinceUpdate = (Date.now() - new Date(business.last_update_at).getTime()) / (1000 * 60 * 60 * 24);
      return {
        shouldApply: daysSinceUpdate > 30 && daysSinceUpdate <= 60,
        delta: -3,
        reason: 'Stale 30d',
      };
    },
  },
  {
    name: 'stale_60d',
    check: (business) => {
      if (!business.last_update_at) return { shouldApply: false, delta: 0, reason: '' };
      const daysSinceUpdate = (Date.now() - new Date(business.last_update_at).getTime()) / (1000 * 60 * 60 * 24);
      return {
        shouldApply: daysSinceUpdate > 60,
        delta: -6,
        reason: 'Stale 60d',
      };
    },
  },
  
  // Freshness
  {
    name: 'loyalty_180d',
    check: (business) => {
      const daysActive = (Date.now() - new Date(business.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return {
        shouldApply: daysActive > 180,
        delta: 2,
        reason: 'Loyalty 180d',
      };
    },
  },
  {
    name: 'loyalty_365d',
    check: (business) => {
      const daysActive = (Date.now() - new Date(business.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return {
        shouldApply: daysActive > 365,
        delta: 5,
        reason: 'Loyalty 365d',
      };
    },
  },
];

export function runTrustJob(): TrustJob {
  const job: TrustJob = {
    id: crypto.randomUUID(),
    started_at: new Date().toISOString(),
    businesses_scanned: 0,
    events_created: 0,
  };
  
  try {
    const { businesses, trustEvents, bumpTrustScore } = useBusinessStore.getState();
    const activeBusinesses = businesses.filter((b) => b.status === 'active');
    
    for (const business of activeBusinesses) {
      job.businesses_scanned++;
      
      // Track total delta for this business in this run
      let totalDelta = 0;
      
      for (const rule of trustRules) {
        const { shouldApply, delta, reason } = rule.check(business);
        
        if (!shouldApply) continue;
        
        // Check if this rule has already been applied (idempotency)
        const alreadyApplied = trustEvents.some(
          (e) => e.business_id === business.id && e.reason === reason
        );
        
        if (alreadyApplied) continue;
        
        // Apply the rule
        bumpTrustScore(business.id, delta, reason);
        totalDelta += delta;
        job.events_created++;
        
        // Cap at ±5 per business per run
        if (Math.abs(totalDelta) >= 5) break;
      }
      
      // Notify owner if score changed significantly
      if (Math.abs(totalDelta) >= 3) {
        notify(business.owner_id, 'trust_score_changed', {
          business_id: business.id,
          business_name: business.name,
          old_score: business.trust_score - totalDelta,
          new_score: business.trust_score,
        });
      }
    }
    
    job.finished_at = new Date().toISOString();
  } catch (error) {
    job.error_message = error instanceof Error ? error.message : 'Unknown error';
    job.finished_at = new Date().toISOString();
  }
  
  return job;
}
