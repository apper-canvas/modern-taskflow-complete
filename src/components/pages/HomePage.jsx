import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { isPast, parseISO } from 'date-fns';
import { taskService, categoryService } from '@/services';

// Import Organisms
import TaskForm from '@/components/organisms/TaskForm';
import TaskList from '@/components/organisms/TaskList';
import HomePageSkeleton from '@/components/organisms/HomePageSkeleton';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';

// Import Molecules
import CategoryFilterTabs from '@/components/molecules/CategoryFilterTabs';
import SearchBar from '@/components/molecules/SearchBar';
import CompletionConfetti from '@/components/molecules/CompletionConfetti';
import ProgressRing from '@/components/molecules/ProgressRing';
import EmptyStateCard from '@/components/molecules/EmptyStateCard';
import NoResultsCard from '@/components/molecules/NoResultsCard';
import KeyboardShortcutHint from '@/components/molecules/KeyboardShortcutHint';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completedTaskPosition, setCompletedTaskPosition] = useState({ x: 0, y: 0 });
  const taskInputRef = useRef(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tasksData, categoriesData] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Auto-focus task input on load
  useEffect(() => {
    if (taskInputRef.current && !loading) {
      taskInputRef.current.focus();
    }
  }, [loading]);

  // Filter and search tasks
  useEffect(() => {
    let filtered = [...tasks];

    // Apply category filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'completed') {
        filtered = filtered.filter(task => task.completed);
      } else if (activeFilter === 'pending') {
        filtered = filtered.filter(task => !task.completed);
      } else if (activeFilter === 'overdue') {
        const now = new Date();
        filtered = filtered.filter(task =>
          !task.completed &&
          task.dueDate &&
          isPast(parseISO(task.dueDate))
        );
      } else {
        filtered = filtered.filter(task => task.category === activeFilter);
      }
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, activeFilter, searchQuery]);

  // Calculate completion stats
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.update(id, updates);
      setTasks(prev => prev.map(task =>
        task.id === id ? updatedTask : task
      ));

      if (updates.hasOwnProperty('completed') && updates.completed) {
        setShowCompletion(true);
        setTimeout(() => setShowCompletion(false), 1000);
        toast.success('Task completed! 🎉');
      } else {
        toast.success('Task updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleReorderTasks = async (reorderedTasks) => {
    try {
      const taskIds = reorderedTasks.map(task => task.id);
      await taskService.reorderTasks(taskIds);
      setTasks(reorderedTasks);
    } catch (err) {
      toast.error('Failed to reorder tasks');
    }
  };

  const handleTaskCompleteAnimation = (taskElement) => {
    if (taskElement) {
      const rect = taskElement.getBoundingClientRect();
      setCompletedTaskPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) searchInput.focus();
      }

      // Escape to clear search
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  if (loading) {
    return <HomePageSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  const isEmpty = tasks.length === 0;

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
            TaskFlow
          </h1>
          <p className="text-gray-600 text-lg">
            Efficiently manage and complete your daily tasks
          </p>
        </motion.div>

        {/* Progress Ring */}
        {!isEmpty && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <ProgressRing
              percentage={completionPercentage}
              size={96}
              strokeWidth={8}
              completed={completedCount}
              total={totalCount}
            />
          </motion.div>
        )}

        {/* Task Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TaskForm
            ref={taskInputRef}
            onCreateTask={handleCreateTask}
            categories={categories}
          />
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tasks... (Ctrl+K)"
          />
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <CategoryFilterTabs
            categories={categories}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            tasks={tasks}
          />
        </motion.div>

        {/* Task List or Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isEmpty ? (
            <EmptyStateCard onAddTask={() => taskInputRef.current?.focus()} />
          ) : filteredTasks.length === 0 ? (
            <NoResultsCard
              searchQuery={searchQuery}
              activeFilter={activeFilter}
              onClearSearch={() => setSearchQuery('')}
              onClearFilter={() => setActiveFilter('all')}
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onReorderTasks={handleReorderTasks}
              onTaskComplete={handleTaskCompleteAnimation}
            />
          )}
        </motion.div>

        {/* Completion Animation */}
        <AnimatePresence>
          {showCompletion && (
            <CompletionConfetti
              position={completedTaskPosition}
              onComplete={() => setShowCompletion(false)}
            />
          )}
        </AnimatePresence>

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutHint />
      </div>
    </div>
  );
};

export default HomePage;