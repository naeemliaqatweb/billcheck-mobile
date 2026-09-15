---
name: modular-architecture
description: SpendSense modular architecture guidelines. Enforces strict separation of UI components, custom hooks, styles, and types. All .tsx files must stay strictly under 300 lines.
---

# Modular Architecture & Clean Code Guidelines

Every new feature and refactored existing feature in SpendSense MUST strictly follow this 5-part modular structure.

## 1. Directory & File Structure Pattern
When creating or refactoring a feature (e.g. `installment-stats`, `group-splitter`, `budget-planner`):

```text
src/
├── types/<feature>.types.ts         # TypeScript interfaces, types, enums
├── hooks/use<Feature>.ts            # Business logic, state, AsyncStorage, computations
├── styles/<feature>.styles.ts       # StyleSheet.create definitions ONLY
├── components/<feature>/            # UI subcomponents (each <300 lines)
│   ├── <Feature>Card.tsx
│   ├── <Feature>Modal.tsx
│   └── <Feature>Header.tsx
└── app/<feature>.tsx (or tab)       # Screen shell composing components (<300 lines)
```

## 2. Strict Rules & Constraints
1. **Never exceed 300 lines per `.tsx` file**:
   - Decompose screens into small, single-responsibility subcomponents.
   - Extract cards, modals, lists, and header rows into their own `.tsx` files under `src/components/<feature>/`.

2. **Zero heavy inline `StyleSheet.create` in components**:
   - ALL styles MUST be extracted to `src/styles/<feature>.styles.ts` or `src/styles/<component>.styles.ts`.
   - Never write massive stylesheet objects at the bottom of `.tsx` files.

3. **Separate Business Logic into Custom Hooks**:
   - Keep screen and component files purely presentational.
   - Place data fetching, filtering, calculations, and modal state inside `src/hooks/use<Feature>.ts`.

4. **Pure TypeScript Types**:
   - Never use `any`. Always declare specific interfaces and types in `src/types/<feature>.types.ts`.

5. **Always Verify with TypeScript**:
   - Run `npx tsc --noEmit` to guarantee 0 compiler errors before completing any task.
