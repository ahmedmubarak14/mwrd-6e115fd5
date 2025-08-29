import { Link } from "react-router-dom";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { Twitter, Linkedin, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { AnimatedCard } from "@/components/ui/animations/MicroInteractions";

export const Footer = () => {
  const languageContext = useOptionalLanguage();
  const language = languageContext?.language || 'en';
  const t = languageContext?.t || ((key: string) => {
    // Fallback translations
    const fallbacks: { [key: string]: string } = {
      'landing.footer.taglineText': language === 'ar' 
        ? 'منصة ذكية تربط الشركات بأفضل الموردين في المملكة العربية السعودية'
        : 'Smart platform connecting businesses with top suppliers in Saudi Arabia',
      'landing.footer.company': language === 'ar' ? 'الشركة' : 'Company',
      'landing.footer.contactUsBtn': language === 'ar' ? 'اتصل بنا' : 'Contact Us',
      'landing.footer.blog': language === 'ar' ? 'المدونة' : 'Blog',
      'nav.navigation': language === 'ar' ? 'التنقل' : 'Navigation',
      'landing.footer.whyStart': language === 'ar' ? 'لماذا البداية معنا' : 'Why Start With Us',
      'landing.footer.whyMove': language === 'ar' ? 'لماذا الانتقال إلينا' : 'Why Move To Us',
      'landing.footer.pricingSection': language === 'ar' ? 'الأسعار' : 'Pricing',
      'landing.footer.supportSection': language === 'ar' ? 'الدعم' : 'Support',
      'landing.footer.support': language === 'ar' ? 'المساعدة والدعم' : 'Help & Support',
      'landing.footer.helpCenterLink': language === 'ar' ? 'مركز المساعدة' : 'Help Center',
      'landing.footer.documentation': language === 'ar' ? 'التوثيق' : 'Documentation',
      'landing.footer.systemStatus': language === 'ar' ? 'حالة النظام' : 'System Status',
      'landing.footer.privacyPolicy': language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
      'landing.footer.termsOfService': language === 'ar' ? 'شروط الخدمة' : 'Terms of Service',
      'landing.footer.rights': language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.',
      'landing.footer.followUs': language === 'ar' ? 'تابعنا:' : 'Follow us:'
    };
    return fallbacks[key] || key.split('.').pop() || key;
  });
  const isRTL = language === 'ar';

  return (
    <footer className="bg-gradient-to-r from-[#004F54] via-[#102C33] to-[#66023C] backdrop-blur-xl border-t border-white/10">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${isRTL ? 'rtl-grid' : ''}`}>
          
          {/* Column 1: Logo & Tagline */}
          <AnimatedCard hoverEffect="lift" className="col-span-1 lg:col-span-1 bg-transparent border-0 p-0">
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                  alt="MWRD Logo"
                  className="h-12 w-auto"
                />
                <span className="text-2xl font-bold text-white">MWRD</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed max-w-xs">
                {t('landing.footer.taglineText')}
              </p>
              
              {/* Contact Info */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Mail size={16} />
                  <span>info@mwrd.com</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Phone size={16} />
                  <span>+966 11 123 4567</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <MapPin size={16} />
                  <span>{language === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</span>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Column 2: Navigation Links */}
          <AnimatedCard hoverEffect="glow" className="bg-transparent border-0 p-0">
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="text-white font-semibold mb-6 text-lg">
                {t('nav.navigation')}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/why-start-with-mwrd" 
                    className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline">{t('landing.footer.whyStart')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/what-makes-us-unique" 
                    className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline">{language === 'ar' ? 'ما يميزنا' : 'What Makes Us Unique'}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/why-move-to-mwrd" 
                    className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline">{t('landing.footer.whyMove')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pricing" 
                    className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline">{t('landing.footer.pricingSection')}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </AnimatedCard>

          {/* Column 3: Platform */}
          <AnimatedCard hoverEffect="glow" className="bg-transparent border-0 p-0">
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="text-white font-semibold mb-6 text-lg">
                {language === 'ar' ? 'المنصة' : 'Platform'}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/register" 
                    className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline">{language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline">{language === 'ar' ? 'تسجيل الدخول' : 'Login'}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/vendors" 
                    className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline">{language === 'ar' ? 'دليل الموردين' : 'Vendor Directory'}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/support" 
                    className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline">{t('landing.footer.supportSection')}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </AnimatedCard>
          {/* Column 4: Legal & Support */}
          <AnimatedCard hoverEffect="glow" className="bg-transparent border-0 p-0">
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="text-white font-semibold mb-6 text-lg">
                {t('landing.footer.support')}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/support" 
                    className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline">{t('landing.footer.helpCenterLink')}</span>
                  </Link>
                </li>
                <li>
                  <span className="text-white/70 text-sm">
                    {t('landing.footer.documentation')}
                  </span>
                </li>
                <li>
                  <span className="text-white/70 text-sm">
                    {t('landing.footer.systemStatus')}
                  </span>
                </li>
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline">{t('landing.footer.privacyPolicy')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms-and-conditions" 
                    className="text-white/70 hover:text-white transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline">{t('landing.footer.termsOfService')}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </AnimatedCard>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Copyright */}
            <div className="text-white/60 text-sm">
              © 2025 MWRD. {t('landing.footer.rights')}
            </div>

            {/* Social Media */}
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-white/60 text-sm">{t('landing.footer.followUs')}</span>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <a 
                  href="https://twitter.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 transform"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 transform"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 transform"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110 transform"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};