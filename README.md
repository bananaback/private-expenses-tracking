# Personal Expenses Tracker - Modular Architecture

A Vietnamese-language expense tracking application with a clean, modular architecture for easy maintenance and feature extension.

## 🏗️ Project Structure

```
personal-expenses-tracker/
├── index.html                 # Original monolithic file (backup)
├── index-modular.html          # New modular entry point
├── README.md                   # This documentation
└── assets/
    ├── css/
    │   └── styles.css          # All application styles
    └── js/
        ├── config.js           # Configuration and constants
        ├── app.js              # Main application controller
        ├── modules/            # Feature modules
        │   ├── expenseManager.js    # Expense CRUD operations
        │   ├── statistics.js        # Budget calculations & stats
        │   ├── calendar.js          # Calendar rendering & navigation
        │   └── modal.js             # Daily expenses modal & filtering
        └── utils/              # Utility functions
            ├── helpers.js           # General helper functions
            └── storage.js           # localStorage management
```

## 🧩 Architecture Overview

### Core Modules

#### 1. **AppController** (`app.js`)
- **Purpose**: Main orchestrator that coordinates all modules
- **Responsibilities**: 
  - Application initialization
  - Event handling coordination
  - Module communication
  - Global state management
- **Key Methods**: `init()`, `addExpense()`, `deleteExpense()`, `showDailyExpenses()`

#### 2. **ExpenseManager** (`modules/expenseManager.js`)
- **Purpose**: Manages all expense-related operations
- **Responsibilities**:
  - CRUD operations for expenses
  - Category management
  - Data validation
  - Statistics calculations
- **Key Methods**: `addExpense()`, `deleteExpense()`, `getExpensesByDate()`, `getStatistics()`

#### 3. **StatisticsModule** (`modules/statistics.js`)
- **Purpose**: Handles budget calculations and statistics display
- **Responsibilities**:
  - Budget progress tracking
  - Daily spending calculations
  - Warning notifications
  - Statistics card updates
- **Key Methods**: `updateDisplay()`, `getCurrentStats()`, `getBudgetProgress()`

#### 4. **CalendarModule** (`modules/calendar.js`)
- **Purpose**: Manages calendar rendering and navigation
- **Responsibilities**:
  - Calendar grid rendering
  - Month navigation
  - Expense visualization on dates
  - Date-based interactions
- **Key Methods**: `render()`, `previousMonth()`, `nextMonth()`, `getExpensesForDate()`

#### 5. **ModalModule** (`modules/modal.js`)
- **Purpose**: Handles daily expenses modal and category filtering
- **Responsibilities**:
  - Modal display and hiding
  - Category filter chips
  - Expense list rendering
  - Filter interactions
- **Key Methods**: `show()`, `hide()`, `filterByCategory()`, `refresh()`

### Utility Modules

#### 6. **StorageManager** (`utils/storage.js`)
- **Purpose**: Manages all localStorage operations
- **Responsibilities**:
  - Data persistence
  - Import/export functionality
  - Data validation
  - Storage availability checks
- **Key Methods**: `saveData()`, `loadData()`, `exportData()`, `importData()`

#### 7. **Utils** (`utils/helpers.js`)
- **Purpose**: Provides common utility functions
- **Responsibilities**:
  - Number formatting
  - Date manipulations
  - Validation helpers
  - HTML sanitization
- **Key Methods**: `formatNumber()`, `formatDate()`, `validateExpense()`, `sanitizeHtml()`

#### 8. **CONFIG** (`config.js`)
- **Purpose**: Centralized configuration and constants
- **Contains**:
  - Application settings
  - Default categories
  - Messages in Vietnamese
  - Thresholds and limits

## 🔄 Data Flow

1. **Initialization**: `AppController.init()` → Load data → Initialize all modules
2. **User Action**: UI Event → `AppController` → Relevant Module
3. **Data Update**: Module updates data → `StorageManager.saveData()`
4. **UI Update**: Module triggers display updates → All affected modules re-render

## 🎯 Benefits of Modular Architecture

### ✅ **Maintainability**
- Each module has a single responsibility
- Easy to locate and fix bugs
- Clean separation of concerns

### ✅ **Extensibility**
- Add new features by creating new modules
- Existing modules remain untouched
- Easy to add new expense categories, statistics, or views

### ✅ **Testability**
- Each module can be tested independently
- Mock dependencies easily
- Clear input/output contracts

### ✅ **Code Reusability**
- Utility functions can be used across modules
- Consistent patterns throughout the application
- DRY (Don't Repeat Yourself) principles

### ✅ **Performance**
- Lazy loading potential
- Only load modules when needed
- Efficient memory usage

## 🚀 Adding New Features

### Example: Adding a New Statistics Chart

1. **Create new module**: `assets/js/modules/chartModule.js`
2. **Define interface**:
   ```javascript
   const ChartModule = {
       init(data) { /* Initialize charts */ },
       render(expenses) { /* Render charts */ },
       updateChart(newData) { /* Update display */ }
   };
   ```
3. **Integrate with AppController**:
   ```javascript
   // In AppController._updateDisplay()
   ChartModule.updateChart(ExpenseManager.getExpenses());
   ```
4. **Add HTML container** in `index-modular.html`
5. **Include script** in HTML file

### Example: Adding New Expense Categories

1. **Update CONFIG**: Add new categories to `DEFAULT_CATEGORIES`
2. **ExpenseManager** automatically handles new categories
3. **No other changes needed** - all modules adapt automatically

## 🔧 Configuration

### Key Settings in `config.js`:
- `DEFAULT_CATEGORIES`: Default expense categories
- `LOW_BUDGET_THRESHOLD`: When to show budget warnings  
- `WARNING_DAYS_THRESHOLD`: Days before deadline to warn
- `MESSAGES`: All user-facing text in Vietnamese

### Customization:
- **Colors**: Modify CSS custom properties in `styles.css`
- **Locale**: Change `CONFIG.LOCALE` for different number/date formatting
- **Storage**: Modify `CONFIG.STORAGE_KEY` for different localStorage key

## 🐛 Debugging

Each module includes console logging for debugging:
- Successful operations are logged
- Errors are logged with context
- Use browser dev tools to inspect module state

### Common Debug Commands:
```javascript
// Check application state
AppController.getState()

// Inspect expenses
ExpenseManager.getExpenses()

// Check current statistics
StatisticsModule.getCurrentStats()

// View modal state
ModalModule.getCurrentState()
```

## 🔄 Migration from Original

The original `index.html` file has been preserved as a backup. The new modular version (`index-modular.html`) maintains 100% compatibility with existing data and functionality while providing better architecture.

### Key Improvements:
- **Modular Structure**: Easy to maintain and extend
- **Better Error Handling**: Comprehensive try-catch blocks
- **Improved Performance**: Debounced updates and efficient rendering
- **Enhanced Security**: HTML sanitization and input validation
- **Better UX**: Smoother animations and interactions

## 📝 Development Guidelines

1. **Follow Single Responsibility Principle**: Each module should have one clear purpose
2. **Use Consistent Naming**: CamelCase for functions, UPPER_CASE for constants
3. **Document Functions**: Include JSDoc comments for all public methods
4. **Handle Errors Gracefully**: Always include error handling
5. **Maintain Backward Compatibility**: Don't break existing functionality
6. **Test Changes**: Verify all features work after modifications

---

**Note**: Always test thoroughly after making changes. The modular architecture makes testing easier, but ensure all modules work together correctly.