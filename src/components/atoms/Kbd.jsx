import React from 'react';

const Kbd = ({ children, className = '', ...props }) => {
    return (
        <kbd className={`px-2 py-1 bg-gray-100 rounded text-xs ${className}`} {...props}>
            {children}
        </kbd>
    );
};

export default Kbd;