import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuditLogEntry {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  target_type?: string;
  target_id?: string;
  meta?: Record<string, any>;
  created_at: string;
}

interface AuditStore {
  logs: AuditLogEntry[];
  
  // Add log entry
  log: (adminId: string, adminName: string, action: string, target_type?: string, target_id?: string, meta?: Record<string, any>) => void;
  
  // Query logs
  getLogs: (filters?: {
    admin_id?: string;
    action?: string;
    target_type?: string;
    from?: string;
    to?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => { logs: AuditLogEntry[]; total: number };
  
  // Export to CSV
  exportToCSV: (filters?: any) => string;
}

export const useAuditStore = create<AuditStore>()(
  persist(
    (set, get) => ({
      logs: [],
      
      log: (adminId, adminName, action, target_type, target_id, meta) => {
        const entry: AuditLogEntry = {
          id: crypto.randomUUID(),
          admin_id: adminId,
          admin_name: adminName,
          action,
          target_type,
          target_id,
          meta,
          created_at: new Date().toISOString(),
        };
        
        set((state) => ({ logs: [entry, ...state.logs] }));
      },
      
      getLogs: (filters = {}) => {
        let filtered = [...get().logs];
        
        if (filters.admin_id) {
          filtered = filtered.filter((l) => l.admin_id === filters.admin_id);
        }
        
        if (filters.action) {
          filtered = filtered.filter((l) => l.action === filters.action);
        }
        
        if (filters.target_type) {
          filtered = filtered.filter((l) => l.target_type === filters.target_type);
        }
        
        if (filters.from) {
          filtered = filtered.filter((l) => new Date(l.created_at) >= new Date(filters.from!));
        }
        
        if (filters.to) {
          filtered = filtered.filter((l) => new Date(l.created_at) <= new Date(filters.to!));
        }
        
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter((l) => 
            l.target_id?.toLowerCase().includes(search) ||
            l.action.toLowerCase().includes(search) ||
            JSON.stringify(l.meta).toLowerCase().includes(search)
          );
        }
        
        const total = filtered.length;
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const start = (page - 1) * limit;
        
        return {
          logs: filtered.slice(start, start + limit),
          total,
        };
      },
      
      exportToCSV: (filters) => {
        const { logs } = get().getLogs({ ...filters, limit: 500000 });
        
        const headers = ['Date', 'Admin', 'Action', 'Target Type', 'Target ID', 'Meta'];
        const rows = logs.map((log) => [
          log.created_at,
          log.admin_name,
          log.action,
          log.target_type || '',
          log.target_id || '',
          JSON.stringify(log.meta || {}),
        ]);
        
        const csv = [headers, ...rows]
          .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
          .join('\n');
        
        // Add UTF-8 BOM for Excel compatibility
        return '\uFEFF' + csv;
      },
    }),
    { name: 'capitaldb-audit' }
  )
);
