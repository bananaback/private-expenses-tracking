// Calendar Module
// Handles calendar rendering and navigation

const CalendarModule = {
    // Private properties
    _currentDate: new Date(),
    _expenses: [],

    /**
     * Initialize calendar module
     * @param {Array} expenses - Array of expenses
     */
    init(expenses = []) {
        this._expenses = expenses;
        this.render();
    },

    /**
     * Update expenses data
     * @param {Array} expenses - Array of expenses
     */
    updateExpenses(expenses) {
        this._expenses = expenses;
    },

    /**
     * Render the calendar
     */
    render() {
        this._updateMonthDisplay();
        this._renderCalendarGrid();
    },

    /**
     * Navigate to previous month
     */
    previousMonth() {
        this._currentDate.setMonth(this._currentDate.getMonth() - 1);
        this.render();
    },

    /**
     * Navigate to next month
     */
    nextMonth() {
        this._currentDate.setMonth(this._currentDate.getMonth() + 1);
        this.render();
    },

    /**
     * Go to today's month
     */
    goToToday() {
        this._currentDate = new Date();
        this.render();
    },

    /**
     * Get current date
     * @returns {Date} Current date
     */
    getCurrentDate() {
        return new Date(this._currentDate);
    },

    /**
     * Set current date
     * @param {Date} date - Date to set
     */
    setCurrentDate(date) {
        this._currentDate = new Date(date);
        this.render();
    },

    /**
     * Update month display header
     * @private
     */
    _updateMonthDisplay() {
        const monthText = Utils.formatDate(this._currentDate, {
            month: 'long',
            year: 'numeric'
        });
        $('#currentMonth').text(monthText);
    },

    /**
     * Render calendar grid
     * @private
     */
    _renderCalendarGrid() {
        const year = this._currentDate.getFullYear();
        const month = this._currentDate.getMonth();

        // Get calendar data
        const firstDayOfWeek = Utils.getFirstDayOfMonth(this._currentDate);
        const daysInMonth = Utils.getDaysInMonth(this._currentDate);

        let calendarHTML = '';

        // Empty cells for days before month starts
        for (let i = 0; i < firstDayOfWeek; i++) {
            calendarHTML += '<div class="p-2"></div>';
        }

        // Calendar days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = this._formatDateString(year, month, day);
            const dayData = this._getDayData(dateStr);

            calendarHTML += this._renderDayCell(day, dateStr, dayData);
        }

        $('#calendarGrid').html(calendarHTML);
    },

    /**
     * Format date string in YYYY-MM-DD format
     * @param {number} year - Year
     * @param {number} month - Month (0-based)
     * @param {number} day - Day
     * @returns {string} Formatted date string
     * @private
     */
    _formatDateString(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    },

    /**
     * Get day data (expenses and total)
     * @param {string} dateStr - Date string
     * @returns {object} Day data object
     * @private
     */
    _getDayData(dateStr) {
        const dayExpenses = this._expenses.filter(expense => expense.date === dateStr);
        const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        return {
            expenses: dayExpenses,
            totalAmount,
            hasExpenses: dayExpenses.length > 0,
            expenseCount: dayExpenses.length
        };
    },

    /**
     * Render individual day cell
     * @param {number} day - Day number
     * @param {string} dateStr - Date string
     * @param {object} dayData - Day data object
     * @returns {string} HTML string for day cell
     * @private
     */
    _renderDayCell(day, dateStr, dayData) {
        const isToday = Utils.isToday(dateStr);
        const classes = this._getDayCellClasses(dayData.hasExpenses, isToday);

        return `
            <div class="${classes}" onclick="showDailyExpenses('${dateStr}')">
                <div class="font-bold text-base mb-1">${day}</div>
                ${dayData.hasExpenses ? this._renderDayExpenseInfo(dayData) : ''}
            </div>
        `;
    },

    /**
     * Get CSS classes for day cell
     * @param {boolean} hasExpenses - Whether day has expenses
     * @param {boolean} isToday - Whether day is today
     * @returns {string} CSS class string
     * @private
     */
    _getDayCellClasses(hasExpenses, isToday) {
        let classes = 'calendar-day rounded-lg cursor-pointer text-sm border ';

        if (hasExpenses) {
            classes += 'has-expenses ';
        } else {
            classes += 'bg-gray-50 hover:bg-gray-100 border-gray-200 ';
        }

        if (isToday) {
            classes += 'ring-2 ring-yellow-400 ';
        }

        return classes;
    },

    /**
     * Render expense information for a day
     * @param {object} dayData - Day data object
     * @returns {string} HTML string for expense info
     * @private
     */
    _renderDayExpenseInfo(dayData) {
        return `
            <div class="text-xs font-medium truncate w-full text-center">
                ${Utils.formatNumber(dayData.totalAmount)}
            </div>
            <div class="text-xs opacity-75">${dayData.expenseCount}</div>
        `;
    },

    /**
     * Get expenses for a specific date
     * @param {string} dateStr - Date string
     * @returns {Array} Array of expenses for the date
     */
    getExpensesForDate(dateStr) {
        return this._expenses.filter(expense => expense.date === dateStr);
    },

    /**
     * Check if a date has expenses
     * @param {string} dateStr - Date string
     * @returns {boolean} True if date has expenses
     */
    hasExpensesOnDate(dateStr) {
        return this._expenses.some(expense => expense.date === dateStr);
    },

    /**
     * Get total amount for a specific date
     * @param {string} dateStr - Date string
     * @returns {number} Total amount for the date
     */
    getTotalForDate(dateStr) {
        return this._expenses
            .filter(expense => expense.date === dateStr)
            .reduce((sum, expense) => sum + expense.amount, 0);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalendarModule;
} else if (typeof window !== 'undefined') {
    window.CalendarModule = CalendarModule;
}