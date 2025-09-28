// Application Configuration and Constants
const CONFIG = {
    // Application settings
    APP_NAME: 'Quản lý chi tiêu',
    VERSION: '1.0.0',

    // Storage keys
    STORAGE_KEY: 'expenseTracker',

    // Default categories in Vietnamese
    DEFAULT_CATEGORIES: [
        'Ăn Uống',
        'Di Chuyển',
        'Mua Sắm',
        'Giải Trí',
        'Hóa Đơn',
        'Sức Khỏe',
        'Khác'
    ],

    // Date and locale settings
    LOCALE: 'vi-VN',

    // Budget thresholds
    LOW_BUDGET_THRESHOLD: 50000,
    WARNING_DAYS_THRESHOLD: 7,

    // UI settings
    CALENDAR_MIN_HEIGHT: 80,
    ANIMATION_DURATION: 200,

    // File export settings
    EXPORT_FILE_PREFIX: 'expenses-',

    // Messages in Vietnamese with survival humor
    MESSAGES: {
        DELETE_CONFIRM: 'Xóa luôn hả? Nghĩ kỹ kẻo tiếc nha! 🤔',
        IMPORT_CONFIRM: 'Dữ liệu cũ sẽ bay màu hết. Chơi tiếp không? 😎',
        VALIDATION_ERROR: 'Thiếu thông tin rồi! Điền đủ mô tả với số tiền đi bạn êi~ 😅',
        IMPORT_SUCCESS: 'Khôi phục dữ liệu ngon lành! 🎉',
        IMPORT_ERROR: 'File này lỗi rồi, thử lại đi bạn êi~ 😥',
        NO_EXPENSES_DAY: 'Hôm nay chưa ghi đồng nào, ví vẫn an toàn 😏',
        NO_EXPENSES_CATEGORY: 'Mục này trống trơn, chưa tốn xu nào',
        BUDGET_EXCEEDED: '⚠️ Hết sạch ngân sách! Chuẩn bị sống bằng mì gói thôi 🍜😂',
        BUDGET_WARNING: '⏰ Còn cầm cự được {days} ngày nữa, ráng sống sót nha chiến hữu! 💪',
        ALL_CATEGORIES: 'Tất cả',
        EXPENSE_ADDED: 'Ghi nhận tổn thất thành công! 😭',
        EXPENSE_DELETED: 'Đã xóa tổn thất! 🗑️',
        EXPORT_SUCCESS: 'Sao lưu thành công! 💾',
        EXPORT_ERROR: 'Lỗi khi sao lưu dữ liệu 😵',
        APP_ERROR: 'Ứng dụng gặp lỗi, thử tải lại trang 🔄',
        NO_EXPENSE_FOUND: 'Không tìm thấy tổn thất để xóa',
        MODAL_ERROR: 'Lỗi khi hiển thị chi tiêu trong ngày'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}