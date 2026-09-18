import { z } from 'zod';

export const kycSchema = z.object({
  nid_number: z.string()
    .min(10, 'NID must be at least 10 digits')
    .max(17, 'NID must be at most 17 digits')
    .regex(/^\d+$/, 'NID must contain only digits'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  present_address: z.string().min(10, 'Address must be at least 10 characters').max(500, 'Address must be at most 500 characters'),
  whatsapp_number: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid WhatsApp number'),
  nid_front: z.any().refine((file) => file instanceof File, 'NID front is required'),
  nid_back: z.any().refine((file) => file instanceof File, 'NID back is required'),
  utility_bill: z.any().refine((file) => file instanceof File, 'Utility bill is required'),
  selfie: z.any().optional(),
});

export const adminRejectKycSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
});

export type KycInput = z.infer<typeof kycSchema>;
