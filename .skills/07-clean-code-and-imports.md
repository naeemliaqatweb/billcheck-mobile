# 07 - Clean Code & Import Optimization Skill

## Guidelines for Code Hygiene & Modular Refactoring

1. **Unused Import Removal (Mandatory Step)**
   - After splitting or refactoring any component file (e.g. `settings.tsx`), immediately audit and remove all unused imports.
   - Run `npx tsc --noUnusedLocals --noUnusedParameters --noEmit` to verify 0 unused variables or imports in refactored components.
   - Do not leave unused icons (from `lucide-react-native` or `@expo/vector-icons`), unused React hooks (`useRef`, `useEffect`), or unused helper functions.

2. **Clean Import Organization**
   - Group imports logically:
     1. React & React Native core packages.
     2. Third-party dependencies (`expo-*`, `lucide-react-native`, etc.).
     3. Contexts, utilities & constants.
     4. Custom UI components & sub-sections.
   - Avoid duplicate or circular imports.

3. **Judicious `React.memo` Usage**
   - Always wrap pure UI section components in `React.memo` with proper prop typing (`interface SectionProps`).

4. **Zero Warning Standard**
   - Maintain 0 TypeScript compilation errors and 0 unused variable warnings across refactored code modules.
