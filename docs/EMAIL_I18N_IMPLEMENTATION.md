# Email Template Internationalization

## Overview
The email notification system has been fully internationalized to support both English and Arabic languages with proper RTL layout support.

## Implementation Details

### 1. Email Edge Function
**Location:** `supabase/functions/send-notification-email/`

The edge function now accepts a `language` parameter and generates emails in the specified language with proper RTL support for Arabic.

**Updated Interface:**
```typescript
interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  type: 'offer' | 'request_approval' | 'offer_status' | 'general';
  language?: 'en' | 'ar';  // NEW: Optional language parameter
  data?: any;
}
```

### 2. Translation Files
**Location:** `supabase/functions/send-notification-email/translations.ts`

Contains all email template translations for both languages:
- **Offer emails**: New offer notifications
- **Request approval emails**: Request status updates
- **Offer status emails**: Offer status changes
- **General notifications**: Platform announcements

### 3. Frontend Hook
**Location:** `src/hooks/useEmailNotification.ts`

A custom React hook that automatically includes the user's current language when sending emails:

```typescript
const { sendEmail } = useEmailNotification();

// Language is automatically included based on user's preference
await sendEmail({
  to: userEmail,
  subject: t('email.subject'),
  message: t('email.message'),
  type: 'offer',
  data: { price: 1000, delivery_time_days: 7 }
});
```

## Features

### RTL Support
- **Direction**: Emails automatically use `direction: rtl` for Arabic
- **Text alignment**: Content aligns right for Arabic, left for English
- **Font family**: Uses Cairo font for Arabic with proper fallbacks
- **Border styling**: Highlight boxes use right border for Arabic, left for English

### Email Types

#### 1. Offer Notification
- **English**: "🎯 New Offer Received"
- **Arabic**: "🎯 عرض جديد تم استلامه"
- Includes: Price, delivery time, view details button

#### 2. Request Approval
- **English**: "📋 Request Status Update"
- **Arabic**: "📋 تحديث حالة الطلب"
- Includes: Request title, status, view request button

#### 3. Offer Status
- **English**: "📊 Offer Status Update"
- **Arabic**: "📊 تحديث حالة العرض"
- Includes: Offer title, new status, view details button

#### 4. General Notification
- **English**: "📢 Platform Notification"
- **Arabic**: "📢 إشعار المنصة"
- Includes: Custom message, visit platform button

## Usage Examples

### Example 1: Send Offer Notification
```typescript
const { sendEmail } = useEmailNotification();

await sendEmail({
  to: 'client@example.com',
  subject: t('email.offer.subject'),
  message: t('email.offer.body'),
  type: 'offer',
  data: {
    price: 5000,
    currency: 'SAR',
    delivery_time_days: 14,
    platform_url: 'https://yourdomain.com/offers/123'
  }
});
```

### Example 2: Send Request Status Update
```typescript
await sendEmail({
  to: 'client@example.com',
  subject: t('email.request.subject'),
  message: t('email.request.statusChanged'),
  type: 'request_approval',
  data: {
    request_title: 'Construction Materials',
    status: 'approved',
    platform_url: 'https://yourdomain.com/requests/456'
  }
});
```

## Testing

### Test Arabic Email
```bash
curl -X POST https://jpxqywtitjjphkiuokov.supabase.co/functions/v1/send-notification-email \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "اختبار البريد الإلكتروني",
    "message": "هذه رسالة اختبار",
    "type": "general",
    "language": "ar"
  }'
```

### Test English Email
```bash
curl -X POST https://jpxqywtitjjphkiuokov.supabase.co/functions/v1/send-notification-email \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "message": "This is a test message",
    "type": "general",
    "language": "en"
  }'
```

## Backward Compatibility

The `language` parameter is **optional** and defaults to `'en'` if not provided. This ensures:
- Existing email-sending code continues to work
- Gradual migration to the new i18n system
- No breaking changes for current implementations

## Migration Guide

### Before (Hardcoded English)
```typescript
await supabase.functions.invoke('send-notification-email', {
  body: {
    to: userEmail,
    subject: 'New Offer Received',
    message: 'You have a new offer!',
    type: 'offer'
  }
});
```

### After (Internationalized)
```typescript
const { sendEmail } = useEmailNotification();

await sendEmail({
  to: userEmail,
  subject: t('email.offer.subject'),
  message: t('email.offer.body'),
  type: 'offer'
});
// Language is automatically included!
```

## Future Enhancements

### Potential Additions
1. **More email types**: KYC approval, payment confirmations, subscription updates
2. **Dynamic translations**: Pull translations from database for admin-configurable messages
3. **Email preferences**: Allow users to set language preference independently of UI language
4. **Template variables**: Support for dynamic content like `{{userName}}`, `{{companyName}}`
5. **Email analytics**: Track open rates and engagement by language

## Troubleshooting

### Issue: Arabic text not displaying correctly
**Solution**: Ensure the email client supports UTF-8 encoding. The Cairo font is loaded via web fonts in the email template.

### Issue: RTL layout not working
**Solution**: Check that the email client respects CSS `direction` property. Most modern email clients support this.

### Issue: Language not being passed
**Solution**: Make sure to use the `useEmailNotification` hook instead of calling the edge function directly.

## Related Files
- `supabase/functions/send-notification-email/index.ts` - Main edge function
- `supabase/functions/send-notification-email/translations.ts` - Email translations
- `src/hooks/useEmailNotification.ts` - Frontend hook
- `src/contexts/LanguageContext.tsx` - Language management
- `src/constants/locales/en-US.ts` - English translations
- `src/constants/locales/ar-SA.ts` - Arabic translations
