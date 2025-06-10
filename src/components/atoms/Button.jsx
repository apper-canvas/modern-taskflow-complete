import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    onClick,
    className = '',
    variant = 'primary', // primary, secondary, outline, ghost, danger, none
    size = 'md', // sm, md, lg, full
    disabled = false,
    whileHover = { scale: 1.05 },
    whileTap = { scale: 0.95 },
    ...props
}) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300",
        outline: "border border-primary text-primary hover:bg-primary/5 focus:ring-primary/50",
        ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
        danger: "bg-error text-white hover:bg-error/90 focus:ring-error/50",
        none: ""
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm rounded-md",
        md: "px-4 py-2 rounded-lg",
        lg: "px-6 py-3 rounded-lg text-lg",
        full: "w-full py-3 rounded-lg text-base"
    };

    const finalClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <motion.button
            onClick={onClick}
            className={finalClasses}
            whileHover={whileHover}
            whileTap={whileTap}
            disabled={disabled}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;