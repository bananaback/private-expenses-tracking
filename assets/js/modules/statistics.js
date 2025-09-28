// Statistics Module
// Handles budget calculations and statistics display

const StatisticsModule = {
    // Private properties
    _settings: {
        totalBudget: 0,
        startDate: null,
        endDate: null
    },

    /**
     * Initialize statistics module
     * @param {object} settings - Budget settings
     */
    init(settings) {
        this._settings = {
            totalBudget: parseFloat(settings.totalBudget) || 0,
            startDate: settings.startDate ? new Date(settings.startDate) : null,
            endDate: settings.endDate ? new Date(settings.endDate) : null
        };
        this.updateDisplay();
    },

    /**
     * Update budget settings
     * @param {object} settings - New settings
     */
    updateSettings(settings) {
        this._settings = {
            totalBudget: parseFloat(settings.totalBudget) || 0,
            startDate: settings.startDate ? new Date(settings.startDate) : null,
            endDate: settings.endDate ? new Date(settings.endDate) : null
        };
        this.updateDisplay();
    },

    /**
     * Update statistics display
     */
    updateDisplay() {
        const stats = this._calculateStatistics();
        this._updateStatCards(stats);
        this._updateWarnings(stats);
        this._updateRemainingCardColor(stats);
    },

    /**
     * Calculate all statistics
     * @returns {object} Statistics object
     * @private
     */
    _calculateStatistics() {
        if (!this._settings.startDate || !this._settings.endDate ||
            this._settings.startDate >= this._settings.endDate) {
            return this._getEmptyStats();
        }

        const expensesInRange = ExpenseManager.getExpensesByDateRange(
            this._settings.startDate,
            this._settings.endDate
        );

        const totalSpent = ExpenseManager.getTotalSpent(expensesInRange);
        const remaining = this._settings.totalBudget - totalSpent;

        const today = new Date();
        const daysRemaining = Utils.daysBetween(today, this._settings.endDate);
        const dailyBudget = daysRemaining > 0 ? remaining / daysRemaining : 0;

        return {
            totalBudget: this._settings.totalBudget,
            totalSpent,
            remaining,
            dailyBudget: Math.max(0, dailyBudget),
            daysRemaining,
            expenseCount: expensesInRange.length,
            averageDaily: this._calculateAverageDaily(expensesInRange),
            isOverBudget: remaining < 0,
            isLowBudget: dailyBudget < CONFIG.LOW_BUDGET_THRESHOLD && dailyBudget > 0
        };
    },

    /**
     * Get empty statistics object
     * @returns {object} Empty stats
     * @private
     */
    _getEmptyStats() {
        return {
            totalBudget: 0,
            totalSpent: 0,
            remaining: 0,
            dailyBudget: 0,
            daysRemaining: 0,
            expenseCount: 0,
            averageDaily: 0,
            isOverBudget: false,
            isLowBudget: false
        };
    },

    /**
     * Calculate average daily spending
     * @param {Array} expenses - Array of expenses
     * @returns {number} Average daily spending
     * @private
     */
    _calculateAverageDaily(expenses) {
        if (!expenses.length || !this._settings.startDate) return 0;

        const today = new Date();
        const daysPassed = Utils.daysBetween(this._settings.startDate, today);
        const totalSpent = ExpenseManager.getTotalSpent(expenses);

        return daysPassed > 0 ? totalSpent / daysPassed : 0;
    },

    /**
     * Update statistic cards display
     * @param {object} stats - Statistics object
     * @private
     */
    _updateStatCards(stats) {
        $('#remainingAmount').text(Utils.formatNumber(stats.remaining));
        $('#dailyBudget').text(Utils.formatNumber(stats.dailyBudget));
        $('#totalSpent').text(Utils.formatNumber(stats.totalSpent));
    },

    /**
     * Update warning messages
     * @param {object} stats - Statistics object
     * @private
     */
    _updateWarnings(stats) {
        const $warning = $('#daysRemaining');

        if (stats.daysRemaining <= 0) {
            $warning.removeClass('hidden').html(CONFIG.MESSAGES.BUDGET_EXCEEDED);
        } else if (stats.daysRemaining <= CONFIG.WARNING_DAYS_THRESHOLD) {
            const message = CONFIG.MESSAGES.BUDGET_WARNING.replace('{days}', stats.daysRemaining);
            $warning.removeClass('hidden').html(message);
        } else {
            $warning.addClass('hidden');
        }
    },

    /**
     * Update remaining amount card color based on budget status
     * @param {object} stats - Statistics object
     * @private
     */
    _updateRemainingCardColor(stats) {
        const $remainingCard = $('.stat-remaining');

        // Reset classes
        $remainingCard.removeClass('stat-remaining bg-red-500 bg-orange-500');

        if (stats.isOverBudget) {
            $remainingCard.addClass('bg-red-500');
        } else if (stats.isLowBudget) {
            $remainingCard.addClass('bg-orange-500');
        } else {
            $remainingCard.addClass('stat-remaining');
        }
    },

    /**
     * Get current statistics
     * @returns {object} Current statistics object
     */
    getCurrentStats() {
        return this._calculateStatistics();
    },

    /**
     * Get budget progress percentage
     * @returns {number} Progress percentage (0-100)
     */
    getBudgetProgress() {
        const stats = this._calculateStatistics();
        if (stats.totalBudget === 0) return 0;

        return Math.min(100, Math.max(0, (stats.totalSpent / stats.totalBudget) * 100));
    },

    /**
     * Check if budget is exceeded
     * @returns {boolean} True if budget is exceeded
     */
    isBudgetExceeded() {
        const stats = this._calculateStatistics();
        return stats.isOverBudget;
    },

    /**
     * Check if budget is running low
     * @returns {boolean} True if daily budget is low
     */
    isBudgetLow() {
        const stats = this._calculateStatistics();
        return stats.isLowBudget;
    },

    /**
     * Get days until budget end date
     * @returns {number} Number of days remaining
     */
    getDaysRemaining() {
        const stats = this._calculateStatistics();
        return stats.daysRemaining;
    },

    /**
     * Get recommended daily spending
     * @returns {number} Recommended daily amount to stay within budget
     */
    getRecommendedDailySpending() {
        const stats = this._calculateStatistics();
        return stats.dailyBudget;
    },

    /**
     * Get category breakdown for current period
     * @returns {object} Category statistics
     */
    getCategoryBreakdown() {
        if (!this._settings.startDate || !this._settings.endDate) {
            return {};
        }

        const expensesInRange = ExpenseManager.getExpensesByDateRange(
            this._settings.startDate,
            this._settings.endDate
        );

        return ExpenseManager.getStatistics(
            this._settings.startDate,
            this._settings.endDate
        ).categoryStats;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatisticsModule;
} else if (typeof window !== 'undefined') {
    window.StatisticsModule = StatisticsModule;
}