# Styling & UI Consistency Rules (SpendSense)

## 1. Dynamic Font Scaling System
- All font sizes MUST use `getFontSize(baseSize, fontSizePref)` to honor user font preferences (`small`, `normal`, `medium`, `large`).
- Avoid hardcoded static font size numbers in inline styles or raw StyleSheet declarations.

## 2. Dynamic Theme Token Access
- Colors MUST be accessed dynamically through `colors` provided by `useGroceryContext()`.
- Support both Light and Dark modes seamlessly. Avoid hardcoding static `#ffffff` or `#000000` except where explicit high-contrast cards require it.

## 3. Compact Price Formatting & Privacy Masking
- Finance values (Income, Savings, Expenses) support compact `k`/`M` formatting (`formatCompactCurrency`).
- Expense & Credit Card amounts display full currency (`formatCurrency`) unless compact is requested.
- Support privacy masking state (`isPriceVisible` toggle with `••••••` fallback).

## 4. Source Badge Icons
- Items and receipts display entry source icons:
  - 📷 `Camera` (Blue) -> Invoice Scan
  - 🎙️ `Mic` (Purple) -> AI Voice
  - ✏️ `PenTool` (Slate) -> Manual Entry
