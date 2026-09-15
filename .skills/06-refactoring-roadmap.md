# Refactoring & Code Cleanup Roadmap (SpendSense)

This roadmap outlines the step-by-step modular cleanup strategy for decomposing monolithic screens in the codebase.

## Phase 1: Dashboard Modularization (`src/app/dashboard.tsx`) ✅
1. **Extract Custom Hook:** Create `src/features/dashboard/hooks/useDashboardData.ts` to manage metrics, month selection, insights, and privacy toggle state.
2. **Extract Components:**
   - `FinanceHeaderCard.tsx` (Credit card banner with Privacy Eye toggle)
   - `FinanceMetricsCards.tsx` (Expense, Income, Savings cards)
   - `SpendingTrendChartCard.tsx` (Bar chart & stats)
   - `AiInsightsCarouselCard.tsx` (AI tips & slider)
   - `RecentPurchasesSection.tsx` (Recent receipt cards list)

## Phase 2: Settings Screen Modularization (`src/app/settings.tsx`) ✅
1. **Extract Sub-Components:**
   - `ProfileCard.tsx` (Profile header & editor modal)
   - `FinanceSettingsCard.tsx` (Budget & income controls)
   - `AiConfigurationModal.tsx` (Gemini API key & model selection)
   - `BackupRestoreSection.tsx` (JSON export & import dialogs)
   - `PrivacySecuritySection.tsx` (App lock & privacy policy)

## Phase 3: Add-Item Form Clean-up (`src/app/add-item.tsx`) ✅
1. **Extract Sub-Components:**
   - `ReceiptStoreCategoryInputs.tsx`
   - `ReceiptItemsTable.tsx`
   - `VoiceScanParserModal.tsx`

## Phase 4: Context Slicing (`src/context/GroceryContext.tsx`) ✅
1. **Split Context into Focused Slices:**
   - `ReceiptsContext` (Receipts, Stores, Categories)
   - `SettingsContext` (Theme, Font Size, API Key, Location)
   - `ShoppingContext` (ComingItems, Reminders)

## Phase 5: Stats Screen Decomposition (`src/app/stats.tsx`) ✅
1. **Section 1 ✅:** Extract `src/hooks/useStatsActions.ts`
2. **Section 2 ✅:** Extract `StatsHeroFinanceCard.tsx`
3. **Section 3 ✅:** Extract `StatsTrendsChartSection.tsx`
4. **Section 4 ✅:** Extract `StatsBudgetSavingsSection.tsx`
5. **Section 5 ✅:** Extract `StatsCategorySection.tsx`
6. **Section 6 ✅:** Extract `StatsStoresPodiumCard.tsx` & Remove Google Maps Card
7. **Section 7 ✅:** Extract `StatsPeriodModal.tsx` & `StatsMartDetailsModal.tsx`

## Phase 6: AI Chat Screen Decomposition (`src/app/ai-chat.tsx`) ✅
1. **Section 1 ✅:** Extract `src/hooks/useAiChat.ts` (State, history load/save, voice recording, Gemini API orchestration)
2. **Section 2 ✅:** Extract `AiChatMessageList.tsx` (Chat bubbles, formatted markdown parser, share/copy actions)
3. **Section 3 ✅:** Extract `AiChatInputBar.tsx` & `AiChatSuggestionsBar.tsx` (Text input bar, mic recording trigger, prompt suggestion chips)

## Phase 7: Add Purchase & Edit Invoice Unification & Modularization (`src/app/edit-receipt.tsx` & `src/app/add-item.tsx`) ✅
1. **Section 1 ✅:** Extract `useEditReceipt.ts` custom hook.
2. **Section 2 ✅:** Extract shared `ReceiptFormFields.tsx` (Store, Category chips, Purchase Date).
3. **Section 3 ✅:** Extract shared `ReceiptItemsList.tsx` (Compact Item cards, Stepper buttons, Unit selector, Summary total box).

## Phase 8: Groceries List Modularization (`src/app/groceries.tsx`) ✅
1. **Section 1 ✅:** Extract `useGroceriesData.ts` custom hook.
2. **Section 2 ✅:** Extract `GroceriesHeaderCard.tsx` & `GroceriesSearchBar.tsx`.
3. **Section 3 ✅:** Extract `GroceriesReceiptsList.tsx` & `GroceriesCategoryFilter.tsx`.

## Phase 9: Reminders Screen Decomposition (`src/app/reminders.tsx`) ✅
1. **Section 1 ✅:** Extract `useRemindersActions.ts` custom hook.
2. **Section 2 ✅:** Extract `RemindersHeaderCard.tsx`, `RemindersAddFormCard.tsx`, & `RemindersListSection.tsx`.

## Phase 10: Coming Items Screen Decomposition (`src/app/coming-items.tsx`) ✅
1. **Section 1 ✅:** Extract `useComingItems.ts` custom hook.
2. **Section 2 ✅:** Extract sub-components (`ComingItemsQuickAddCard.tsx`, `ComingItemsListSection.tsx`, `ComingItemsEditModal.tsx`, `ComingItemsCheckoutModal.tsx`, `ComingItemsCheckoutBar.tsx`).

## Phase 11: High-Volume Benchmark & Memory Stress Testing (500,000 Items Scale) 🚀 ✅
1. **Stress Test Suite ✅:** Expand `src/utils/__tests__/performanceBenchmark.test.ts` to simulate 50,000 to 500,000 items over 5 years of usage.
2. **Monthly/Yearly Data Bucketing ✅:** Implement year/month index maps in `ReceiptsContext` so calculations query indexed buckets instead of array scanning 500,000 items.
3. **Async Chunked Storage ✅:** Handle large JSON payload chunking & compression to prevent AsyncStorage memory bottlenecks.

## Phase 12: Bulk Data Maintenance & Cleanup Utilities 🧹 ✅
1. **Bulk Delete by Date Range ✅:** Allow users to delete receipts by month, by year, or by custom date range (From Date -> To Date).
2. **Filter-Based Bulk Cleanup ✅:** Add "Bulk Delete Filtered Items" action in `groceries.tsx` search screen with safety confirmation modal.

## Phase 13: Unified Global Period Filter & State Sync 🔄 ✅
1. **Global Period Context Unification ✅:** Move `selectedFilterStartDate`, `selectedFilterEndDate`, and `resetPeriodFilter` into `ReceiptsContext` so all screens stay 100% in sync.
2. **Unified Component (`GlobalPeriodFilterModal.tsx`) ✅:** Single ultra-compact filter modal used across Dashboard, History, and Stats screens.
3. **Deprecation of Redundant Modals ✅:** Removed duplicate `GroceriesPeriodModal.tsx`, `StatsPeriodModal.tsx`, and `PeriodSelectionModal.tsx`.


