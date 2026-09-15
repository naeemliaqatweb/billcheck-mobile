# Architectural & Coding Standards (SpendSense Grocery App)

## 1. Monolithic Screen Decomposition
- Large screens (`dashboard.tsx`, `settings.tsx`, `add-item.tsx`, `groceries.tsx`) MUST be decomposed into small, focused sub-components.
- Keep main screen files under 300 lines of code. Extract UI sections into sub-components (e.g., `src/features/dashboard/components/FinanceHeader.tsx`, `src/features/dashboard/components/SpendingTrendChart.tsx`).
- Extract state management and business logic into dedicated hooks (e.g., `useDashboardMetrics`, `useSettingsBackup`).

## 2. Feature-First Directory Structure
Organize new and refactored code by feature boundaries:
```
src/
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── settings/
│   ├── receipt-scan/
│   └── ai-assistant/
├── components/       # Shared UI primitives (AppBottomSheet, AppButton, AppInput)
├── context/          # Global application state (GroceryContext)
├── services/         # Device APIs (SMS, Location, Notifications)
├── styles/           # Centralized dynamic style generators
└── utils/            # Pure helper utilities (helpers.ts, ai.ts, csv.ts)
```

## 3. Platform-Specific Overrides (Expo Web Safety)
- Native-only C++/Java libraries (`expo-secure-store`, `expo-location`, `react-native-maps`, `react-native-google-mobile-ads`) MUST have platform-specific overrides (`*.web.ts` / `*.web.tsx`).
- Top-level static imports of native-only modules must be avoided; use dynamic `require` guarded by `Platform.OS !== 'web'` when platform files are not used.

## 4. Strict TypeScript Standards
- Enable strict typing. Avoid using `any` or loose type assertions.
- Explicitly define interfaces for `Receipt`, `ReceiptItem`, `ComingItem`, `Reminder`, `AppNotification`, and state payloads.
