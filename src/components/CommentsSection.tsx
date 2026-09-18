import { useState } from 'react';
import { Heart, MessageCircle, Reply, Flag, Edit2, Trash2, Shield } from 'lucide-react';
import { useAuthStore } from '../store';
import { useSocialStore } from '../lib/services/social';
import { useBusinessStore } from '../lib/services/business';
import { formatDate } from '../lib/utils';

interface CommentsSectionProps {
  update_id: string;
  business_id: string;
  update_author_id: string;
}

export function CommentsSection({ update_id, business_id, update_author_id }: CommentsSectionProps) {
  const { user, lang } = useAuthStore();
  const { comments, addComment, likeComment, unlikeComment, hasLikedComment, getComments, getCommentReplies, getNotificationPrefs } = useSocialStore();
  const { businesses } = useBusinessStore();
  const isBn = lang === 'bn';
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const business = businesses.find(b => b.id === business_id);
  const topLevelComments = getComments(update_id);

  const getAuthorDisplayName = (user_id: string) => {
    if (user_id === business?.owner_id) {
      return `Founder #${user_id.substring(0, 3).toUpperCase()}`;
    }
    return `Investor #${user_id.substring(0, 3).toUpperCase()}`;
  };

  const handleSubmitComment = () => {
    if (!user || !newComment.trim()) return;
    
    const prefs = getNotificationPrefs(user.id);
    if (!prefs.comment_replies) return;

    const result = addComment(update_id, user.id, newComment.trim());
    if (result.success) {
      setNewComment('');
    }
  };

  const handleSubmitReply = (parent_id: string) => {
    if (!user || !replyText.trim()) return;
    
    const result = addComment(update_id, user.id, replyText.trim(), parent_id);
    if (result.success) {
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleLikeComment = (comment_id: string) => {
    if (!user) return;
    if (hasLikedComment(comment_id, user.id)) {
      unlikeComment(comment_id, user.id);
    } else {
      likeComment(comment_id, user.id);
    }
  };

  if (!user) {
    return (
      <div className="mt-4 p-4 bg-brand-panel2 rounded-xl text-center">
        <p className="text-sm text-brand-muted">{isBn ? 'মন্তব্য করতে লগ ইন করুন' : 'Login to comment'}</p>
      </div>
    );
  }

  if (user.kyc_status !== 'verified') {
    return (
      <div className="mt-4 p-4 bg-brand-panel2 rounded-xl text-center">
        <p className="text-sm text-brand-muted">{isBn ? 'মন্তব্য করতে KYC যাচাইকরণ প্রয়োজন' : 'KYC verification required to comment'}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {/* Comment Composer */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isBn ? 'মন্তব্য লিখুন...' : 'Write a comment...'}
          className="flex-1 px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
          maxLength={1000}
        />
        <button
          onClick={handleSubmitComment}
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-brand-accent text-brand-bg rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {isBn ? 'পোস্ট' : 'Post'}
        </button>
      </div>

      {/* Comments List */}
      {topLevelComments.length === 0 ? (
        <p className="text-sm text-brand-muted text-center py-4">{isBn ? 'কোনো মন্তব্য নেই' : 'No comments yet'}</p>
      ) : (
        <div className="space-y-3">
          {topLevelComments.map((comment) => {
            const replies = getCommentReplies(comment.id);
            const hasLiked = hasLikedComment(comment.id, user.id);

            return (
              <div key={comment.id} className="space-y-2">
                {/* Main Comment */}
                <div className="bg-brand-panel2 rounded-xl p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-brand-accent">
                          {comment.user_id === business?.owner_id ? 'F' : 'I'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-text">
                          {getAuthorDisplayName(comment.user_id)}
                        </p>
                        <p className="text-xs text-brand-muted">{formatDate(comment.created_at, lang)}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-brand-text mb-2">{comment.body}</p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-1 text-xs ${hasLiked ? 'text-brand-bad' : 'text-brand-muted'} hover:text-brand-bad`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                      {comment.likes_count > 0 && <span>{comment.likes_count}</span>}
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center gap-1 text-xs text-brand-muted hover:text-brand-text"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>{isBn ? 'উত্তর' : 'Reply'}</span>
                    </button>
                  </div>
                </div>

                {/* Replies */}
                {replies.length > 0 && (
                  <div className="ml-8 space-y-2">
                    {replies.map((reply) => {
                      const replyHasLiked = hasLikedComment(reply.id, user.id);
                      return (
                        <div key={reply.id} className="bg-brand-panel rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center">
                              <span className="text-[10px] font-medium text-brand-accent">
                                {reply.user_id === business?.owner_id ? 'F' : 'I'}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-brand-text">
                                {getAuthorDisplayName(reply.user_id)}
                              </p>
                              <p className="text-[10px] text-brand-muted">{formatDate(reply.created_at, lang)}</p>
                            </div>
                          </div>
                          <p className="text-sm text-brand-text mb-2">{reply.body}</p>
                          <button
                            onClick={() => handleLikeComment(reply.id)}
                            className={`flex items-center gap-1 text-xs ${replyHasLiked ? 'text-brand-bad' : 'text-brand-muted'} hover:text-brand-bad`}
                          >
                            <Heart className={`w-3 h-3 ${replyHasLiked ? 'fill-current' : ''}`} />
                            {reply.likes_count > 0 && <span>{reply.likes_count}</span>}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reply Composer */}
                {replyingTo === comment.id && (
                  <div className="ml-8 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={isBn ? 'উত্তর লিখুন...' : 'Write a reply...'}
                      className="flex-1 px-3 py-2 bg-brand-panel2 border border-brand-line rounded-lg text-sm"
                      maxLength={1000}
                    />
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyText.trim()}
                      className="px-3 py-2 bg-brand-accent text-brand-bg rounded-lg text-xs font-medium disabled:opacity-50"
                    >
                      {isBn ? 'পোস্ট' : 'Post'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
