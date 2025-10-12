# Admin Dashboard i18n - Complete Translation Plan

This document tracks all missing translation keys identified across admin dashboard pages.

## ✅ Phase 1: Performance Monitor (COMPLETE)
All performance.* keys added including:
- Performance monitoring metrics
- Core Web Vitals
- System health indicators
- Device capabilities
- Bundle analysis
- Network performance
- Optimization recommendations

## 🔄 Phase 2: Category Management (IN PROGRESS)
**Keys needed:** admin.categoryManagement.*
- Tree/Table views
- CRUD operations
- Bulk actions
- CSV export
- Status filters
- Access control messages

## 🔄 Phase 3: Admin Overview (IN PROGRESS)
**Keys needed:** admin.overview.*
- Quick actions grid
- Platform metrics cards
- Performance charts
- System health indicators
- Recent activity feeds

## 🔄 Phase 4: KYC, Email, Push, Security (IN PROGRESS)
**Keys needed:**
- admin.kyc.* - KYC review workflow
- admin.email.* - Email campaign manager
- admin.pushNotifications.* - Push notification system
- admin.security.* (expand) - Real-time security monitor

## 🔄 Phase 5: Shared Components (IN PROGRESS)
- Audit remaining admin UI components
- Ensure all placeholders, aria-labels, alt text use t()

## ⏳ Phase 6: Validation & CI (PENDING)
- Update scripts/validate-i18n.js
- Add ESLint rules for hardcoded strings
- Integrate CI checks

## ⏳ Phase 7: Documentation (PENDING)
- Translation guidelines
- Admin translation reference
- Contributor guide

## Total Keys to Add: ~350+

### Performance Monitor: 80+ keys
### Category Management: 60+ keys
### Admin Overview: 30+ keys  
### KYC Review: 50+ keys
### Email Campaigns: 40+ keys
### Push Notifications: 50+ keys
### Security Monitor: 40+ keys

## Implementation Status
- [x] Phase 1: Performance keys identified
- [ ] Phase 2-5: Implementation in progress
- [ ] All translation keys added to en-US.ts
- [ ] All translation keys added to ar-SA.ts
- [ ] Validation script updated
- [ ] CI integration complete
- [ ] Documentation written
