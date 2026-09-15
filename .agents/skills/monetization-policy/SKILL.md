---
name: monetization-policy
description: SpendSense monetization rules, success-only coin deduction policy, 100% ad-free manual entry, and Google AdMob anti-fraud compliance limits.
---

# Monetization Policy & Coin Economy Guidelines

This skill enforces SpendSense's core monetization and coin economy rules across all application features.

## Core Rules

1. **100% Ad-Free Manual Entry**
   - Manual item entry, receipt editing, and manual saving MUST remain completely free of ads (no interstitial ads, no coin charges).

2. **Success-Only Coin Deduction Rules**
   - Deduct coins ONLY when an action finishes with a **100% SUCCESS** status and user confirmation.
   - **Voice OCR Parsing**: Deduct 10 coins ONLY on "Confirm & Use Items". 0 coins if cancelled or failed.
   - **Camera & Gallery OCR**: Deduct 10 coins ONLY on successful receipt extraction. 0 coins if cancelled or failed.
   - **PDF Export**: Deduct 10 coins ONLY when PDF file generation completes. 0 coins if failed.
   - **CSV Data Export**: Deduct 10 coins ONLY when CSV file export completes. 0 coins if failed.
   - **AI Financial Insights**: Deduct 10 coins ONLY when AI tips generation succeeds. 0 coins if failed.
   - **AI Chat Assistant**: Deduct 10 coins ONLY when AI reply is generated successfully. 0 coins if failed.
   - **Bill Reminders**: Deduct 10 coins ONLY when a new reminder is saved to database. 0 coins if validation fails.
   - **Manual Full Cloud Database Backup (Settings)**: Deduct 100 coins ONLY when full JSON backup completes successfully to Firebase. 0 coins if failed or cancelled.

3. **AdMob Compliance & Rate Limiting**
   - **Ad Reward Amount**: Award **+15 Coins (🪙)** per successful ad view. Zero coins awarded if ad fails to load or error occurs.
   - Daily limit: Max **10 rewarded video ads** per user per day.
   - Minimum cooldown: **30 seconds** between ad views to prevent invalid traffic.

4. **Sign-In Welcome Bonus**
   - Award **+100 Coins** to any user signing in or registering with Firebase / Google Authentication.
