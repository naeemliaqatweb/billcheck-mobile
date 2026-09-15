# Security & Privacy Guidelines (SpendSense)

## 1. App Variant & Package ID Safety
- Live Production build package name MUST be `com.naeemreactnative.groceryapp`.
- Development builds MUST use suffix `.dev` (`com.naeemreactnative.groceryapp.dev`) strictly checked via `process.env.APP_VARIANT === 'development'`.
- Production EAS builds must NEVER inherit `.dev` package IDs.

## 2. Key & Secret Protection
- Never hardcode Gemini API keys or production endpoints in code.
- Custom user-provided Gemini keys must be validated via Gemini API check before saving and stored via `expo-secure-store` on native or `AsyncStorage` on web.
- Never log raw API keys, tokens, or biometric hashes in console logs.

## 3. Privacy & On-Device Processing
- All OCR receipt parsing, AI chat queries, and SMS transaction parsing MUST process data locally or via secure HTTPS API directly to Gemini endpoints.
- User financial data (income, budget, transactions) must stay 100% local on device unless explicitly exported as backup JSON by user action.
