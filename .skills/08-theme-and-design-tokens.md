# Theme & Design Tokens Rule

This skill rule enforces centralized theme color management and prohibits hardcoded hex colors across all components and style files in SpendSense.

---

## 🎨 Core Guidelines

### 1. No Hardcoded Color Strings
- **PROHIBITED:** Never hardcode hex colors (e.g., `#16a34a`, `#09090b`, `#ef4444`, `#e4e4e7`) directly inside component inline styles or `StyleSheet.create()`.
- **REQUIRED:** Always use dynamic theme tokens provided by `useGroceryContext().colors` or `Colors.light`/`Colors.dark` from `src/constants/theme.ts`.

```tsx
// ❌ WRONG (Hardcoded Color)
<Text style={{ color: '#16a34a' }}>Total Spending</Text>

// ✅ CORRECT (Central Theme Token)
const { colors } = useGroceryContext();
<Text style={{ color: colors.primary }}>Total Spending</Text>
```

---

### 2. Global CSS Variables (`src/global.css`)
All primary color tokens are mirrored as CSS custom properties in `src/global.css`:

```css
:root {
  --color-primary: #16a34a;
  --color-primary-light: rgba(22, 163, 74, 0.1);
  --color-background: #ffffff;
  --color-background-secondary: #f4f4f5;
  --color-text: #09090b;
  --color-text-secondary: #71717b;
  --color-border: #e4e4e7;
  --color-card: #ffffff;
  --color-danger: #ef4444;
  --color-warning: #d97706;
}

[data-theme='dark'] {
  --color-primary: #22c55e;
  --color-primary-light: rgba(34, 197, 94, 0.2);
  --color-background: #09090b;
  --color-background-secondary: #18181b;
  --color-text: #fafafa;
  --color-text-secondary: #a1a1aa;
  --color-border: #27272a;
  --color-card: #18181b;
  --color-danger: #f87171;
  --color-warning: #f59e0b;
}
```

---

### 3. Adding New Colors
When introducing a new color or design state:
1. Update `Colors.light` and `Colors.dark` in `src/constants/theme.ts`.
2. Add corresponding `--color-*` CSS variable to `src/global.css`.
3. Never bypass central theme configuration.
