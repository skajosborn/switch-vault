'use client';

import { MessageSquare } from 'lucide-react';

export default function EmptyState() {
  // Empty state card styles - softer appearance with !important
  const emptyStateStyle = {
    backgroundColor: '#1e40af !important',
    border: '2px solid #3b82f6 !important',
    borderRadius: '0.75rem !important',
    boxShadow: '0 15px 25px rgba(0, 0, 0, 0.2) !important',
    transition: 'all 0.3s ease !important',
    padding: '3rem 2rem !important',
    margin: '2rem 0 !important'
  };

  return (
    <div style={emptyStateStyle} className="text-center max-w-lg mx-auto">
      {/* Icon Container */}
      <div className="p-4 bg-blue-600/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-blue-600/30">
        <MessageSquare className="w-10 h-10 text-blue-400" />
      </div>
      
      {/* Content */}
      <h3 style={{ 
        color: 'white', 
        fontSize: '1.5rem', 
        fontWeight: '600', 
        marginBottom: '1rem',
        lineHeight: '1.3'
      }}>
        No switches created yet
      </h3>
      
      <p style={{ 
        color: '#dbeafe', 
        fontSize: '1rem', 
        marginBottom: '1rem', 
        lineHeight: '1.5'
      }}>
        Create your first switch above to get started with your safety net.
      </p>
      
      <p style={{ 
        color: '#bfdbfe', 
        fontSize: '0.9rem', 
        margin: '0 auto',
        lineHeight: '1.5'
      }}>
        A dead man's switch will automatically send your message if you don't check in within the specified time.
      </p>
    </div>
  );
}
