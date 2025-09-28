// Expense Manager Module
// Handles all expense-related operations

const ExpenseManager = {
    // Private data
    _expenses: [],
    _categories: [...CONFIG.DEFAULT_CATEGORIES],

    /**
     * Initialize expense manager with data
     * @param {object} data - Initial data
     */
    init(data) {
        this._expenses = data.expenses || [];
        this._categories = data.categories || [...CONFIG.DEFAULT_CATEGORIES];
    },

    /**
     * Get all expenses
     * @returns {Array} Array of expenses
     */
    getExpenses() {
        return [...this._expenses];
    },

    /**
     * Get expenses filtered by date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Filtered expenses
     */
    getExpensesByDateRange(startDate, endDate) {
        if (!startDate || !endDate) return [];

        return this._expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
        });
    },

    /**
     * Get expenses for a specific date
     * @param {string} dateStr - Date string in YYYY-MM-DD format
     * @returns {Array} Expenses for the date
     */
    getExpensesByDate(dateStr) {
        return this._expenses.filter(expense => expense.date === dateStr);
    },

    /**
     * Get expenses filtered by category
     * @param {string} category - Category to filter by
     * @returns {Array} Filtered expenses
     */
    getExpensesByCategory(category) {
        return this._expenses.filter(expense => expense.category === category);
    },

    /**
     * Add a new expense
     * @param {object} expenseData - Expense data
     * @returns {object} Created expense object
     */
    addExpense(expenseData) {
        if (!Utils.validateExpense(expenseData)) {
            throw new Error(CONFIG.MESSAGES.VALIDATION_ERROR);
        }

        const expense = {
            id: Utils.generateId(),
            description: Utils.sanitizeHtml(expenseData.description.trim()),
            amount: parseFloat(expenseData.amount),
            category: expenseData.category || 'Khác',
            date: expenseData.date || Utils.getTodayString(),
            timestamp: new Date().toISOString()
        };

        // Add to beginning of array (most recent first)
        this._expenses.unshift(expense);

        // Add category if it doesn't exist
        this.addCategory(expense.category);

        return expense;
    },

    /**
     * Delete an expense by ID
     * @param {number} id - Expense ID
     * @returns {boolean} True if deleted successfully
     */
    deleteExpense(id) {
        const initialLength = this._expenses.length;
        this._expenses = this._expenses.filter(expense => expense.id !== id);
        return this._expenses.length < initialLength;
    },

    /**
     * Update an expense
     * @param {number} id - Expense ID
     * @param {object} updateData - Data to update
     * @returns {object|null} Updated expense or null if not found
     */
    updateExpense(id, updateData) {
        const index = this._expenses.findIndex(expense => expense.id === id);
        if (index === -1) return null;

        const expense = this._expenses[index];
        const updatedExpense = {
            ...expense,
            ...updateData,
            id: expense.id, // Preserve original ID
            timestamp: expense.timestamp // Preserve original timestamp
        };

        if (!Utils.validateExpense(updatedExpense)) {
            throw new Error(CONFIG.MESSAGES.VALIDATION_ERROR);
        }

        this._expenses[index] = updatedExpense;
        return updatedExpense;
    },

    /**
     * Get expense by ID
     * @param {number} id - Expense ID
     * @returns {object|null} Expense object or null if not found
     */
    getExpenseById(id) {
        return this._expenses.find(expense => expense.id === id) || null;
    },

    /**
     * Get total amount spent
     * @param {Array} expenses - Optional expenses array, uses all if not provided
     * @returns {number} Total amount
     */
    getTotalSpent(expenses = null) {
        const expensesToSum = expenses || this._expenses;
        return expensesToSum.reduce((total, expense) => total + expense.amount, 0);
    },

    /**
     * Get all categories
     * @returns {Array} Array of categories
     */
    getCategories() {
        return [...this._categories];
    },

    /**
     * Add a new category
     * @param {string} category - Category name
     */
    addCategory(category) {
        const trimmedCategory = category.trim();
        if (trimmedCategory && !this._categories.includes(trimmedCategory)) {
            this._categories.push(trimmedCategory);
        }
    },

    /**
     * Remove a category
     * @param {string} category - Category name
     */
    removeCategory(category) {
        const index = this._categories.indexOf(category);
        if (index > -1) {
            this._categories.splice(index, 1);
        }
    },

    /**
     * Get unique categories from expenses for a specific date
     * @param {string} dateStr - Date string
     * @returns {Array} Array of categories
     */
    getCategoriesForDate(dateStr) {
        const dayExpenses = this.getExpensesByDate(dateStr);
        return [...new Set(dayExpenses.map(expense => expense.category))].sort();
    },

    /**
     * Get statistics for expenses
     * @param {Date} startDate - Start date (optional)
     * @param {Date} endDate - End date (optional)
     * @returns {object} Statistics object
     */
    getStatistics(startDate = null, endDate = null) {
        const expenses = startDate && endDate
            ? this.getExpensesByDateRange(startDate, endDate)
            : this._expenses;

        const totalSpent = this.getTotalSpent(expenses);
        const expenseCount = expenses.length;
        const averageExpense = expenseCount > 0 ? totalSpent / expenseCount : 0;

        // Category breakdown
        const categoryStats = {};
        expenses.forEach(expense => {
            if (!categoryStats[expense.category]) {
                categoryStats[expense.category] = { count: 0, total: 0 };
            }
            categoryStats[expense.category].count++;
            categoryStats[expense.category].total += expense.amount;
        });

        return {
            totalSpent,
            expenseCount,
            averageExpense,
            categoryStats
        };
    },

    /**
     * Clear all expenses
     */
    clearAllExpenses() {
        this._expenses = [];
    },

    /**
     * Get current data for storage
     * @returns {object} Data object for storage
     */
    getData() {
        return {
            expenses: this.getExpenses(),
            categories: this.getCategories()
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExpenseManager;
} else if (typeof window !== 'undefined') {
    window.ExpenseManager = ExpenseManager;
}