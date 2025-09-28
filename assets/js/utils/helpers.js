// Utility Functions for Expense Tracker

const Utils = {
    /**
     * Format number to Vietnamese locale
     * @param {number} num - Number to format
     * @returns {string} Formatted number string
     */
    formatNumber(num) {
        return Math.round(num).toLocaleString(CONFIG.LOCALE);
    },

    /**
     * Get today's date in YYYY-MM-DD format
     * @returns {string} Today's date string
     */
    getTodayString() {
        return new Date().toISOString().split('T')[0];
    },

    /**
     * Format date to Vietnamese locale
     * @param {string|Date} date - Date to format
     * @param {object} options - Intl.DateTimeFormat options
     * @returns {string} Formatted date string
     */
    formatDate(date, options = {}) {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString(CONFIG.LOCALE, options);
    },

    /**
     * Calculate days between two dates
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {number} Number of days
     */
    daysBetween(startDate, endDate) {
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    },

    /**
     * Generate unique ID based on timestamp
     * @returns {number} Unique ID
     */
    generateId() {
        return Date.now();
    },

    /**
     * Deep clone an object
     * @param {object} obj - Object to clone
     * @returns {object} Cloned object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Sanitize HTML string to prevent XSS
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Validate expense data
     * @param {object} expense - Expense object to validate
     * @returns {boolean} True if valid
     */
    validateExpense(expense) {
        return expense &&
            expense.description &&
            expense.description.trim() !== '' &&
            expense.amount &&
            !isNaN(expense.amount) &&
            expense.amount > 0;
    },

    /**
     * Get the first day of month (Monday = 0)
     * @param {Date} date - Date object
     * @returns {number} Day of week (0-6, Monday = 0)
     */
    getFirstDayOfMonth(date) {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        return (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
    },

    /**
     * Get number of days in a month
     * @param {Date} date - Date object
     * @returns {number} Number of days in month
     */
    getDaysInMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    },

    /**
     * Check if a date is today
     * @param {string} dateStr - Date string in YYYY-MM-DD format
     * @returns {boolean} True if date is today
     */
    isToday(dateStr) {
        return dateStr === this.getTodayString();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} else if (typeof window !== 'undefined') {
    window.Utils = Utils;
}