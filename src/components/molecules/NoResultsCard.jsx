import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NoResultsCard = ({ searchQuery, activeFilter, onClearSearch, onClearFilter }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="text-center py-12"
  >
    <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No tasks found
    </h3>
    <p className="text-gray-600 mb-6">
      {searchQuery && activeFilter !== 'all'
        ? `No tasks match "${searchQuery}" in the selected category.`
        : searchQuery
        ? `No tasks match "${searchQuery}".`
        : 'No tasks in this category.'}
    </p>
    <div className="flex justify-center space-x-3">
      {searchQuery && (
        <Button
          onClick={onClearSearch}
          variant="outline"
          size="md"
        >
          Clear Search
        </Button>
      )}
      {activeFilter !== 'all' && (
        <Button
          onClick={onClearFilter}
          variant="primary"
          size="md"
        >
          Show All Tasks
        </Button>
      )}
    </div>
  </motion.div>
);

export default NoResultsCard;