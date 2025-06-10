import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast, parseISO } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import CategoryFilters from '../components/CategoryFilters';
import SearchBar from '../components/SearchBar';
import CompletionAnimation from '../components/CompletionAnimation';
import ProgressRing from '../components/ProgressRing';
import { taskService, categoryService } from '../services';

const Home = () => {
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

  const handleTaskComplete = (taskElement) => {
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
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header skeleton */}
          <div className="text-center mb-8">
            <div className="h-10 bg-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
          </div>

          {/* Progress ring skeleton */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Task input skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Filters skeleton */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>

          {/* Tasks skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md mx-4"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
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
          <TaskInput
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
          <CategoryFilters
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
            <EmptyState onAddTask={() => taskInputRef.current?.focus()} />
          ) : filteredTasks.length === 0 ? (
            <NoResultsState 
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
              onTaskComplete={handleTaskComplete}
            />
          )}
        </motion.div>

        {/* Completion Animation */}
        <AnimatePresence>
          {showCompletion && (
            <CompletionAnimation
              position={completedTaskPosition}
              onComplete={() => setShowCompletion(false)}
            />
          )}
        </AnimatePresence>

        {/* Keyboard Shortcuts Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p>
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+K</kbd> to search,{' '}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to add task,{' '}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Space</kbd> to complete
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ onAddTask }) => (
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
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onAddTask}
      className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center space-x-2"
    >
      <ApperIcon name="Plus" className="w-5 h-5" />
      <span>Add Your First Task</span>
    </motion.button>
  </motion.div>
);

// No Results State Component
const NoResultsState = ({ searchQuery, activeFilter, onClearSearch, onClearFilter }) => (
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearSearch}
          className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
        >
          Clear Search
        </motion.button>
      )}
      {activeFilter !== 'all' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearFilter}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Show All Tasks
        </motion.button>
      )}
    </div>
  </motion.div>
);

export default Home;