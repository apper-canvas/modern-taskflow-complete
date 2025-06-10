import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyStateCard = ({ onAddTask }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="text-center py-16"
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="mb-6"
    >
      <ApperIcon name="CheckSquare" className="w-20 h-20 text-gray-300 mx-auto" />
    </motion.div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Ready to be productive?
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      Start by adding your first task above. Break down your goals into manageable steps and watch your productivity soar.
    </p>
    <Button
      onClick={onAddTask}
      size="lg"
      className="inline-flex items-center space-x-2"
    >
      <ApperIcon name="Plus" className="w-5 h-5" />
      <span>Add Your First Task</span>
    </Button>
  </motion.div>
);

export default EmptyStateCard;