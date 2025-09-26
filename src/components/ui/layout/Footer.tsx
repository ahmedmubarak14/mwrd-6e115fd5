import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Twitter, Linkedin, Facebook, Instagram, Mail, Phone, MapPin, Navigation, Users, HeadphonesIcon, Send } from "lucide-react";
import { AnimatedCard } from "@/components/ui/animations/MicroInteractions";
import { useState } from "react";

export const Footer = () => {
  const { language, t, isRTL } = useLanguage();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#004F54] via-[#102C33] to-[#66023C] backdrop-blur-xl border-t border-white/10 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2760%27%20height=%2760%27%20viewBox=%270%200%2060%2060%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%3E%3Cg%20fill=%27%23ffffff%27%20fill-opacity=%270.02%27%3E%3Ccircle%20cx=%277%27%20cy=%277%27%20r=%271%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Main Footer Content */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 ${isRTL ? 'rtl-grid' : ''}`}>
          
          {/* Column 1: Logo, Tagline & Newsletter */}
          <div className="col-span-1 lg:col-span-1 space-y-8">
            <AnimatedCard hoverEffect="lift" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-white/5 transition-all duration-500">
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img 
                      src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                      alt="MWRD Logo"
                      className="h-12 w-auto drop-shadow-lg"
                    />
                  </div>
                  <span className="text-2xl font-bold text-white drop-shadow-lg">MWRD</span>
                </div>
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  {t('landing.footer.taglineText')}
                </p>
              </div>
            </AnimatedCard>

            {/* Newsletter Subscription */}
            <AnimatedCard hoverEffect="glow" className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Send size={18} className="text-white/80" />
                {language === 'ar' ? 'النشرة الإخبارية' : 'Newsletter'}
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Your email address'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 backdrop-blur-sm transition-all duration-300"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white font-medium py-3 px-4 rounded-xl border border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  {language === 'ar' ? 'اشتراك' : 'Subscribe'}
                </button>
              </form>
            </AnimatedCard>

            {/* Contact Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center gap-3 text-white/80 text-sm group hover:text-white transition-colors duration-300">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
                  <Mail size={14} />
                </div>
                <span className="font-medium">info@mwrd.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/80 text-sm group hover:text-white transition-colors duration-300">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
                  <Phone size={14} />
                </div>
                <span className="font-medium">+966 11 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-white/80 text-sm group hover:text-white transition-colors duration-300">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
                  <MapPin size={14} />
                </div>
                <span className="font-medium">{language === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-6">
            <AnimatedCard hoverEffect="glow" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-white/5 transition-all duration-500">
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
                  <Navigation size={18} className="text-white/80" />
                  {t('nav.navigation')}
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link 
                      to="/why-start-with-mwrd" 
                      className="group text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1 p-2 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                      <span className="group-hover:underline">{t('landing.footer.whyStart')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/what-makes-us-unique" 
                      className="group text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1 p-2 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                      <span className="group-hover:underline">{language === 'ar' ? 'ما يميزنا' : 'What Makes Us Unique'}</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/why-move-to-mwrd" 
                      className="group text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1 p-2 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                      <span className="group-hover:underline">{t('landing.footer.whyMove')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/pricing" 
                      className="group text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1 p-2 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                      <span className="group-hover:underline">{t('landing.footer.pricingSection')}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimatedCard>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-6">
            <AnimatedCard hoverEffect="glow" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-white/5 transition-all duration-500">
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
                  <Users size={18} className="text-white/80" />
                  {language === 'ar' ? 'المنصة' : 'Platform'}
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link 
                      to="/register" 
                      className="group text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1 p-2 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                      <span className="group-hover:underline">{language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/login" 
                      className="group text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1 p-2 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                      <span className="group-hover:underline">{language === 'ar' ? 'تسجيل الدخول' : 'Login'}</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/vendors" 
                      className="group text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1 p-2 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                      <span className="group-hover:underline">{language === 'ar' ? 'دليل الموردين' : 'Vendor Directory'}</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/support" 
                      className="group text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1 p-2 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                      <span className="group-hover:underline">{t('landing.footer.supportSection')}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimatedCard>
          </div>

          {/* Column 4: Legal & Support */}
          <div className="space-y-6">
            <AnimatedCard hoverEffect="glow" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-white/5 transition-all duration-500">
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="text-white font-bold mb-6 text-lg flex items-center gap-2">
                  <HeadphonesIcon size={18} className="text-white/80" />
                  {t('landing.footer.support')}
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link 
                      to="/support" 
                      className="group text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1 p-2 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                      <span className="group-hover:underline">{t('landing.footer.helpCenterLink')}</span>
                    </Link>
                  </li>
                  <li>
                    <div className="group text-white/80 transition-all duration-300 text-sm font-medium flex items-center gap-2 p-2">
                      <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                      <span>{t('landing.footer.documentation')}</span>
                    </div>
                  </li>
                  <li>
                    <div className="group text-white/80 transition-all duration-300 text-sm font-medium flex items-center gap-2 p-2">
                      <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                      <span>{t('landing.footer.systemStatus')}</span>
                    </div>
                  </li>
                  <li>
                    <Link 
                      to="/privacy-policy" 
                      className="group text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1 p-2 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                      <span className="group-hover:underline">{t('landing.footer.privacyPolicy')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/terms-and-conditions" 
                      className="group text-white/80 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:translate-x-1 p-2 rounded-lg hover:bg-white/10"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                      <span className="group-hover:underline">{t('landing.footer.termsOfService')}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-white/20 mt-16 pt-10">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Copyright */}
            <div className="text-white/70 text-sm font-medium">
              © 2025 MWRD. {t('landing.footer.rights')}
            </div>

            {/* Social Media */}
            <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-white/70 text-sm font-medium">{t('landing.footer.followUs')}</span>
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <a 
                  href="https://twitter.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white/70 hover:text-white transition-all duration-300 hover:scale-110 transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label="Twitter"
                >
                  <Twitter size={18} className="group-hover:drop-shadow-lg" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white/70 hover:text-white transition-all duration-300 hover:scale-110 transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} className="group-hover:drop-shadow-lg" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white/70 hover:text-white transition-all duration-300 hover:scale-110 transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label="Facebook"
                >
                  <Facebook size={18} className="group-hover:drop-shadow-lg" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white/70 hover:text-white transition-all duration-300 hover:scale-110 transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="group-hover:drop-shadow-lg" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};