export const emailTranslations = {
  en: {
    offer: {
      title: "🎯 New Offer Received",
      message: "You have received a new offer for your request!",
      price: "Price",
      deliveryTime: "Delivery Time",
      days: "days",
      viewDetails: "View Offer Details",
      footer: "MWRD Procurement Platform - Connecting You to the Right Vendors"
    },
    request_approval: {
      title: "📋 Request Status Update",
      message: "Your procurement request status has been updated.",
      request: "Request",
      status: "Status",
      viewRequest: "View Request",
      footer: "MWRD Procurement Platform - Streamlining Your Procurement Process"
    },
    offer_status: {
      title: "📊 Offer Status Update",
      message: "There's an update on your offer status.",
      offer: "Offer",
      newStatus: "New Status",
      viewDetails: "View Details",
      footer: "MWRD Procurement Platform - Your Success Is Our Priority"
    },
    general: {
      title: "📢 Platform Notification",
      visitPlatform: "Visit Platform",
      footer: "MWRD Procurement Platform - Your Trusted Procurement Partner"
    }
  },
  ar: {
    offer: {
      title: "🎯 عرض جديد تم استلامه",
      message: "لقد تلقيت عرضًا جديدًا لطلبك!",
      price: "السعر",
      deliveryTime: "وقت التسليم",
      days: "أيام",
      viewDetails: "عرض تفاصيل العرض",
      footer: "منصة MWRD للمشتريات - نربطك بالموردين المناسبين"
    },
    request_approval: {
      title: "📋 تحديث حالة الطلب",
      message: "تم تحديث حالة طلب المشتريات الخاص بك.",
      request: "الطلب",
      status: "الحالة",
      viewRequest: "عرض الطلب",
      footer: "منصة MWRD للمشتريات - تبسيط عملية الشراء الخاصة بك"
    },
    offer_status: {
      title: "📊 تحديث حالة العرض",
      message: "هناك تحديث على حالة عرضك.",
      offer: "العرض",
      newStatus: "الحالة الجديدة",
      viewDetails: "عرض التفاصيل",
      footer: "منصة MWRD للمشتريات - نجاحك هو أولويتنا"
    },
    general: {
      title: "📢 إشعار المنصة",
      visitPlatform: "زيارة المنصة",
      footer: "منصة MWRD للمشتريات - شريكك الموثوق للمشتريات"
    }
  }
};

export type EmailLanguage = 'en' | 'ar';
export type EmailType = 'offer' | 'request_approval' | 'offer_status' | 'general';
