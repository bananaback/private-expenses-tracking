// Modal Module
// Handles daily expenses modal and category filtering

const ModalModule = {
    // Private properties
    _currentDate: '',
    _currentCategory: CONFIG.MESSAGES.ALL_CATEGORIES,
    _expenses: [],

    /**
     * Initialize modal module
     */
    init() {
        this._bindEvents();
    },

    /**
     * Show daily expenses modal
     * @param {string} dateStr - Date string in YYYY-MM-DD format
     * @param {string} selectedCategory - Selected category filter
     */
    show(dateStr, selectedCategory = CONFIG.MESSAGES.ALL_CATEGORIES) {
        this._currentDate = dateStr;
        this._currentCategory = selectedCategory;
        this._expenses = ExpenseManager.getExpensesByDate(dateStr);

        this._updateModalTitle(dateStr);
        this._renderCategoryFilters();
        this._renderExpensesList();
        this._showModal();
    },

    /**
     * Hide the modal
     */
    hide() {
        $('#dailyExpensesModal').addClass('hidden');
    },

    /**
     * Refresh modal content (useful after expense deletion)
     */
    refresh() {
        if (this._currentDate) {
            this.show(this._currentDate, this._currentCategory);
        }
    },

    /**
     * Bind event listeners
     * @private
     */
    _bindEvents() {
        // Close modal button
        $('#closeModal').click(() => this.hide());

        // Close modal on overlay click
        $('#dailyExpensesModal').click((e) => {
            if (e.target.id === 'dailyExpensesModal') {
                this.hide();
            }
        });

        // ESC key to close modal
        $(document).keydown((e) => {
            if (e.key === 'Escape' && !$('#dailyExpensesModal').hasClass('hidden')) {
                this.hide();
            }
        });
    },

    /**
     * Update modal title with formatted date
     * @param {string} dateStr - Date string
     * @private
     */
    _updateModalTitle(dateStr) {
        const formattedDate = Utils.formatDate(dateStr, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        $('#modalDate').text(`Chi Tiêu - ${formattedDate}`);
    },

    /**
     * Render category filter chips
     * @private
     */
    _renderCategoryFilters() {
        const dayCategories = ExpenseManager.getCategoriesForDate(this._currentDate);
        let filtersHtml = '';

        // Always include "Tất Cả" filter
        const isAllActive = this._currentCategory === CONFIG.MESSAGES.ALL_CATEGORIES ? 'active' : '';
        filtersHtml += this._renderFilterChip(CONFIG.MESSAGES.ALL_CATEGORIES, isAllActive);

        // Add category filters
        dayCategories.forEach(category => {
            const isActive = this._currentCategory === category ? 'active' : '';
            filtersHtml += this._renderFilterChip(category, isActive);
        });

        $('#categoryFilters').html(filtersHtml);
    },

    /**
     * Render a single filter chip
     * @param {string} category - Category name
     * @param {string} activeClass - Active class ('active' or '')
     * @returns {string} HTML string for filter chip
     * @private
     */
    _renderFilterChip(category, activeClass) {
        const sanitizedCategory = Utils.sanitizeHtml(category);
        return `<span class="filter-chip ${activeClass}" onclick="ModalModule.filterByCategory('${sanitizedCategory}')">${sanitizedCategory}</span>`;
    },

    /**
     * Filter expenses by category
     * @param {string} category - Category to filter by
     */
    filterByCategory(category) {
        this._currentCategory = category;
        this._renderExpensesList();
        this._renderCategoryFilters(); // Re-render to update active state
    },

    /**
     * Render expenses list
     * @private
     */
    _renderExpensesList() {
        const filteredExpenses = this._getFilteredExpenses();

        if (filteredExpenses.length === 0) {
            this._renderEmptyState();
        } else {
            this._renderExpenses(filteredExpenses);
        }
    },

    /**
     * Get filtered expenses based on current category filter
     * @returns {Array} Filtered expenses
     * @private
     */
    _getFilteredExpenses() {
        return this._currentCategory === CONFIG.MESSAGES.ALL_CATEGORIES
            ? this._expenses
            : this._expenses.filter(expense => expense.category === this._currentCategory);
    },

    /**
     * Render empty state message
     * @private
     */
    _renderEmptyState() {
        const message = this._currentCategory === CONFIG.MESSAGES.ALL_CATEGORIES
            ? CONFIG.MESSAGES.NO_EXPENSES_DAY
            : `${CONFIG.MESSAGES.NO_EXPENSES_CATEGORY} "${this._currentCategory}"`;

        $('#modalExpenses').html(`<p class="text-gray-500 text-center py-4">${message}</p>`);
    },

    /**
     * Render expenses list
     * @param {Array} expenses - Array of expenses to render
     * @private
     */
    _renderExpenses(expenses) {
        let html = '';
        expenses.forEach(expense => {
            html += this._renderExpenseItem(expense);
        });
        $('#modalExpenses').html(html);
    },

    /**
     * Render a single expense item
     * @param {object} expense - Expense object
     * @returns {string} HTML string for expense item
     * @private
     */
    _renderExpenseItem(expense) {
        const sanitizedDescription = Utils.sanitizeHtml(expense.description);
        const sanitizedCategory = Utils.sanitizeHtml(expense.category);
        const formattedAmount = Utils.formatNumber(expense.amount);
        const formattedTime = new Date(expense.timestamp).toLocaleTimeString(CONFIG.LOCALE);

        return `
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="font-semibold text-gray-800">${sanitizedDescription}</div>
                        <div class="mt-1">
                            <span class="category-badge">${sanitizedCategory}</span>
                            <span class="text-sm text-gray-600">${formattedTime}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-red-600">${formattedAmount} VND</div>
                        <button onclick="AppController.deleteExpense(${expense.id})" 
                                class="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors">
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Show the modal
     * @private
     */
    _showModal() {
        $('#dailyExpensesModal').removeClass('hidden');
    },

    /**
     * Get current modal state
     * @returns {object} Current state object
     */
    getCurrentState() {
        return {
            date: this._currentDate,
            category: this._currentCategory,
            isVisible: !$('#dailyExpensesModal').hasClass('hidden')
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalModule;
} else if (typeof window !== 'undefined') {
    window.ModalModule = ModalModule;
}