import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

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
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="search-input flex-1 ml-3 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
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
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
              {navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'}
            </kbd>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">K</kbd>
          </motion.div>
        )}
        
        {/* Clear button */}
        {value && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => onChange('')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;