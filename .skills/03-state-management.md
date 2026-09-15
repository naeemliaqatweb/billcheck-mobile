# State Management & Data Persistence Guidelines (SpendSense)

## 1. Grocery Context State Architecture
- `GroceryContext` holds core application domain data (`receipts`, `categories`, `stores`, `budget`, `income`, `reminders`, `comingItems`, `notifications`, `profile`).
- Keep state updates immutable. Use functional updates (`setReceipts(prev => [newReceipt, ...prev])`).

## 2. 100% Complete Backup Export & Restore
- **Export Requirements:** JSON backup export MUST serialize 100% of application state:
  - Finance: `income`, `budget`, `categoryBudgets`, `currency`, `monthName`, `year`
  - Profile: `profileName`, `profileAge`, `profileGender`, `profileOccupation`, `profileAvatar`
  - Records: `receipts`, `comingItems`, `reminders`, `notifications`, `categories`, `stores`
  - AI & Chat: `customApiKey`, `aiModel`, `aiKeyTier`, `aiInsights`, `aiChatHistory`
  - Settings: `fontSizePreference`, `themePreference`, `menuDesignStyle`, feature toggles
  - Location: `country`, `city`, `area`, `locationEnabled`
- **Restore Requirements:** `restoreData` MUST restore all imported settings and overwrite local state correctly without discarding imported income, budget, or profile fields.

## 3. Storage Serialization & Migration
- Primary local storage key: `@grocery_app_data_v1`.
- Always wrap `AsyncStorage` read/write calls in `try/catch` with fallback default states to prevent startup white-screens.
