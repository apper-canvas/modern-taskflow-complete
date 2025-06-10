import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import ApperIcon from './ApperIcon';

const TaskInput = forwardRef(({ onCreateTask, categories }, ref) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title: title.trim(),
      category: category || 'personal',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    };

    await onCreateTask(taskData);
    
    // Reset form
    setTitle('');
    setCategory('');
    setDueDate('');
    setShowOptions(false);
    setIsExpanded(false);
    
    // Focus back on input
    if (ref?.current) {
      ref.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setShowOptions(false);
      setIsExpanded(false);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = (e) => {
    // Only collapse if clicking outside the entire form
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsExpanded(false);
      setShowOptions(false);
    }
  };

  const quickDateOptions = [
    { label: 'Today', value: format(new Date(), 'yyyy-MM-dd') },
    { label: 'Tomorrow', value: format(addDays(new Date(), 1), 'yyyy-MM-dd') },
    { label: 'This Week', value: format(addDays(new Date(), 7), 'yyyy-MM-dd') }
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden"
      animate={{
        boxShadow: isExpanded 
          ? '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Main Input */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-4">
          <ApperIcon 
            name="Plus" 
            className="w-5 h-5 text-gray-400 flex-shrink-0" 
          />
          <input
            ref={ref}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="What needs to be done?"
            className="flex-1 text-lg placeholder-gray-500 border-none outline-none bg-transparent"
            autoComplete="off"
          />
          <motion.button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              showOptions || category || dueDate
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <ApperIcon name="Settings" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Quick Add Button */}
      {title.trim() && !isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pb-4"
        >
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Add Task
          </motion.button>
        </motion.div>
      )}

      {/* Expanded Options */}
      <motion.div
        initial={false}
        animate={{
          height: (showOptions || isExpanded) ? 'auto' : 0,
          opacity: (showOptions || isExpanded) ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="border-t border-gray-100 overflow-hidden"
      >
        <div className="p-6 space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(category === cat.id ? '' : cat.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === cat.id
                      ? 'text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: category === cat.id ? cat.color : undefined
                  }}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {quickDateOptions.map((option) => (
                <motion.button
                  key={option.label}
                  type="button"
                  onClick={() => setDueDate(dueDate === option.value ? '' : option.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dueDate === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!title.trim()}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Task
          </motion.button>
        </div>
      </motion.div>
    </motion.form>
  );
});

TaskInput.displayName = 'TaskInput';

export default TaskInput;