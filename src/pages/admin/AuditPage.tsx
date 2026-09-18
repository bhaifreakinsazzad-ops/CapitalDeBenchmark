import { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useAuditStore } from '../../lib/services/audit';
import { formatDate } from '../../lib/format';
import { downloadCSV } from '../../lib/csv';
import { columnSets } from '../../lib/csv';

export function AdminAuditPage() {
  const { user, lang } = useAuthStore();
  const { getLogs, exportToCSV } = useAuditStore();
  const isBn = lang === 'bn';

  const [filters, setFilters] = useState({
    admin_id: '',
    action: '',
    target_type: '',
    from: '',
    to: '',
    search: '',
    page: 1,
  });

  const { logs, total } = getLogs(filters);
  const totalPages = Math.ceil(total / 50);

  const handleExport = () => {
    const csv = exportToCSV(filters);
    downloadCSV(csv, `audit-log-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const actionColors: Record<string, string> = {
    approve: 'bg-brand-accent/10 text-brand-accent',
    verify: 'bg-brand-accent/10 text-brand-accent',
    activate: 'bg-brand-accent/10 text-brand-accent',
    mark_paid: 'bg-brand-accent/10 text-brand-accent',
    reject: 'bg-brand-bad/10 text-brand-bad',
    suspend: 'bg-brand-bad/10 text-brand-bad',
    ban: 'bg-brand-bad/10 text-brand-bad',
    reverse: 'bg-brand-bad/10 text-brand-bad',
    create: 'bg-brand-blue/10 text-brand-blue',
    update: 'bg-brand-blue/10 text-brand-blue',
    broadcast: 'bg-brand-blue/10 text-brand-blue',
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-text">{isBn ? 'অডিট লগ' : 'Audit Log'}</h1>
        <button onClick={handleExport} className="btn-ghost flex items-center gap-2">
          <Download className="w-4 h-4" />
          {isBn ? 'CSV এক্সপোর্ট' : 'Export CSV'}
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'অ্যাডমিন' : 'Admin'}</label>
            <input
              type="text"
              value={filters.admin_id}
              onChange={(e) => setFilters({ ...filters, admin_id: e.target.value })}
              placeholder={isBn ? 'অ্যাডমিন আইডি' : 'Admin ID'}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'কার্যক্রম' : 'Action'}</label>
            <input
              type="text"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              placeholder={isBn ? 'কার্যক্রম' : 'Action'}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'টার্গেট ধরন' : 'Target Type'}</label>
            <input
              type="text"
              value={filters.target_type}
              onChange={(e) => setFilters({ ...filters, target_type: e.target.value })}
              placeholder={isBn ? 'টার্গেট ধরন' : 'Target Type'}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'থেকে' : 'From'}</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'পর্যন্ত' : 'To'}</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'অনুসন্ধান' : 'Search'}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder={isBn ? 'অনুসন্ধান...' : 'Search...'}
                className="w-full pl-10 pr-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-line">
              <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'তারিখ' : 'Date'}</th>
              <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'অ্যাডমিন' : 'Admin'}</th>
              <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'কার্যক্রম' : 'Action'}</th>
              <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'টার্গেট ধরন' : 'Target Type'}</th>
              <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'টার্গেট' : 'Target'}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-brand-line">
                <td className="py-3 px-2 text-brand-muted text-xs">{formatDate(log.created_at, lang)}</td>
                <td className="py-3 px-2 text-brand-text">{log.admin_name}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${actionColors[log.action] || 'bg-brand-muted/10 text-brand-muted'}`}>
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-2 text-brand-muted">{log.target_type || '-'}</td>
                <td className="py-3 px-2 text-brand-muted text-xs font-mono">{log.target_id?.substring(0, 8) || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-brand-muted">
            {isBn ? `${total}টি ফলাফলের মধ্যে ${filters.page} পৃষ্ঠা` : `Page ${filters.page} of ${totalPages}`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="btn-ghost text-sm disabled:opacity-50"
            >
              {isBn ? 'পেছনে' : 'Previous'}
            </button>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === totalPages}
              className="btn-ghost text-sm disabled:opacity-50"
            >
              {isBn ? 'পরবর্তী' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
