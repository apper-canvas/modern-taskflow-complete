import React from 'react';
import { motion } from 'framer-motion';
import Kbd from '@/components/atoms/Kbd';

const KeyboardShortcutHint = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center text-sm text-gray-500"
        >
            <p>
                Press <Kbd>Ctrl+K</Kbd> to search,{' '}
                <Kbd>Enter</Kbd> to add task,{' '}
                <Kbd>Space</Kbd> to complete
            </p>
        </motion.div>
    );
};

export default KeyboardShortcutHint;