import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from '@/components/molecules/TaskItem';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask, onReorderTasks, onTaskComplete }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleDragStart = (e, task, index) => {
    setDraggedTask({ task, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (!draggedTask || draggedTask.index === dropIndex) {
      setDraggedTask(null);
      setDragOverIndex(null);
      return;
    }

    const newTasks = [...tasks];
    const [removed] = newTasks.splice(draggedTask.index, 1);
    newTasks.splice(dropIndex, 0, removed);

    onReorderTasks(newTasks);
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  const handleToggleComplete = async (task) => {
    await onUpdateTask(task.id, { completed: !task.completed });
  };

  const handleStartEdit = (taskId, currentTitle) => {
    setEditingTask(taskId);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = async () => {
    if (editTitle.trim() && editTitle !== tasks.find(t => t.id === editingTask)?.title) {
      await onUpdateTask(editingTask, { title: editTitle.trim() });
    }
    setEditingTask(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
  };

  const handleEditTitleChange = (newTitle) => {
    setEditTitle(newTitle);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            isEditing={editingTask === task.id}
            editTitle={editTitle}
            onDragStart={handleDragStart}
            onDragOver={dragOverIndex === index ? handleDragOver : undefined}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onToggleComplete={handleToggleComplete}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onDeleteTask={onDeleteTask}
            onEditTitleChange={handleEditTitleChange}
            onTaskCompleteAnimation={onTaskComplete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;