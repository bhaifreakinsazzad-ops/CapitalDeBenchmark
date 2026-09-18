import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore, useDemoStore } from '../../store';
import { useWalletStore } from './wallet';
import { useBusinessStore } from './business';
import { notify } from './notify';
import { generateId } from '../utils';

function generateReceiptCode(): string {
  return `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

function generateTxnHash(): string {
  return `0x${Math.random().toString(16).substr(2, 64)}`;
}

export interface Order {
  id: string;
  user_id: string;
  business_id: string;
  type: 'buy' | 'sell' | 'buyback';
  shares: number;
  price: number;
  status: 'open' | 'partially_filled' | 'filled' | 'cancelled';
  filled_shares: number;
  filled_amount: number;
  avg_fill_price?: number;
  order_kind: 'limit' | 'market';
  is_market_maker: boolean;
  business_owner_id?: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  cancelled_by?: string;
}

export interface Trade {
  id: string;
  business_id: string;
  buyer_id: string;
  seller_id: string;
  shares: number;
  price: number;
  buy_order_id: string;
  sell_order_id: string;
  buyer_receipt_id?: string;
  trade_hash: string;
  is_buyback: boolean;
  executed_at: string;
  reversed_at?: string;
  reversed_by?: string;
  reversal_reason?: string;
}

export interface Receipt {
  id: string;
  receipt_code: string;
  user_id: string;
  business_id: string;
  shares: number;
  price: number;
  status: 'active' | 'transferred' | 'redeemed' | 'refunded' | 'split';
  source: 'primary' | 'secondary' | 'buyback';
  parent_receipt_id?: string;
  transferred_at?: string;
  transferred_to?: string;
  transferred_from?: string;
  issued_at: string;
}

export interface ReceiptTransfer {
  id: string;
  receipt_id: string;
  from_user_id: string;
  to_user_id: string;
  business_id: string;
  shares: number;
  price_per_share: number;
  trade_id: string;
  hash: string;
  created_at: string;
  reversed_at?: string;
}

interface TradingStore {
  orders: Order[];
  trades: Trade[];
  receipts: Receipt[];
  receiptTransfers: ReceiptTransfer[];

  // Order placement
  placeOrder: (data: {
    business_id: string;
    type: 'buy' | 'sell' | 'buyback';
    shares: number;
    price: number;
    order_kind?: 'limit' | 'market';
  }) => { success: boolean; error?: string; order_id?: string };

  // Order cancellation
  cancelOrder: (orderId: string, actorId: string) => { success: boolean; error?: string };

  // Order matching
  matchOrders: (businessId: string) => number;

  // Trade execution
  executeTrade: (buyOrderId: string, sellOrderId: string, qty: number, price: number, isBuyback: boolean) => string;

  // Queries
  getUserOrders: (userId: string, status?: string) => Order[];
  getBusinessOrders: (businessId: string) => { buys: Order[]; sells: Order[] };
  getBusinessTrades: (businessId: string, limit?: number) => Trade[];
  getUserTrades: (userId: string) => Trade[];
  getUserReceipts: (userId: string) => Receipt[];

  // Volume tracking
  refreshVolume24h: (businessId: string) => void;

  // Rate limiting
  checkRateLimit: (userId: string, action: string, maxCount: number, windowHours: number) => boolean;
  recordRateLimit: (userId: string, action: string) => void;
}

export const useTradingStore = create<TradingStore>()(
  persist(
    (set, get) => ({
      orders: [],
      trades: [],
      receipts: [],
      receiptTransfers: [],

      checkRateLimit: (userId, action, maxCount, windowHours) => {
        const cutoff = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();
        const count = get().orders.filter(
          (o) => o.user_id === userId && o.created_at > cutoff
        ).length;
        return count < maxCount;
      },

      recordRateLimit: (userId, action) => {
        // Rate limits tracked via orders table
      },

      placeOrder: (data) => {
        const { user } = useAuthStore.getState();
        if (!user) return { success: false, error: 'Not authenticated' };

        // Rate limit check
        if (!get().checkRateLimit(user.id, 'order', 30, 1)) {
          return { success: false, error: 'Rate limit exceeded (30 orders/hour)' };
        }

        const { businesses } = useBusinessStore.getState();
        const business = businesses.find(b => b.id === data.business_id);
        if (!business) return { success: false, error: 'Business not found' };
        if (business.status !== 'active') return { success: false, error: 'Business not active for trading' };

        if (data.shares <= 0) return { success: false, error: 'Shares must be positive' };
        if (data.price < 1) return { success: false, error: 'Price must be at least ৳1' };

        const escrow = data.shares * data.price;

        // Escrow based on order type
        if (data.type === 'buy') {
          if (user.balance < escrow) {
            return { success: false, error: 'Insufficient wallet balance' };
          }
          // Debit wallet
          useWalletStore.setState((state) => ({
            walletTxns: [{
              id: generateId(),
              user_id: user.id,
              type: 'trade_buy',
              amount: -escrow,
              balance_after: user.balance - escrow,
              hash: generateTxnHash(),
              status: 'completed',
              note: `Escrow for buy order: ${data.shares} shares @ ৳${data.price}`,
              created_at: new Date().toISOString(),
            }, ...state.walletTxns],
          }));
          useAuthStore.getState().updateUser({ balance: user.balance - escrow });
        } else if (data.type === 'sell') {
          // Check holdings
          const holdings = useBusinessStore.getState().holdings?.find(
            h => h.user_id === user.id && h.business_id === data.business_id
          );
          if (!holdings || holdings.shares < data.shares) {
            return { success: false, error: 'Insufficient shares' };
          }
          // Deduct shares from holdings
          useBusinessStore.setState((state) => ({
            holdings: state.holdings.map(h =>
              h.user_id === user.id && h.business_id === data.business_id
                ? { ...h, shares: h.shares - data.shares }
                : h
            ).filter(h => h.shares > 0),
          }));
        } else if (data.type === 'buyback') {
          // Buyback requires ownership
          if (business.owner_id !== user.id) {
            return { success: false, error: 'Only business owner can place buyback orders' };
          }
          if (business.founder_balance < escrow) {
            return { success: false, error: 'Insufficient founder balance' };
          }
          // Deduct from founder_balance
          useBusinessStore.setState((state) => ({
            businesses: state.businesses.map(b =>
              b.id === data.business_id
                ? { ...b, founder_balance: b.founder_balance - escrow }
                : b
            ),
          }));
        }

        const orderId = generateId();
        const order: Order = {
          id: orderId,
          user_id: user.id,
          business_id: data.business_id,
          type: data.type,
          shares: data.shares,
          price: data.price,
          status: 'open',
          filled_shares: 0,
          filled_amount: 0,
          order_kind: data.order_kind || 'limit',
          is_market_maker: false,
          business_owner_id: data.type === 'buyback' ? user.id : undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set((state) => ({
          orders: [order, ...state.orders],
        }));

        // Notify
        notify(user.id, 'order_placed', {
          order_id: orderId,
          type: data.type,
          shares: data.shares,
          price: data.price,
          business_name: business.name,
        });

        // Match orders
        get().matchOrders(data.business_id);

        return { success: true, order_id: orderId };
      },

      cancelOrder: (orderId, actorId) => {
        const order = get().orders.find(o => o.id === orderId);
        if (!order) return { success: false, error: 'Order not found' };
        if (!['open', 'partially_filled'].includes(order.status)) {
          return { success: false, error: 'Order not cancelable' };
        }

        const { user } = useAuthStore.getState();
        const isOwner = order.user_id === actorId;
        const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
        if (!isOwner && !isAdmin) {
          return { success: false, error: 'Not authorized to cancel' };
        }

        const remaining = order.shares - order.filled_shares;
        const refund = remaining * order.price;

        // Refund based on order type
        if (order.type === 'buy') {
          // Refund wallet
          useWalletStore.setState((state) => ({
            walletTxns: [{
              id: generateId(),
              user_id: order.user_id,
              type: 'refund',
              amount: refund,
              balance_after: (useAuthStore.getState().user?.balance || 0) + refund,
              hash: generateTxnHash(),
              status: 'completed',
              note: 'Refund for cancelled buy order',
              created_at: new Date().toISOString(),
            }, ...state.walletTxns],
          }));
          const currentUser = useAuthStore.getState().user;
          if (currentUser && currentUser.id === order.user_id) {
            useAuthStore.getState().updateUser({ balance: currentUser.balance + refund });
          }
        } else if (order.type === 'buyback') {
          // Refund founder_balance
          useBusinessStore.setState((state) => ({
            businesses: state.businesses.map(b =>
              b.id === order.business_id
                ? { ...b, founder_balance: b.founder_balance + refund }
                : b
            ),
          }));
        } else if (order.type === 'sell') {
          // Return shares to holdings
          useBusinessStore.setState((state) => {
            const existingHolding = state.holdings?.find(
              h => h.user_id === order.user_id && h.business_id === order.business_id
            );
            if (existingHolding) {
              return {
                holdings: state.holdings.map(h =>
                  h.user_id === order.user_id && h.business_id === order.business_id
                    ? { ...h, shares: h.shares + remaining }
                    : h
                ),
              };
            } else {
              return {
                holdings: [...(state.holdings || []), {
                  id: generateId(),
                  user_id: order.user_id,
                  business_id: order.business_id,
                  shares: remaining,
                  avg_buy_price: 0,
                  updated_at: new Date().toISOString(),
                }],
              };
            }
          });
        }

        set((state) => ({
          orders: state.orders.map(o =>
            o.id === orderId
              ? { ...o, status: 'cancelled', cancelled_at: new Date().toISOString(), cancelled_by: actorId, updated_at: new Date().toISOString() }
              : o
          ),
        }));

        notify(order.user_id, 'order_cancelled', {
          order_id: orderId,
          type: order.type,
          shares: remaining,
          refund,
        });

        return { success: true };
      },

      matchOrders: (businessId) => {
        let tradeCount = 0;

        while (true) {
          // Find best buy order (highest price, earliest time)
          const bestBuy = get().orders
            .filter(o =>
              o.business_id === businessId &&
              ['buy', 'buyback'].includes(o.type) &&
              ['open', 'partially_filled'].includes(o.status) &&
              (o.shares - o.filled_shares) > 0
            )
            .sort((a, b) => b.price - a.price || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];

          // Find best sell order (lowest price, earliest time)
          const bestSell = get().orders
            .filter(o =>
              o.business_id === businessId &&
              o.type === 'sell' &&
              ['open', 'partially_filled'].includes(o.status) &&
              (o.shares - o.filled_shares) > 0
            )
            .sort((a, b) => a.price - b.price || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];

          if (!bestBuy || !bestSell) break;
          if (bestBuy.price < bestSell.price) break;
          if (bestBuy.user_id === bestSell.user_id) break; // Self-trade prevention

          const qty = Math.min(
            bestBuy.shares - bestBuy.filled_shares,
            bestSell.shares - bestSell.filled_shares
          );

          // Trade price = price of earlier order
          const price = new Date(bestBuy.created_at) <= new Date(bestSell.created_at)
            ? bestBuy.price
            : bestSell.price;

          const isBuyback = bestBuy.type === 'buyback';

          get().executeTrade(bestBuy.id, bestSell.id, qty, price, isBuyback);
          tradeCount++;
        }

        return tradeCount;
      },

      executeTrade: (buyOrderId, sellOrderId, qty, price, isBuyback) => {
        const buyOrder = get().orders.find(o => o.id === buyOrderId);
        const sellOrder = get().orders.find(o => o.id === sellOrderId);
        if (!buyOrder || !sellOrder) throw new Error('Order not found');

        const businessId = sellOrder.business_id;
        const proceeds = qty * price;

        // Credit seller wallet
        const sellerUser = useDemoStore.getState().users.find(u => u.id === sellOrder.user_id);
        if (sellerUser) {
          useWalletStore.setState((state) => ({
            walletTxns: [{
              id: generateId(),
              user_id: sellOrder.user_id,
              type: 'trade_sell',
              amount: proceeds,
              balance_after: sellerUser.balance + proceeds,
              hash: generateTxnHash(),
              status: 'completed',
              note: `Sold ${qty} shares @ ৳${price}`,
              created_at: new Date().toISOString(),
            }, ...state.walletTxns],
          }));
          useDemoStore.setState((state) => ({
            users: state.users.map(u =>
              u.id === sellOrder.user_id ? { ...u, balance: u.balance + proceeds } : u
            ),
          }));
        }

        let buyerReceiptId: string | undefined;

        if (!isBuyback) {
          // Update buyer holdings
          useBusinessStore.setState((state) => {
            const existingHolding = state.holdings?.find(
              h => h.user_id === buyOrder.user_id && h.business_id === businessId
            );
            if (existingHolding) {
              const newAvg = ((existingHolding.shares * existingHolding.avg_buy_price) + (qty * price)) / (existingHolding.shares + qty);
              return {
                holdings: state.holdings.map(h =>
                  h.user_id === buyOrder.user_id && h.business_id === businessId
                    ? { ...h, shares: h.shares + qty, avg_buy_price: newAvg, updated_at: new Date().toISOString() }
                    : h
                ),
              };
            } else {
              return {
                holdings: [...(state.holdings || []), {
                  id: generateId(),
                  user_id: buyOrder.user_id,
                  business_id: businessId,
                  shares: qty,
                  avg_buy_price: price,
                  updated_at: new Date().toISOString(),
                }],
              };
            }
          });

          // Issue buyer receipt
          buyerReceiptId = generateId();
          const newReceipt: Receipt = {
            id: buyerReceiptId!,
            receipt_code: generateReceiptCode(),
            user_id: buyOrder.user_id,
            business_id: businessId,
            shares: qty,
            price,
            status: 'active',
            source: 'secondary',
            issued_at: new Date().toISOString(),
          };
          set((state) => ({
            receipts: [newReceipt, ...state.receipts],
          }));
        } else {
          // Buyback: increment treasury_shares
          useBusinessStore.setState((state) => ({
            businesses: state.businesses.map(b =>
              b.id === businessId
                ? { ...b, treasury_shares: b.treasury_shares + qty }
                : b
            ),
          }));
        }

        // Consume seller's receipts (FIFO)
        const sellerReceipts = get().receipts
          .filter(r => r.user_id === sellOrder.user_id && r.business_id === businessId && r.status === 'active')
          .sort((a, b) => new Date(a.issued_at).getTime() - new Date(b.issued_at).getTime());

        let sharesNeeded = qty;
        for (const receipt of sellerReceipts) {
          if (sharesNeeded <= 0) break;

          const sharesFromThis = Math.min(sharesNeeded, receipt.shares);

          if (receipt.shares === sharesFromThis) {
            // Full consumption
            set((state) => ({
              receipts: state.receipts.map(r =>
                r.id === receipt.id
                  ? { ...r, status: 'transferred', transferred_at: new Date().toISOString(), transferred_to: buyOrder.user_id, transferred_from: sellOrder.user_id }
                  : r
              ),
            }));
          } else {
            // Split receipt
            const remainingShares = receipt.shares - sharesFromThis;
            set((state) => ({
              receipts: [
                ...state.receipts.map(r =>
                  r.id === receipt.id ? { ...r, status: 'split' as const, transferred_at: new Date().toISOString() } : r
                ),
                // New receipt for buyer (consumed portion)
                {
                  id: generateId(),
                  receipt_code: generateReceiptCode(),
                  user_id: buyOrder.user_id,
                  business_id: businessId,
                  shares: sharesFromThis,
                  price,
                  status: 'active',
                  source: 'secondary',
                  parent_receipt_id: receipt.id,
                  transferred_from: sellOrder.user_id,
                  issued_at: new Date().toISOString(),
                },
                // New receipt for seller (remaining portion)
                {
                  id: generateId(),
                  receipt_code: generateReceiptCode(),
                  user_id: sellOrder.user_id,
                  business_id: businessId,
                  shares: remainingShares,
                  price: receipt.price,
                  status: 'active',
                  source: 'secondary',
                  parent_receipt_id: receipt.id,
                  issued_at: new Date().toISOString(),
                },
              ],
            }));
          }

          // Log receipt transfer
          set((state) => ({
            receiptTransfers: [{
              id: generateId(),
              receipt_id: receipt.id,
              from_user_id: sellOrder.user_id,
              to_user_id: buyOrder.user_id,
              business_id: businessId,
              shares: sharesFromThis,
              price_per_share: price,
              trade_id: '', // Will be set after trade creation
              hash: generateTxnHash(),
              created_at: new Date().toISOString(),
            }, ...state.receiptTransfers],
          }));

          sharesNeeded -= sharesFromThis;
        }

        // Create trade record
        const tradeId = generateId();
        const trade: Trade = {
          id: tradeId,
          business_id: businessId,
          buyer_id: buyOrder.user_id,
          seller_id: sellOrder.user_id,
          shares: qty,
          price,
          buy_order_id: buyOrderId,
          sell_order_id: sellOrderId,
          buyer_receipt_id: buyerReceiptId,
          trade_hash: generateTxnHash(),
          is_buyback: isBuyback,
          executed_at: new Date().toISOString(),
        };

        set((state) => ({
          trades: [trade, ...state.trades],
        }));

        // Update orders
        set((state) => ({
          orders: state.orders.map(o => {
            if (o.id === buyOrderId || o.id === sellOrderId) {
              const newFilledShares = o.filled_shares + qty;
              const newFilledAmount = o.filled_amount + (qty * price);
              const newAvgFillPrice = newFilledAmount / newFilledShares;
              const newStatus = newFilledShares >= o.shares ? 'filled' : 'partially_filled';
              return {
                ...o,
                filled_shares: newFilledShares,
                filled_amount: newFilledAmount,
                avg_fill_price: newAvgFillPrice,
                status: newStatus,
                updated_at: new Date().toISOString(),
              };
            }
            return o;
          }),
        }));

        // Update business stats
        useBusinessStore.setState((state) => ({
          businesses: state.businesses.map(b =>
            b.id === businessId
              ? {
                  ...b,
                  current_price: price,
                  last_trade_at: new Date().toISOString(),
                  trades_count: b.trades_count + 1,
                  updated_at: new Date().toISOString(),
                }
              : b
          ),
        }));

        // Notify parties
        const { businesses } = useBusinessStore.getState();
        const business = businesses.find(b => b.id === businessId);
        if (business) {
          notify(buyOrder.user_id, 'order_filled', {
            order_id: buyOrderId,
            type: buyOrder.type,
            shares: qty,
            price,
            business_name: business.name,
          });
          notify(sellOrder.user_id, 'order_filled', {
            order_id: sellOrderId,
            type: sellOrder.type,
            shares: qty,
            price,
            business_name: business.name,
          });
        }

        return tradeId;
      },

      getUserOrders: (userId, status) => {
        let orders = get().orders.filter(o => o.user_id === userId);
        if (status) orders = orders.filter(o => o.status === status);
        return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },

      getBusinessOrders: (businessId) => {
        const orders = get().orders.filter(o =>
          o.business_id === businessId &&
          ['open', 'partially_filled'].includes(o.status)
        );
        const buys = orders
          .filter(o => ['buy', 'buyback'].includes(o.type))
          .sort((a, b) => b.price - a.price || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .slice(0, 5);
        const sells = orders
          .filter(o => o.type === 'sell')
          .sort((a, b) => a.price - b.price || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .slice(0, 5);
        return { buys, sells };
      },

      getBusinessTrades: (businessId, limit = 20) => {
        return get().trades
          .filter(t => t.business_id === businessId)
          .sort((a, b) => new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime())
          .slice(0, limit);
      },

      getUserTrades: (userId) => {
        return get().trades
          .filter(t => t.buyer_id === userId || t.seller_id === userId)
          .sort((a, b) => new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime());
      },

      getUserReceipts: (userId) => {
        return get().receipts
          .filter(r => r.user_id === userId)
          .sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime());
      },

      refreshVolume24h: (businessId) => {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const volume = get().trades
          .filter(t => t.business_id === businessId && t.executed_at > cutoff)
          .reduce((sum, t) => sum + t.shares, 0);

        useBusinessStore.setState((state) => ({
          businesses: state.businesses.map(b =>
            b.id === businessId ? { ...b, volume_24h: volume } : b
          ),
        }));
      },
    }),
    { name: 'capitaldb-trading' }
  )
);
