# SpendSense Agent Rules & Development Mandates

## ⚠️ MANDATORY DIRECTIVE FOR ALL TASKS & PROMPTS
Before responding to or executing ANY user request or building any feature, the agent MUST:
1. **READ ALL SKILLS in `.agents/skills/`**:
   - `codebase-review`: End-to-end quality audit, error boundaries, performance.
   - `monetization-policy`: 100% ad-free manual entry, success-only coin deduction, AdMob limits.
   - `modular-architecture`: Strict separation of UI, hooks, styles, and types.
2. **STRICT MODULAR ARCHITECTURE ENFORCEMENT**:
   - Every new feature and existing feature MUST be modular.
   - Screen `.tsx` files must be thin wrappers (< 300 lines).
   - Component `.tsx` files must be under 300 lines each.
   - Extract heavy business logic and state into custom hooks under `src/hooks/use<Feature>.ts`.
   - Extract ALL styles into dedicated files under `src/styles/<feature>.styles.ts`. NEVER put heavy `StyleSheet.create(...)` in `.tsx` files.
   - Define all types in `src/types/<feature>.types.ts`.
3. **MANDATORY VERIFICATION**:
   - ALWAYS run `npx tsc --noEmit` and verify 0 errors before finishing.

---

## 1. Monetization & Coin Economy Rules
- **Manual Item Entry is 100% Ad-Free**:
  - NEVER trigger interstitial ads, rewarded ads, or coin charges when a user manually types, edits, or saves grocery items/receipts.

- **Success-Only Coin Deduction Rules**:
  - Coins MUST be deducted ONLY when an operation completes successfully and results are confirmed by the user.
  - **AI Voice Parsing (10 🪙)**: Deduct 10 coins ONLY when the user clicks "Confirm & Use Items". Zero coins deducted if cancelled, closed, or if voice parsing fails.
  - **Camera & Gallery OCR Scan (10 🪙)**: Deduct 10 coins ONLY when receipt image analysis completes successfully. Zero coins deducted if cancelled or if scan fails.
  - **PDF Export (10 🪙)**: Deduct 10 coins ONLY when PDF file generation succeeds. Zero coins deducted if generation fails or is cancelled.
  - **CSV Data Export (10 🪙)**: Deduct 10 coins ONLY when CSV file export completes successfully. Zero coins deducted if failed or cancelled.
  - **AI Financial Insights (10 🪙)**: Deduct 10 coins ONLY when AI tips generation succeeds. Zero coins deducted if failed.
  - **AI Chat Assistant (10 🪙)**: Deduct 10 coins ONLY when AI reply is generated successfully. Zero coins deducted if failed.
  - **Bill Reminder Scheduling (10 🪙)**: Deduct 10 coins ONLY when a new bill reminder is successfully scheduled. Zero coins deducted if form validation fails.
  - **Manual Full Cloud Database Backup in Settings (100 🪙)**: Deduct 100 coins ONLY when manual full database JSON backup to Firebase Cloud Firestore completes successfully. Zero coins deducted if backup fails or is cancelled.

- **Google AdMob Anti-Ad-Fraud Policy & Reward Rules**:
  - Rewarded Ad Watch grants **+15 Coins (🪙)** on successful view. Zero coins awarded if ad fails to load or no-fill error occurs.
  - Limit rewarded ads to maximum **10 ads per day** per user.
  - Enforce a **30-second minimum cooldown** between rewarded ad watch requests.

---

## 2. User Rewards & Authentication
- **+100 Coins Sign-In Bonus**:
  - Award a 1-time **+100 Coins Bonus** when a user signs in or registers with Firebase / Google Authentication.
- **Progressive Daily Streak (No 7-Day Reset)**:
  - Daily streaks grow indefinitely (7 ➔ 8 ➔ 9...).
  - Award +100 Coins Super Bonus every 7-day milestone (Day 7, 14, 21, 28...).
  - 1-Day Grace Period protects the streak if 1 day is missed (`dayDiff === 2`). Only reset to 0 if 2+ days missed.

---

## 3. Modular Architecture & Code Rules
- **Strict Stylesheet Separation**:
  - NEVER place heavy `StyleSheet.create(...)` definitions inside component or screen `.tsx` files.
  - ALWAYS extract styles into a dedicated `.styles.ts` file under `src/styles/`.
  - Keep all component `.tsx` files concise, clean, and strictly under 300 lines.
