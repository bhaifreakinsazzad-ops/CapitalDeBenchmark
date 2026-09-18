import { useState } from 'react';
import { Flag, MessageSquare, Megaphone, Eye, Trash2, Shield, Ban, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store';
import { useSocialStore } from '../lib/services/social';
import { formatDate } from '../lib/utils';

// ================================================================
// ADMIN REPORTS PAGE
// ================================================================

export function AdminReportsPage() {
  const { user, lang } = useAuthStore();
  const { contentReports, reviewReport, comments, announcements } = useSocialStore();
  const isBn = lang === 'bn';
  const [filter, setFilter] = useState<'pending' | 'reviewed' | 'dismissed' | 'actioned' | 'all'>('pending');
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [action, setAction] = useState<'dismissed' | 'actioned'>('dismissed');
  const [note, setNote] = useState('');

  const filteredReports = filter === 'all' ? contentReports : contentReports.filter(r => r.status === filter);

  const handleReview = (reportId: string) => {
    if (!user) return;
    reviewReport(reportId, user.id, action, note);
    setReviewModal(null);
    setNote('');
  };

  const getTargetPreview = (report: any) => {
    if (report.target_type === 'comment') {
      const comment = comments.find(c => c.id === report.target_id);
      return comment ? comment.body.substring(0, 50) : 'Comment not found';
    }
    return `${report.target_type} #${report.target_id.substring(0, 8)}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'কন্টেন্ট রিপোর্ট' : 'Content Reports'}</h1>

      <div className="flex gap-2 mb-4">
        {(['pending', 'reviewed', 'dismissed', 'actioned', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
            }`}
          >
            {f === 'pending' ? (isBn ? 'অপেক্ষমান' : 'Pending') :
             f === 'reviewed' ? (isBn ? 'পর্যালোচিত' : 'Reviewed') :
             f === 'dismissed' ? (isBn ? 'খারিজ' : 'Dismissed') :
             f === 'actioned' ? (isBn ? 'ব্যবস্থা' : 'Actioned') :
             (isBn ? 'সব' : 'All')}
          </button>
        ))}
      </div>

      {filteredReports.length === 0 ? (
        <div className="card text-center py-12">
          <Flag className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো রিপোর্ট নেই' : 'No reports'}</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line">
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'তারিখ' : 'Date'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'ধরন' : 'Type'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'কন্টেন্ট' : 'Content'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'কারণ' : 'Reason'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="text-left py-3 px-2 text-brand-muted font-medium">{isBn ? 'কার্যক্রম' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-brand-line">
                  <td className="py-3 px-2 text-brand-muted text-xs">{formatDate(report.created_at, lang)}</td>
                  <td className="py-3 px-2 text-brand-text capitalize">{report.target_type}</td>
                  <td className="py-3 px-2 text-brand-muted text-xs">{getTargetPreview(report)}</td>
                  <td className="py-3 px-2 text-brand-text capitalize">{report.reason}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      report.status === 'pending' ? 'bg-brand-warn/10 text-brand-warn' :
                      report.status === 'reviewed' ? 'bg-brand-blue/10 text-brand-blue' :
                      report.status === 'actioned' ? 'bg-brand-accent/10 text-brand-accent' :
                      'bg-brand-muted/10 text-brand-muted'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {report.status === 'pending' && (
                      <button
                        onClick={() => setReviewModal(report.id)}
                        className="px-3 py-1.5 rounded-lg bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 transition-colors text-xs font-medium"
                      >
                        {isBn ? 'পর্যালোচনা' : 'Review'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h2 className="text-lg font-bold text-brand-text mb-4">{isBn ? 'রিপোর্ট পর্যালোচনা' : 'Review Report'}</h2>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'সিদ্ধান্ত' : 'Decision'}</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as any)}
                  className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
                >
                  <option value="dismissed">{isBn ? 'খারিজ' : 'Dismiss'}</option>
                  <option value="actioned">{isBn ? 'ব্যবস্থা নেওয়া হয়েছে' : 'Actioned'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'নোট' : 'Note'}</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={isBn ? 'ঐচ্ছিক নোট...' : 'Optional note...'}
                  rows={3}
                  className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setReviewModal(null)} className="btn-ghost flex-1">
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button onClick={() => handleReview(reviewModal)} className="btn-primary flex-1">
                {isBn ? 'জমা দিন' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================================================
// ADMIN COMMENTS MODERATION PAGE
// ================================================================

export function AdminCommentsPage() {
  const { user, lang } = useAuthStore();
  const { comments, hideComment, unhideComment, deleteComment } = useSocialStore();
  const isBn = lang === 'bn';
  const [filter, setFilter] = useState<'all' | 'approved' | 'hidden'>('all');

  const filteredComments = filter === 'all' ? comments : comments.filter(c => c.status === filter);

  const handleHide = (commentId: string) => {
    if (!user) return;
    const reason = prompt(isBn ? 'লুকানোর কারণ?' : 'Reason for hiding?');
    if (reason) hideComment(commentId, user.id, reason);
  };

  const handleUnhide = (commentId: string) => {
    if (!user) return;
    unhideComment(commentId, user.id);
  };

  const handleDelete = (commentId: string) => {
    if (!user) return;
    if (confirm(isBn ? 'এই মন্তব্য মুছে ফেলতে চান?' : 'Delete this comment?')) {
      deleteComment(commentId, user.id, true);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-brand-text mb-4">{isBn ? 'মন্তব্য মডারেশন' : 'Comment Moderation'}</h1>

      <div className="flex gap-2 mb-4">
        {(['all', 'approved', 'hidden'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-brand-accent text-brand-bg' : 'bg-brand-panel2 text-brand-muted hover:text-brand-text'
            }`}
          >
            {f === 'all' ? (isBn ? 'সব' : 'All') :
             f === 'approved' ? (isBn ? 'অনুমোদিত' : 'Approved') :
             (isBn ? 'লুকানো' : 'Hidden')}
          </button>
        ))}
      </div>

      {filteredComments.length === 0 ? (
        <div className="card text-center py-12">
          <MessageSquare className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো মন্তব্য নেই' : 'No comments'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-brand-muted">{formatDate(comment.created_at, lang)}</p>
                  <p className="text-sm text-brand-text mt-1">{comment.body}</p>
                  {comment.hide_reason && (
                    <p className="text-xs text-brand-bad mt-1">Hidden: {comment.hide_reason}</p>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  comment.status === 'approved' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-brand-bad/10 text-brand-bad'
                }`}>
                  {comment.status}
                </span>
              </div>
              <div className="flex gap-2">
                {comment.status === 'approved' ? (
                  <button
                    onClick={() => handleHide(comment.id)}
                    className="px-3 py-1.5 rounded-lg bg-brand-warn/10 text-brand-warn hover:bg-brand-warn/20 transition-colors text-xs font-medium"
                  >
                    {isBn ? 'লুকান' : 'Hide'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnhide(comment.id)}
                    className="px-3 py-1.5 rounded-lg bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 transition-colors text-xs font-medium"
                  >
                    {isBn ? 'প্রদর্শন' : 'Unhide'}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="px-3 py-1.5 rounded-lg bg-brand-bad/10 text-brand-bad hover:bg-brand-bad/20 transition-colors text-xs font-medium"
                >
                  {isBn ? 'মুছুন' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ================================================================
// ADMIN ANNOUNCEMENTS PAGE
// ================================================================

export function AdminAnnouncementsPage() {
  const { user, lang } = useAuthStore();
  const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useSocialStore();
  const isBn = lang === 'bn';
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [variant, setVariant] = useState<'info' | 'warning' | 'success' | 'critical'>('info');
  const [dismissible, setDismissible] = useState(true);

  const handleCreate = () => {
    if (!user || !title.trim() || !body.trim()) return;
    const result = createAnnouncement(title, body, variant, dismissible, user.id);
    if (result.success) {
      setTitle('');
      setBody('');
      setVariant('info');
      setDismissible(true);
      setShowCreate(false);
    }
  };

  const handleToggle = (id: string, active: boolean) => {
    updateAnnouncement(id, { active });
  };

  const handleDelete = (id: string) => {
    if (confirm(isBn ? 'এই ঘোষণা মুছে ফেলতে চান?' : 'Delete this announcement?')) {
      deleteAnnouncement(id);
    }
  };

  const variantColors = {
    info: 'bg-brand-blue/10 text-brand-blue border-brand-blue/30',
    warning: 'bg-brand-warn/10 text-brand-warn border-brand-warn/30',
    success: 'bg-brand-accent/10 text-brand-accent border-brand-accent/30',
    critical: 'bg-brand-bad/10 text-brand-bad border-brand-bad/30',
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-brand-text">{isBn ? 'ঘোষণা' : 'Announcements'}</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary text-sm">
          {isBn ? 'নতুন ঘোষণা' : 'New Announcement'}
        </button>
      </div>

      {showCreate && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-brand-text mb-4">{isBn ? 'নতুন ঘোষণা তৈরি করুন' : 'Create New Announcement'}</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'শিরোনাম' : 'Title'}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'বিবরণ' : 'Body'}</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-1.5">{isBn ? 'ধরন' : 'Variant'}</label>
                <select
                  value={variant}
                  onChange={(e) => setVariant(e.target.value as any)}
                  className="w-full px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
                >
                  <option value="info">{isBn ? 'তথ্য' : 'Info'}</option>
                  <option value="warning">{isBn ? 'সতর্কতা' : 'Warning'}</option>
                  <option value="success">{isBn ? 'সফলতা' : 'Success'}</option>
                  <option value="critical">{isBn ? 'জরুরি' : 'Critical'}</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dismissible}
                    onChange={(e) => setDismissible(e.target.checked)}
                    className="w-4 h-4 accent-brand-accent"
                  />
                  <span className="text-sm text-brand-text">{isBn ? 'বন্ধযোগ্য' : 'Dismissible'}</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCreate(false)} className="btn-ghost flex-1">
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button onClick={handleCreate} className="btn-primary flex-1">
                {isBn ? 'তৈরি করুন' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {announcements.length === 0 ? (
        <div className="card text-center py-12">
          <Megaphone className="w-8 h-8 text-brand-muted mx-auto mb-3" />
          <p className="text-sm text-brand-muted">{isBn ? 'কোনো ঘোষণা নেই' : 'No announcements'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className={`card border ${variantColors[announcement.variant]}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-base font-semibold text-brand-text">{announcement.title}</h3>
                  <p className="text-sm text-brand-muted mt-1">{announcement.body}</p>
                  <p className="text-xs text-brand-muted mt-2">{formatDate(announcement.created_at, lang)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(announcement.id, !announcement.active)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      announcement.active ? 'bg-brand-accent/10 text-brand-accent' : 'bg-brand-muted/10 text-brand-muted'
                    }`}
                  >
                    {announcement.active ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')}
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-1.5 rounded-lg bg-brand-bad/10 text-brand-bad hover:bg-brand-bad/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
