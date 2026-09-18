import { useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useBusinessStore } from '../../lib/services/business';
import { runTrustJob, type TrustJob } from '../../lib/services/trust';
import { formatDate } from '../../lib/format';

export function AdminTrustPage() {
  const { user, lang } = useAuthStore();
  const { businesses, trustEvents } = useBusinessStore();
  const isBn = lang === 'bn';

  const [jobs, setJobs] = useState<TrustJob[]>([]);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      const job = runTrustJob();
      setJobs([job, ...jobs]);
      setRunning(false);
    }, 1000);
  };

  const recentEvents = trustEvents.slice(0, 20);
  const activeBusinesses = businesses.filter((b) => b.status === 'active');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-text">{isBn ? 'ট্রাস্ট স্কোর অটোমেশন' : 'Trust Score Automation'}</h1>
        <button
          onClick={handleRun}
          disabled={running}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? (isBn ? 'চলছে...' : 'Running...') : (isBn ? 'এখন চালান' : 'Run Now')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'সক্রিয় ব্যবসা' : 'Active Businesses'}</p>
          <p className="text-2xl font-bold text-brand-text">{activeBusinesses.length}</p>
        </div>
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'মোট ইভেন্ট' : 'Total Events'}</p>
          <p className="text-2xl font-bold text-brand-text">{trustEvents.length}</p>
        </div>
        <div className="card">
          <p className="text-xs text-brand-muted mb-1">{isBn ? 'গড় ট্রাস্ট' : 'Avg Trust'}</p>
          <p className="text-2xl font-bold text-brand-text">
            {activeBusinesses.length > 0
              ? Math.round(activeBusinesses.reduce((sum, b) => sum + b.trust_score, 0) / activeBusinesses.length)
              : 0}
          </p>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'সাম্প্রতিক জব' : 'Recent Jobs'}</h2>
        {jobs.length === 0 ? (
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো জব চালানো হয়নি' : 'No jobs run yet'}</p>
        ) : (
          <div className="space-y-2">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-brand-panel2 rounded-lg">
                <div>
                  <p className="text-sm text-brand-text">{formatDate(job.started_at, lang)}</p>
                  <p className="text-xs text-brand-muted">
                    {job.businesses_scanned} {isBn ? 'ব্যবসা স্ক্যান' : 'businesses scanned'}, {job.events_created} {isBn ? 'ইভেন্ট তৈরি' : 'events created'}
                  </p>
                </div>
                {job.error_message && (
                  <span className="text-xs text-brand-bad">{job.error_message}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Events */}
      <div className="card">
        <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'সাম্প্রতিক ইভেন্ট' : 'Recent Events'}</h2>
        {recentEvents.length === 0 ? (
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো ইভেন্ট নেই' : 'No events yet'}</p>
        ) : (
          <div className="space-y-2">
            {recentEvents.map((event) => {
              const business = businesses.find((b) => b.id === event.business_id);
              return (
                <div key={event.id} className="flex items-center justify-between p-3 bg-brand-panel2 rounded-lg">
                  <div>
                    <p className="text-sm text-brand-text">{business?.name || 'Unknown'}</p>
                    <p className="text-xs text-brand-muted">{event.reason}</p>
                  </div>
                  <span className={`text-sm font-bold ${event.delta >= 0 ? 'text-brand-accent' : 'text-brand-bad'}`}>
                    {event.delta >= 0 ? '+' : ''}{event.delta}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
