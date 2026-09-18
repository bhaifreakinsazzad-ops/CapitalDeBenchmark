/**
 * CSV Export Utility
 * Handles UTF-8 CSV generation with proper escaping and BOM for Excel compatibility
 */

export interface ColumnDef<T> {
  key: keyof T | string;
  label: string;
  formatter?: (value: any, row: T) => string;
}

/**
 * Escape a CSV cell value
 */
function escapeCell(value: any): string {
  if (value === null || value === undefined) return '';
  
  const str = String(value);
  
  // If contains comma, quote, or newline, wrap in quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

/**
 * Generate CSV from data
 */
export function generateCSV<T>(
  data: T[],
  columns: ColumnDef<T>[],
  includeBOM = true
): string {
  // Headers
  const headers = columns.map((col) => escapeCell(col.label));
  
  // Rows
  const rows = data.map((row) => {
    return columns.map((col) => {
      let value: any;
      
      if (typeof col.key === 'string' && col.key.includes('.')) {
        // Handle nested keys like "user.name"
        value = col.key.split('.').reduce((obj, key) => obj?.[key], row as any);
      } else {
        value = (row as any)[col.key];
      }
      
      if (col.formatter) {
        value = col.formatter(value, row);
      }
      
      return escapeCell(value);
    });
  });
  
  // Combine
  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  
  // Add UTF-8 BOM for Excel compatibility with Bangla text
  return includeBOM ? '\uFEFF' + csv : csv;
}

/**
 * Download CSV as file
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Predefined column sets for common exports
 */
export const columnSets = {
  users: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'kyc_status', label: 'KYC Status' },
    { key: 'wallet_id', label: 'Wallet ID' },
    { key: 'balance', label: 'Balance', formatter: (v: number) => v.toFixed(2) },
    { key: 'created_at', label: 'Created At' },
  ],
  
  businesses: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'category', label: 'Category' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
    { key: 'share_price', label: 'Share Price', formatter: (v: number) => v.toFixed(2) },
    { key: 'total_shares', label: 'Total Shares' },
    { key: 'shares_sold', label: 'Shares Sold' },
    { key: 'trust_score', label: 'Trust Score' },
    { key: 'created_at', label: 'Created At' },
  ],
  
  investments: [
    { key: 'id', label: 'ID' },
    { key: 'user_id', label: 'User ID' },
    { key: 'business_id', label: 'Business ID' },
    { key: 'shares', label: 'Shares' },
    { key: 'price_per_share', label: 'Price/Share', formatter: (v: number) => v.toFixed(2) },
    { key: 'total_amount', label: 'Total Amount', formatter: (v: number) => v.toFixed(2) },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created At' },
  ],
  
  trades: [
    { key: 'id', label: 'ID' },
    { key: 'business_id', label: 'Business ID' },
    { key: 'buyer_id', label: 'Buyer ID' },
    { key: 'seller_id', label: 'Seller ID' },
    { key: 'shares', label: 'Shares' },
    { key: 'price', label: 'Price', formatter: (v: number) => v.toFixed(2) },
    { key: 'is_buyback', label: 'Buyback' },
    { key: 'executed_at', label: 'Executed At' },
  ],
  
  walletTxns: [
    { key: 'id', label: 'ID' },
    { key: 'user_id', label: 'User ID' },
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount', formatter: (v: number) => v.toFixed(2) },
    { key: 'balance_after', label: 'Balance After', formatter: (v: number) => v.toFixed(2) },
    { key: 'method', label: 'Method' },
    { key: 'trx_id', label: 'Trx ID' },
    { key: 'hash', label: 'Hash' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created At' },
  ],
  
  orders: [
    { key: 'id', label: 'ID' },
    { key: 'user_id', label: 'User ID' },
    { key: 'business_id', label: 'Business ID' },
    { key: 'type', label: 'Type' },
    { key: 'shares', label: 'Shares' },
    { key: 'price', label: 'Price', formatter: (v: number) => v.toFixed(2) },
    { key: 'filled_shares', label: 'Filled Shares' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created At' },
  ],
  
  auditLog: [
    { key: 'id', label: 'ID' },
    { key: 'admin_name', label: 'Admin' },
    { key: 'action', label: 'Action' },
    { key: 'target_type', label: 'Target Type' },
    { key: 'target_id', label: 'Target ID' },
    { key: 'meta', label: 'Meta', formatter: (v: any) => JSON.stringify(v) },
    { key: 'created_at', label: 'Created At' },
  ],
};
