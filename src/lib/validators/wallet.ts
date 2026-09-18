import { z } from 'zod';

export const rechargeSchema = z.object({
  amount: z.number().min(5, 'Minimum recharge is ৳5'),
  mfs_method: z.enum(['bkash', 'nagad', 'rocket', 'upay']),
  trx_id: z.string().min(6, 'TrxID must be at least 6 characters').max(30, 'TrxID must be at most 30 characters').regex(/^[a-zA-Z0-9]+$/, 'TrxID must be alphanumeric'),
  sender_number: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid MFS number'),
});

export const withdrawSchema = z.object({
  amount: z.number().min(5, 'Minimum withdrawal is ৳5'),
  mfs_method: z.enum(['bkash', 'nagad', 'rocket', 'upay']),
  mfs_number: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid MFS number'),
});

export const adminApproveRechargeSchema = z.object({
  // No additional fields needed
});

export const adminRejectRechargeSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
});

export const adminApproveWithdrawalSchema = z.object({
  payout_trx_id: z.string().min(1, 'Payout TrxID is required'),
});

export const adminRejectWithdrawalSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
});

export type RechargeInput = z.infer<typeof rechargeSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
