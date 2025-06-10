import React from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import IconButton from '@/components/atoms/IconButton';

const TaskItem = ({
  task,
  index,
  isEditing,
  editTitle,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onToggleComplete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteTask,
  onEditTitleChange,
  onTaskCompleteAnimation
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSaveEdit();
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  const formatDueDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    return format(date, 'MMM d');
  };

  const getDueDateStatus = (dateString, completed) => {
    if (!dateString || completed) return 'none';
    const date = parseISO(dateString);
    if (isPast(date) && !isToday(date)) return 'overdue';
    if (isToday(date)) return 'today';
    return 'upcoming';
  };

  const dueDateColors = {
    overdue: 'text-error bg-error/10',
    today: 'text-warning bg-warning/10',
    upcoming: 'text-info bg-info/10',
    none: ''
  };

  const getCategoryColor = (categoryId) => {
    const colors = {
      work: '#5B4FE9',
      personal: '#4ECDC4',
      shopping: '#FFD93D',
      urgent: '#FF6B6B',
      ideas: '#8B7FFF'
    };
    return colors[categoryId] || '#94a3b8';
  };

  const getCategoryName = (categoryId) => {
    const names = {
      work: 'Work',
      personal: 'Personal',
      shopping: 'Shopping',
      urgent: 'Urgent',
      ideas: 'Ideas'
    };
    return names[categoryId] || 'General';
  };

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      layout
      className={`task-item bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
        onDragOver ? 'ring-2 ring-primary/30' : ''
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, task, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      whileHover={{
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        y: -2
      }}
      transition={{ duration: 0.15 }}
    >
      <div className="p-6">
        <div className="flex items-center space-x-4 group"> {/* Added group for hover opacity */}
          {/* Checkbox */}
          <motion.button
            onClick={(e) => {
                if (!task.completed) { // Only trigger animation on complete
                    onTaskCompleteAnimation(e.currentTarget.closest('.task-item'));
                }
                onToggleComplete(task);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0"
          >
            <motion.div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                task.completed
                  ? 'bg-success border-success'
                  : 'border-gray-300 hover:border-primary'
              }`}
              animate={{
                scale: task.completed ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {task.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ApperIcon name="Check" className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.div>
          </motion.button>

          {/* Drag Handle */}
          <div className="flex-shrink-0 cursor-move opacity-40 hover:opacity-70 transition-opacity">
            <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-500" />
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                type="text"
                value={editTitle}
                onChange={(e) => onEditTitleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={onSaveEdit}
                className="!bg-transparent !border-none !outline-none focus:!ring-2 focus:!ring-primary/20 rounded px-2 py-1 !text-lg !font-medium"
                autoFocus
              />
            ) : (
              <motion.h3
                onClick={() => onStartEdit(task.id, task.title)}
                className={`text-lg font-medium cursor-pointer transition-all ${
                  task.completed
                    ? 'text-gray-500 line-through'
                    : 'text-gray-900 hover:text-primary'
                }`}
                animate={{
                  opacity: task.completed ? 0.6 : 1
                }}
              >
                {task.title}
              </motion.h3>
            )}

            {/* Task Meta */}
            <div className="flex items-center space-x-3 mt-2">
              {/* Category Badge */}
              {task.category && (
                <span
                  className="px-2 py-1 text-xs font-medium text-white rounded-full"
                  style={{
                    backgroundColor: getCategoryColor(task.category)
                  }}
                >
                  {getCategoryName(task.category)}
                </span>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    dueDateColors[getDueDateStatus(task.dueDate, task.completed)]
                  }`}
                >
                  <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                  {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <IconButton
              icon="Edit2"
              onClick={() => onStartEdit(task.id, task.title)}
              label="Edit Task"
            />
            <IconButton
              icon="Trash2"
              onClick={() => onDeleteTask(task.id)}
              label="Delete Task"
              className="hover:!text-error" // Override default hover to error color
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;