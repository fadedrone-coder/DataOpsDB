import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, AtSign, Bell } from 'lucide-react';

interface Comment {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  content: string;
  mentions: string[];
  created_at: string;
  updated_at: string;
}

interface CommentsSectionProps {
  entityType: string;
  entityId: string;
  currentUser: string;
  teamMembers: Array<{ id: string; name: string; role: string; avatar: string }>;
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error', from?: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  entityType,
  entityId,
  currentUser,
  teamMembers,
  onNotification,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');

  useEffect(() => {
    loadComments();
  }, [entityType, entityId]);

  const loadComments = () => {
    const mockComments: Comment[] = [
      {
        id: '1',
        user_id: 'muyiwa',
        entity_type: entityType,
        entity_id: entityId,
        content: 'Great progress on this! Keep it up.',
        mentions: [],
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        user_id: 'sophie',
        entity_type: entityType,
        entity_id: entityId,
        content: '@emmanuel Can you help review this? It relates to your area.',
        mentions: ['emmanuel'],
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setComments(mockComments);
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.matchAll(mentionRegex);
    return Array.from(matches, m => m[1]);
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const mentions = extractMentions(newComment);
    const comment: Comment = {
      id: Date.now().toString(),
      user_id: currentUser,
      entity_type: entityType,
      entity_id: entityId,
      content: newComment,
      mentions,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment('');

    if (mentions.length > 0) {
      mentions.forEach(mention => {
        const user = teamMembers.find(m => m.id === mention);
        if (user) {
          onNotification(
            `You were mentioned in a comment by ${getUserName(currentUser)}`,
            'info',
            getUserName(currentUser)
          );
        }
      });
    }

    onNotification('Comment added!', 'success');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  };

  const insertMention = (userId: string) => {
    setNewComment(prev => prev + `@${userId} `);
    setShowMentions(false);
    setMentionSearch('');
  };

  const getUserName = (userId: string) => {
    return teamMembers.find(m => m.id === userId)?.name || userId;
  };

  const getUserAvatar = (userId: string) => {
    return teamMembers.find(m => m.id === userId)?.avatar || '👤';
  };

  const renderCommentContent = (content: string) => {
    const parts = content.split(/(@\w+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('@')) {
        const userId = part.substring(1);
        return (
          <span key={idx} className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const filteredMembers = mentionSearch
    ? teamMembers.filter(m => m.name.toLowerCase().includes(mentionSearch.toLowerCase()))
    : teamMembers;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Comments ({comments.length})</h3>
      </div>

      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl flex-shrink-0">{getUserAvatar(comment.user_id)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {getUserName(comment.user_id)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                  {comment.mentions.length > 0 && (
                    <span className="flex items-center text-xs text-blue-600">
                      <Bell className="h-3 w-3 mr-1" />
                      {comment.mentions.length}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-700">
                  {renderCommentContent(comment.content)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="relative">
        <div className="flex gap-2">
          <button
            onClick={() => setShowMentions(!showMentions)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Mention someone"
          >
            <AtSign className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a comment... (Use @ to mention)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={addComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {showMentions && (
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto z-10">
            <div className="p-2">
              <input
                type="text"
                value={mentionSearch}
                onChange={(e) => setMentionSearch(e.target.value)}
                placeholder="Search team members..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                autoFocus
              />
              <div className="space-y-1">
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => insertMention(member.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <span className="text-xl">{member.avatar}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-600">{member.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
