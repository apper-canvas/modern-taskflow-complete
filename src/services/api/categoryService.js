import categoryData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoryData];
  }

  async getAll() {
    await delay(200);
    return [...this.categories];
  }

  async getById(id) {
    await delay(200);
    const category = this.categories.find(cat => cat.id === id);
    return category ? { ...category } : null;
  }

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      ...categoryData,
      id: Date.now().toString(),
      taskCount: 0
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, categoryData) {
    await delay(250);
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    this.categories[index] = { ...this.categories[index], ...categoryData };
    return { ...this.categories[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    const deletedCategory = this.categories.splice(index, 1)[0];
    return { ...deletedCategory };
  }

  async updateTaskCount(categoryId, count) {
    await delay(150);
    const category = this.categories.find(cat => cat.id === categoryId);
    if (category) {
      category.taskCount = count;
      return { ...category };
    }
    return null;
  }
}

export default new CategoryService();