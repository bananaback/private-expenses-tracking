// Main Application Controller
// Orchestrates all modules and handles user interactions

const AppController = {
    // Application state
    _isInitialized: false,

    /**
     * Initialize the application
     */
    init() {
        if (this._isInitialized) return;

        try {
            // Load data from storage
            const data = StorageManager.loadData();

            // Initialize modules
            ExpenseManager.init(data);
            StatisticsModule.init(data.settings);
            CalendarModule.init(ExpenseManager.getExpenses());
            ModalModule.init();

            // Set up UI with saved settings
            this._populateFormFields(data.settings);
            this._updateCategoryDatalist();

            // Bind event listeners
            this._bindEventListeners();

            // Initial render
            this._updateDisplay();

            this._isInitialized = true;
            console.log('Expense Tracker initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
            this._showError(CONFIG.MESSAGES.APP_ERROR);
        }
    },

    /**
     * Add a new expense
     */
    addExpense() {
        try {
            const expenseData = this._getExpenseFormData();

            // Validate form data
            if (!expenseData.description || !expenseData.amount) {
                alert(CONFIG.MESSAGES.VALIDATION_ERROR);
                return;
            }

            // Add expense through manager
            ExpenseManager.addExpense(expenseData);

            // Clear form
            this._clearExpenseForm();

            // Update UI
            this._updateDisplay();
            this._saveData();

            console.log('Expense added successfully');
        } catch (error) {
            console.error('Error adding expense:', error);
            alert(error.message || CONFIG.MESSAGES.APP_ERROR);
        }
    },

    /**
     * Delete an expense
     * @param {number} id - Expense ID
     */
    deleteExpense(id) {
        try {
            if (!confirm(CONFIG.MESSAGES.DELETE_CONFIRM)) {
                return;
            }

            // Get expense date before deletion for modal refresh
            const expense = ExpenseManager.getExpenseById(id);
            const expenseDate = expense ? expense.date : null;

            // Delete expense
            const deleted = ExpenseManager.deleteExpense(id);

            if (!deleted) {
                alert(CONFIG.MESSAGES.NO_EXPENSE_FOUND);
                return;
            }

            // Update UI
            this._updateDisplay();
            this._saveData();

            // Refresh modal if it's open
            if (expenseDate && ModalModule.getCurrentState().isVisible) {
                ModalModule.show(expenseDate, ModalModule.getCurrentState().category);
            }

            console.log('Expense deleted successfully');
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert(CONFIG.MESSAGES.EXPENSE_DELETED);
        }
    },

    /**
     * Show daily expenses modal
     * @param {string} dateStr - Date string in YYYY-MM-DD format
     * @param {string} selectedCategory - Selected category filter
     */
    showDailyExpenses(dateStr, selectedCategory = CONFIG.MESSAGES.ALL_CATEGORIES) {
        try {
            ModalModule.show(dateStr, selectedCategory);
        } catch (error) {
            console.error('Error showing daily expenses:', error);
            alert(CONFIG.MESSAGES.MODAL_ERROR);
        }
    },

    /**
     * Navigate calendar to previous month
     */
    previousMonth() {
        CalendarModule.previousMonth();
    },

    /**
     * Navigate calendar to next month
     */
    nextMonth() {
        CalendarModule.nextMonth();
    },

    /**
     * Export data to JSON file
     */
    exportData() {
        try {
            const data = this._getCurrentData();
            const blob = StorageManager.exportData(data);

            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${CONFIG.EXPORT_FILE_PREFIX}${Utils.getTodayString()}.json`;
            a.click();
            URL.revokeObjectURL(url);

            console.log('Data exported successfully');
        } catch (error) {
            console.error('Error exporting data:', error);
            alert(CONFIG.MESSAGES.EXPORT_ERROR);
        }
    },

    /**
     * Import data from JSON file
     * @param {Event} event - File input change event
     */
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (!confirm(CONFIG.MESSAGES.IMPORT_CONFIRM)) {
                    return;
                }

                const data = StorageManager.importData(e.target.result);

                // Reinitialize with imported data
                ExpenseManager.init(data);
                StatisticsModule.updateSettings(data.settings);
                CalendarModule.updateExpenses(ExpenseManager.getExpenses());

                // Update UI
                this._populateFormFields(data.settings);
                this._updateDisplay();
                this._saveData();

                alert(CONFIG.MESSAGES.IMPORT_SUCCESS);
                console.log('Data imported successfully');
            } catch (error) {
                console.error('Error importing data:', error);
                alert(error.message || CONFIG.MESSAGES.IMPORT_ERROR);
            }
        };
        reader.readAsText(file);
    },

    /**
     * Update budget settings
     */
    updateBudgetSettings() {
        try {
            const settings = this._getBudgetFormData();
            StatisticsModule.updateSettings(settings);
            this._saveData();
        } catch (error) {
            console.error('Error updating budget settings:', error);
        }
    },

    /**
     * Bind all event listeners
     * @private
     */
    _bindEventListeners() {
        // Form submissions
        $('#addExpenseBtn').click(() => this.addExpense());

        // Import/Export
        $('#exportBtn').click(() => this.exportData());
        $('#importBtn').click(() => $('#fileInput').click());
        $('#fileInput').change((e) => this.importData(e));

        // Calendar navigation
        $('#prevMonth').click(() => this.previousMonth());
        $('#nextMonth').click(() => this.nextMonth());

        // Budget settings auto-update
        $('#totalBudget, #startDate, #endDate').on('input change',
            Utils.debounce(() => this.updateBudgetSettings(), 300)
        );

        // Enter key support for expense form
        $('#expenseAmount, #expenseDescription, #expenseCategory').keypress((e) => {
            if (e.which === 13) this.addExpense();
        });

        // Set today's date by default
        $('#startDate').val(Utils.getTodayString());
    },

    /**
     * Get expense form data
     * @returns {object} Expense data object
     * @private
     */
    _getExpenseFormData() {
        return {
            description: $('#expenseDescription').val().trim(),
            amount: parseFloat($('#expenseAmount').val()),
            category: $('#expenseCategory').val().trim() || 'Khác',
            date: Utils.getTodayString()
        };
    },

    /**
     * Get budget form data
     * @returns {object} Budget settings object
     * @private
     */
    _getBudgetFormData() {
        return {
            totalBudget: $('#totalBudget').val(),
            startDate: $('#startDate').val(),
            endDate: $('#endDate').val()
        };
    },

    /**
     * Clear expense form
     * @private
     */
    _clearExpenseForm() {
        $('#expenseDescription, #expenseAmount, #expenseCategory').val('');
    },

    /**
     * Populate form fields with saved data
     * @param {object} settings - Settings object
     * @private
     */
    _populateFormFields(settings) {
        $('#totalBudget').val(settings.totalBudget || '');
        $('#startDate').val(settings.startDate || Utils.getTodayString());
        $('#endDate').val(settings.endDate || '2025-10-06');
    },

    /**
     * Update category datalist
     * @private
     */
    _updateCategoryDatalist() {
        const categories = ExpenseManager.getCategories();
        const options = categories.map(cat => `<option value="${cat}">`).join('');
        $('#categoryList').html(options);
    },

    /**
     * Update all UI displays
     * @private
     */
    _updateDisplay() {
        StatisticsModule.updateDisplay();
        CalendarModule.updateExpenses(ExpenseManager.getExpenses());
        CalendarModule.render();
        this._updateCategoryDatalist();
    },

    /**
     * Save current data to storage
     * @private
     */
    _saveData() {
        try {
            const data = this._getCurrentData();
            StorageManager.saveData(data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    },

    /**
     * Get current application data
     * @returns {object} Current data object
     * @private
     */
    _getCurrentData() {
        return {
            ...ExpenseManager.getData(),
            settings: this._getBudgetFormData()
        };
    },

    /**
     * Show error message to user
     * @param {string} message - Error message
     * @private
     */
    _showError(message) {
        alert(message);
    },

    /**
     * Get current application state
     * @returns {object} Application state
     */
    getState() {
        return {
            isInitialized: this._isInitialized,
            expenseCount: ExpenseManager.getExpenses().length,
            categoryCount: ExpenseManager.getCategories().length,
            currentStats: StatisticsModule.getCurrentStats(),
            currentDate: CalendarModule.getCurrentDate(),
            modalState: ModalModule.getCurrentState()
        };
    }
};

// Global functions for onclick handlers (backward compatibility)
window.showDailyExpenses = (dateStr, category) => AppController.showDailyExpenses(dateStr, category);
window.deleteExpense = (id) => AppController.deleteExpense(id);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppController;
} else if (typeof window !== 'undefined') {
    window.AppController = AppController;
}