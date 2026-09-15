---
name: codebase-review
description: >-
  Perform a comprehensive, phase-wise codebase audit for the SpendSense app.
  Analyzes architecture, clean code, monetization compliance, performance,
  type safety, and UI/UX issues, saving a phase-wise breakdown in codebase_review.md.
---

# Codebase Review Skill

Use this skill to conduct an end-to-end audit of the SpendSense React Native / Expo codebase.
The audit must analyze all components, hooks, contexts, utilities, and configurations, outputting a phase-wise report in `codebase_review.md`.

## Audit Phases & Inspection Criteria

### Phase 1: Critical Bugs & Runtime Safety
- Inspect TypeScript type safety (any types, missing null checks).
- Check unhandled promise rejections, async error boundaries, and API error handling.
- Audit state mutations, loop memory leaks, and unmounted component state updates.

### Phase 2: Monetization Policy & Anti-Fraud Compliance (AGENTS.md)
- Verify manual item/receipt entry is **100% Ad-Free** (zero coins, zero ads).
- Confirm **Success-Only Coin Deduction** rules (deduct coins strictly upon success confirmation).
- Check Google AdMob rewarded ad limits (10 ads/day max, 30s cooldown).
- Ensure sign-in bonus (+100 coins) triggers correctly.

### Phase 3: Architecture & Clean Code Standards
- Ensure strict stylesheet separation (heavy `StyleSheet.create` definitions must reside in `.styles.ts`).
- Verify all component `.tsx` files stay concise and under **300 lines**.
- Check React Context re-render isolation and heavy hook dependencies.

### Phase 4: Performance & Optimization
- Check list virtualization (`FlatList`, `FlashList`) and missing `keyExtractor`.
- Audit heavy computations inside render cycles (ensure `useMemo` / `useCallback` usage).
- Verify AsyncStorage batching and heavy asset loading.

### Phase 5: UI/UX & Responsive Layout Safety
- Check safe area insets on iOS/Android (`useSafeAreaInsets`).
- Verify light/dark theme color variable usage (`colors` object).
- Check small device screen overflow handling (`ScrollView` wrappers, flex wrapping).

## Output File Format (`codebase_review.md`)

Save the results at the project root: `codebase_review.md` using the following format:

```markdown
# 📋 SpendSense Codebase Audit & Improvement Roadmap

Generated on: [DATE]

---

## 🔴 Phase 1: Critical Bugs & Runtime Safety
[List issues with file path, line numbers, description, and proposed fix]

---

## 🟡 Phase 2: Monetization & Policy Compliance (AGENTS.md)
[List compliance status and any violations]

---

## 🔵 Phase 3: Architecture & Clean Code Compliance
[List component size violations (>300 lines), inline StyleSheet violations, etc.]

---

## 🟢 Phase 4: Performance & Optimization
[List unmemoized heavy hooks, missing key extractors, re-render bottlenecks]

---

## 🟣 Phase 5: UI/UX & Layout Safety
[List hardcoded offsets, missing SafeAreas, theme bugs]

---

## 🎯 Summary & Action Items
[Summary table of total issues by severity: High, Medium, Low]
```

