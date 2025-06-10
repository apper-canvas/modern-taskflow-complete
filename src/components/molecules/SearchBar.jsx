import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import IconButton from '@/components/atoms/IconButton';
import Kbd from '@/components/atoms/Kbd';

const SearchBar = ({ value, onChange, placeholder = "Search tasks..." }) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div
      className={`relative bg-white rounded-xl shadow-sm border transition-all ${
        isFocused ? 'border-primary shadow-lg' : 'border-gray-200'
      }`}
      animate={{
        boxShadow: isFocused
          ? '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
    >
      <div className="flex items-center px-4 py-3">
        <ApperIcon
          name="Search"
          className={`w-5 h-5 transition-colors ${
            isFocused ? 'text-primary' : 'text-gray-400'
          }`}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="search-input flex-1 ml-3 !bg-transparent !border-none !outline-none" // Override default Input styling
          autoComplete="off"
        />

        {/* Keyboard shortcut hint */}
        {!isFocused && !value && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center space-x-1 text-xs text-gray-400"
          >
            <Kbd>
              {navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'}
            </Kbd>
            <Kbd>K</Kbd>
          </motion.div>
        )}

        {/* Clear button */}
        {value && (
          <IconButton
            icon="X"
            onClick={() => onChange('')}
            className="ml-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;