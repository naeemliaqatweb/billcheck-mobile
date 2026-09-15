# Performance Optimization Guidelines (SpendSense)

## 1. Judicious Sub-Component Memoization (`React.memo`)
- Use `React.memo` **prudently and selectively** on pure UI sub-components or heavy list items where re-renders are genuinely expensive.
- **Do NOT wrap components blindly**: Ensure props are primitive or stabilized via `useMemo` / `useCallback` so `React.memo` shallow comparison does not alter dynamic UI behavior or create comparison overhead.
- Test UI interactions after adding `React.memo` to verify 100% accurate visual state updates.

## 2. Calculation & Callback Memoization (`useMemo` & `useCallback`)
- Wrap heavy list filters, monthly aggregations, and derived metrics (`totalSpent`, `income - totalSpent`, category totals) in `useMemo`.
- Wrap event handler functions passed as props to child components in `useCallback`.

## 3. List Rendering Optimization
- Use `FlatList` with `keyExtractor` for receipt lists, shopping items, and reminder cards.
- Specify `getItemLayout` or `initialNumToRender` for long scrollable transaction lists to maintain 60 FPS scrolling.

## 4. Screen Render Time Benchmarking
- Target screen mount / initial render time: `< 50ms`.
- Utilize performance timing utility (`measureRenderTime` / performance benchmark test suite) to track screen render duration for Home/Dashboard, History, Stats, and Settings tabs.

## 5. AdMob & Heavy Module Lazy Loading
- AdMob banners and Interstitials (`AdmobBanner`, `showInterstitialAd`) MUST be wrapped in platform guards (`Platform.OS !== 'web'`) and fail gracefully without crashing web builds.
- Dynamic asset imports or heavy SVG icons should be cached to prevent render frame drops.
