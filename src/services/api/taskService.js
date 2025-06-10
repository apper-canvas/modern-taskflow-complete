import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...taskData];
  }

  async getAll() {
    await delay(200);
    return [...this.tasks].sort((a, b) => a.order - b.order);
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(task => task.id === id);
    return task ? { ...task } : null;
  }

  async create(taskData) {
    await delay(300);
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
      order: this.tasks.length
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await delay(250);
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    this.tasks[index] = { ...this.tasks[index], ...taskData };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async reorderTasks(taskIds) {
    await delay(200);
    taskIds.forEach((id, index) => {
      const task = this.tasks.find(t => t.id === id);
      if (task) {
        task.order = index;
      }
    });
    return [...this.tasks].sort((a, b) => a.order - b.order);
  }

  async searchTasks(query) {
    await delay(150);
    const lowercaseQuery = query.toLowerCase();
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getTasksByCategory(categoryId) {
    await delay(200);
    return this.tasks.filter(task => task.category === categoryId);
  }

  async getCompletedTasks() {
    await delay(200);
    return this.tasks.filter(task => task.completed);
  }

  async getPendingTasks() {
    await delay(200);
    return this.tasks.filter(task => !task.completed);
  }

  async getOverdueTasks() {
    await delay(200);
    const now = new Date();
    return this.tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    );
  }
}

export default new TaskService();