// Storage Manager for Expense Tracker
// Handles all localStorage operations

const StorageManager = {
    /**
     * Save application data to localStorage
     * @param {object} data - Data object to save
     */
    saveData(data) {
        try {
            const dataToSave = {
                expenses: data.expenses || [],
                categories: data.categories || CONFIG.DEFAULT_CATEGORIES,
                settings: {
                    totalBudget: data.settings?.totalBudget || '',
                    startDate: data.settings?.startDate || Utils.getTodayString(),
                    endDate: data.settings?.endDate || '2025-10-06'
                },
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    },

    /**
     * Load application data from localStorage
     * @returns {object} Loaded data object
     */
    loadData() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (!saved) {
                return this.getDefaultData();
            }

            const data = JSON.parse(saved);

            // Ensure data structure is valid
            return {
                expenses: Array.isArray(data.expenses) ? data.expenses : [],
                categories: Array.isArray(data.categories) ? data.categories : CONFIG.DEFAULT_CATEGORIES,
                settings: {
                    totalBudget: data.settings?.totalBudget || '',
                    startDate: data.settings?.startDate || Utils.getTodayString(),
                    endDate: data.settings?.endDate || '2025-10-06'
                }
            };
        } catch (error) {
            console.error('Error loading data:', error);
            return this.getDefaultData();
        }
    },

    /**
     * Get default data structure
     * @returns {object} Default data object
     */
    getDefaultData() {
        return {
            expenses: [],
            categories: [...CONFIG.DEFAULT_CATEGORIES],
            settings: {
                totalBudget: '',
                startDate: Utils.getTodayString(),
                endDate: '2025-10-06'
            }
        };
    },

    /**
     * Clear all data from localStorage
     */
    clearData() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    },

    /**
     * Export data as JSON blob
     * @param {object} data - Data to export
     * @returns {Blob} JSON blob for download
     */
    exportData(data) {
        const exportData = {
            ...data,
            exportDate: new Date().toISOString(),
            version: CONFIG.VERSION
        };

        return new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
    },

    /**
     * Import data from JSON string
     * @param {string} jsonString - JSON string to import
     * @returns {object} Parsed data object
     * @throws {Error} If data format is invalid
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            // Validate imported data structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data format');
            }

            return {
                expenses: Array.isArray(data.expenses) ? data.expenses : [],
                categories: Array.isArray(data.categories) ? data.categories : CONFIG.DEFAULT_CATEGORIES,
                settings: {
                    totalBudget: data.settings?.totalBudget || '',
                    startDate: data.settings?.startDate || Utils.getTodayString(),
                    endDate: data.settings?.endDate || '2025-10-06'
                }
            };
        } catch (error) {
            throw new Error(CONFIG.MESSAGES.IMPORT_ERROR);
        }
    },

    /**
     * Check if localStorage is available
     * @returns {boolean} True if localStorage is available
     */
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
} else if (typeof window !== 'undefined') {
    window.StorageManager = StorageManager;
}