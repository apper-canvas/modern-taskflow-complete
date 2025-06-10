import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const IconButton = ({
    icon,
    onClick,
    className = '',
    iconClassName = '',
    label = '', // for accessibility
    whileHover = { scale: 1.1 },
    whileTap = { scale: 0.9 },
    ...props
}) => {
    return (
        <motion.button
            onClick={onClick}
            className={`p-1 text-gray-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 ${className}`}
            aria-label={label || icon}
            whileHover={whileHover}
            whileTap={whileTap}
            {...props}
        >
            <ApperIcon name={icon} className={`w-4 h-4 ${iconClassName}`} />
        </motion.button>
    );
};

export default IconButton;