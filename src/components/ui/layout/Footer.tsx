import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <footer className="bg-gradient-to-r from-[#004F54] via-[#102C33] to-[#66023C] backdrop-blur-xl border-t border-white/10">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${isRTL ? 'rtl-grid' : ''}`}>
          
          {/* Column 1: Logo & Tagline */}
          <div className={`col-span-1 lg:col-span-1 ${isRTL ? 'text-right' : 'text-left'}`}>
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
          </div>

          {/* Column 2: Contact & Company */}
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="text-white font-semibold mb-6 text-lg">
              {t('landing.footer.company')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/support" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.contactUsBtn')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.blog')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.company')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation Links */}
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="text-white font-semibold mb-6 text-lg">
              {t('nav.navigation')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/why-start-with-mwrd" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.whyStart')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/why-move-to-mwrd" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.whyMove')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.pricingSection')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.supportSection')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help & Legal */}
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="text-white font-semibold mb-6 text-lg">
              {t('landing.footer.support')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/help" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.helpCenterLink')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/docs" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.documentation')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/status" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.systemStatus')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-and-conditions" 
                  className="text-white/70 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                >
                  {t('landing.footer.termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
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
                  href="#" 
                  className="text-white/60 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="#" 
                  className="text-white/60 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="#" 
                  className="text-white/60 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="#" 
                  className="text-white/60 hover:text-white transition-colors duration-300 hover:scale-110 transform"
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