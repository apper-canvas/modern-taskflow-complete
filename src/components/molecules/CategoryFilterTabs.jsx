import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CategoryFilterTabs = ({ categories, activeFilter, onFilterChange, tasks }) => {
  const getTaskCount = (filterId) => {
    switch (filterId) {
      case 'all':
        return tasks.length;
      case 'completed':
        return tasks.filter(task => task.completed).length;
      case 'pending':
        return tasks.filter(task => !task.completed).length;
      case 'overdue':
        const now = new Date();
        return tasks.filter(task =>
          !task.completed &&
          task.dueDate &&
          new Date(task.dueDate) < now
        ).length;
      default:
        return tasks.filter(task => task.category === filterId).length;
    }
  };

  const systemFilters = [
    { id: 'all', name: 'All Tasks', icon: 'List' },
    { id: 'pending', name: 'Pending', icon: 'Clock' },
    { id: 'completed', name: 'Completed', icon: 'CheckCircle' },
    { id: 'overdue', name: 'AlertCircle', icon: 'AlertCircle' } // Icon for overdue is AlertCircle
  ];

  const allFilters = [
    ...systemFilters,
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      icon: 'Tag'
    }))
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {allFilters.map((filter, index) => {
        const taskCount = getTaskCount(filter.id);
        const isActive = activeFilter === filter.id;

        return (
          <Button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            size="md" // Apply common button styling
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            style={{
              backgroundColor: isActive ? (filter.color || '#5B4FE9') : undefined
            }}
            variant="none" // Use none variant and control styling with className/style
          >
            <ApperIcon
              name={filter.icon}
              className="w-4 h-4"
            />
            <span>{filter.name}</span>
            {taskCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`px-2 py-0.5 text-xs rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {taskCount}
              </motion.span>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryFilterTabs;