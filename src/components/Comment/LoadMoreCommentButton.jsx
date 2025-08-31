import React from 'react'

const LoadMoreCommentsButton = ({ 
  hasMore, 
  loading, 
  onClick, 
  theme 
}) => {
  if (!hasMore) {
    return (
      <div className={`text-center py-6 ${theme ? 'text-gray-500' : 'text-gray-400'}`}>
        <div className="flex items-center justify-center">
          <span className="mr-2">•</span>
          <span>All comments loaded</span>
          <span className="ml-2">•</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="text-center py-6">
      <button
        onClick={onClick}
        disabled={loading}
        className={`
          inline-flex items-center px-6 py-3 border border-transparent 
          text-base font-medium rounded-md shadow-sm 
          ${theme 
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300' 
            : 'bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:bg-blue-500'
          }
          transition-colors duration-200
          disabled:cursor-not-allowed
        `}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading more comments...
          </>
        ) : (
          <>
            <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Load More Comments
          </>
        )}
      </button>
    </div>
  );
};
export default LoadMoreCommentsButton;
