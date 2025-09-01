import React from 'react'

const RepliesCounter = ({ count, theme }) => {
    return (
        <span className={`text-sm ${theme ? 'text-gray-600' : 'text-gray-400'}`}>
            {count} {count === 1 ? 'reply' : 'replies'}
        </span>
    );
};

export default RepliesCounter
