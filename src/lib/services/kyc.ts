import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from '../../store';
import { notify, NOTIFICATION_TYPES } from './notify';
import { generateId } from '../utils';

export interface KycSubmission {
  id: string;
  user_id: string;
  nid_number: string;
  full_name: string;
  present_address: string;
  whatsapp_number: string;
  nid_front_url: string;
  nid_back_url: string;
  utility_bill_url: string;
  selfie_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
}

interface KycStore {
  submissions: KycSubmission[];
  
  submitKyc: (data: {
    nid_number: string;
    full_name: string;
    present_address: string;
    whatsapp_number: string;
    nid_front: File;
    nid_back: File;
    utility_bill: File;
    selfie?: File;
  }) => { success: boolean; error?: string; submission_id?: string };
  
  getUserSubmissions: (userId: string) => KycSubmission[];
  getLatestSubmission: (userId: string) => KycSubmission | undefined;
  
  approveKyc: (submissionId: string, adminId: string) => { success: boolean; error?: string };
  rejectKyc: (submissionId: string, adminId: string, reason: string) => { success: boolean; error?: string };
  
  checkRateLimit: (userId: string) => boolean;
}

export const useKycStore = create<KycStore>()(
  persist(
    (set, get) => ({
      submissions: [],

      checkRateLimit: (userId) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const count = get().submissions.filter(
          (s) => s.user_id === userId && new Date(s.created_at) >= today
        ).length;
        return count < 3; // Max 3 per day
      },

      submitKyc: (data) => {
        const { user, updateUser } = useAuthStore.getState();
        if (!user) return { success: false, error: 'Not authenticated' };

        // Check rate limit
        if (!get().checkRateLimit(user.id)) {
          return { success: false, error: 'Too many KYC submissions today. Please try again tomorrow.' };
        }

        // Simulate file upload (in real app, upload to Supabase Storage)
        const nidFrontUrl = `kyc/${user.id}/${generateId()}_nid_front.jpg`;
        const nidBackUrl = `kyc/${user.id}/${generateId()}_nid_back.jpg`;
        const utilityBillUrl = `kyc/${user.id}/${generateId()}_utility_bill.jpg`;
        const selfieUrl = data.selfie ? `kyc/${user.id}/${generateId()}_selfie.jpg` : undefined;

        const submission: KycSubmission = {
          id: generateId(),
          user_id: user.id,
          nid_number: data.nid_number,
          full_name: data.full_name,
          present_address: data.present_address,
          whatsapp_number: data.whatsapp_number,
          nid_front_url: nidFrontUrl,
          nid_back_url: nidBackUrl,
          utility_bill_url: utilityBillUrl,
          selfie_url: selfieUrl,
          status: 'pending',
          created_at: new Date().toISOString(),
        };

        // Update user KYC status
        updateUser({
          kyc_status: 'pending',
          nid_number: data.nid_number,
          present_address: data.present_address,
          whatsapp_number: data.whatsapp_number,
        });

        set((state) => ({
          submissions: [submission, ...state.submissions],
        }));

        notify(user.id, NOTIFICATION_TYPES.KYC_SUBMITTED, {});

        return { success: true, submission_id: submission.id };
      },

      getUserSubmissions: (userId) => {
        return get().submissions
          .filter((s) => s.user_id === userId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },

      getLatestSubmission: (userId) => {
        return get().submissions
          .filter((s) => s.user_id === userId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      },

      approveKyc: (submissionId, adminId) => {
        const submission = get().submissions.find((s) => s.id === submissionId);
        if (!submission) return { success: false, error: 'Submission not found' };
        if (submission.status !== 'pending') return { success: false, error: 'Submission already processed' };

        const { updateUser } = useAuthStore.getState();

        // Update user KYC status
        updateUser({
          kyc_status: 'verified',
        });

        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === submissionId
              ? { ...s, status: 'approved', reviewed_by: adminId, reviewed_at: new Date().toISOString() }
              : s
          ),
        }));

        notify(submission.user_id, NOTIFICATION_TYPES.KYC_APPROVED, {});

        return { success: true };
      },

      rejectKyc: (submissionId, adminId, reason) => {
        const submission = get().submissions.find((s) => s.id === submissionId);
        if (!submission) return { success: false, error: 'Submission not found' };
        if (submission.status !== 'pending') return { success: false, error: 'Submission already processed' };

        const { updateUser } = useAuthStore.getState();

        // Update user KYC status
        updateUser({
          kyc_status: 'rejected',
        });

        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === submissionId
              ? { ...s, status: 'rejected', reviewed_by: adminId, reviewed_at: new Date().toISOString(), rejection_reason: reason }
              : s
          ),
        }));

        notify(submission.user_id, NOTIFICATION_TYPES.KYC_REJECTED, { reason });

        return { success: true };
      },
    }),
    { name: 'capitaldb-kyc' }
  )
);
