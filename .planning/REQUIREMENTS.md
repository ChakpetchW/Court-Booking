# Requirements: Badminton Court Booking System

## Functional Requirements (FR)

### 1. Authentication & User Management
- **FR-1.1: OTP Login**: Users enter mobile number and receive/verify OTP.
- **FR-1.2: Profile Registration**: New users enter name, email, etc., after first login.
- **FR-1.3: Profile View**: Users can view their profile and booking history.

### 2. Booking Flow
- **FR-2.1: Court Map**: Visual layout of courts for intuitive selection.
- **FR-2.2: Date Selection**: Calendar limited to 14 days in advance.
- **FR-2.3: Time Selection**: Fixed hourly slots only.
- **FR-2.4: Availability**: Real-time checking to prevent double-booking.

### 3. Checkout & Payment
- **FR-3.1: Booking Summary**: Confirmation screen before payment.
- **FR-3.2: Payment Timer**: 15-minute countdown to complete payment.
- **FR-3.3: QR Payment**: PromptPay QR generation.
- **FR-3.4: Multi-Channel**: Support for Wallet, CC, Alipay, WeChat Pay.

### 4. Admin Dashboard (Backend)
- **FR-4.1: Allotment Control**: Ability to open/close specific courts/times.
- **FR-4.2: Pricing Engine**: Set different prices per court and per hour.
- **FR-4.3: Calendar View**: Grouped by court to see scheduled bookings.
- **FR-4.4: Transaction Logs**: Exportable list of all payments and bookings.

## Non-Functional Requirements (NFR)

### 1. UI/UX
- **NFR-1.1: Mobile Responsive**: Must work perfectly on mobile devices.
- **NFR-1.2: Premium Aesthetic**: Dark theme, high-quality visuals, smooth transitions.
- **NFR-1.3: Thai Support**: Mandatory UTF-8 and Thai localization.

### 2. Performance
- **NFR-2.1: Load Time**: Landing page under 2s.
- **NFR-2.2: Concurrency**: Handle multiple users booking simultaneously with locking.

### 3. Compliance
- **NFR-3.1: Privacy**: PDPA/GDPR compliance for member data.

## User Interface Requirements
- **Bottom Navigation**: (Book, Top-up, History, Profile) for mobile users.
- **Tennis Court Image**: Interactive image for court selection.
