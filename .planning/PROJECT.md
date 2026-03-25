# Project: Badminton Court Booking System

## What This Is
A premium, mobile-responsive web application for booking badminton (and tennis) courts. Inspired by the Tennis Court booking system, it provides a seamless flow from OTP-based login to visual court selection and multi-channel payment.

## Core Value
To provide users with an effortless booking experience and administrators with robust tools to manage court allotments, pricing, and transactions.

## Context
- **Reference**: https://crystalsports-booking.kegroup.co.th/ (Rebranded to Tennis Court)
- **Target OS**: Windows (Development), Mobile/Web (End-users)
- **Language**: Thai (primary), English (secondary)
- **Design Style**: Premium, modern, dark-themed (glassmorphism/vibrant accents).

## Requirements

### Active
- [ ] OTP-based Login system.
- [ ] Member profile collection (post-login).
- [ ] Visual Court Map for selection (Badminton/Tennis).
- [ ] 14-day advance booking window.
- [ ] Hourly time slots (e.g., 13:00, 14:00).
- [ ] Checkout flow with a 15-minute payment timer.
- [ ] Multiple payment integrations (PromptPay QR, Wallet, Credit Card, Alipay, WeChat).
- [ ] Admin Dashboard: Allotment management, Pricing configuration, Calendar view, Transaction logs.
- [ ] Mobile responsive UI.

### Validated
(None yet - starting greenfield)

### Out of Scope
- [ ] Physical hardware integration (e.g., smart locks, lighting control) - *Phase 2/Future*.
- [ ] Mobile App (iOS/Android) stores - *Focus on PWA/Web first*.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| UTF-8 Encoding | Global Thai language support requirement. | Set |
| Vite + React | Modern, fast development and PWA-ready. | Proposed |
| Vanilla CSS | Maximum flexibility for premium design. | Proposed |

---
*Last updated: 2025-03-25 after initialization*
