import React from 'react'

// Componente para el botón de cargar más replies
const LoadMoreRepliesButton = ({ loading, onClick, theme, hasMore }) => {
    if (!hasMore) return null;
    
    return (
        <div className="flex justify-center mt-2 mb-4">
            <button
                onClick={onClick}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm ${
                    theme 
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Loading more replies...' : 'Load more replies'}
            </button>
        </div>
    );
};

export default LoadMoreRepliesButton
