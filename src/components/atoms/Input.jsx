import React, { forwardRef } from 'react';

const Input = forwardRef(({
    type = 'text',
    value,
    onChange,
    placeholder = '',
    className = '',
    ...props
}, ref) => {
    return (
        <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`block w-full text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ease-in-out ${className}`}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export default Input;