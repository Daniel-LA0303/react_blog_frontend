import React from 'react'

const ReplyActions = ({ 
    hasMore, 
    loading, 
    onLoadMore, 
    onToggleShowAll, 
    showAll, 
    theme,
    totalReplies,
    visibleReplies 
}) => {
    
    if (totalReplies === 0) return null;

    return (
        <div className="ml-12 mt-2 space-y-2">
            {hasMore && !showAll && (
                <button
                    onClick={onLoadMore}
                    disabled={loading}
                    className={`
                        text-sm font-medium
                        ${theme 
                            ? 'text-blue-600 hover:text-blue-800 disabled:text-blue-300' 
                            : 'text-blue-400 hover:text-blue-300 disabled:text-blue-600'
                        }
                        transition-colors duration-200
                        disabled:cursor-not-allowed
                    `}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                        </span>
                    ) : (
                        `View more replies (${totalReplies - visibleReplies} more)`
                    )}
                </button>
            )}
            
            {visibleReplies > 1 && (
                <button
                    onClick={onToggleShowAll}
                    className={`
                        text-sm font-medium
                        ${theme 
                            ? 'text-gray-600 hover:text-gray-800' 
                            : 'text-gray-400 hover:text-gray-300'
                        }
                        transition-colors duration-200
                    `}
                >
                    {showAll ? 'Hide replies' : `View all ${totalReplies} replies`}
                </button>
            )}
        </div>
    );
};

export default ReplyActions 
