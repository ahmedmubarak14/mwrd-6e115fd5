import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePerformanceOptimizations } from '@/hooks/usePerformanceOptimizations';
import { useLanguage } from '@/contexts/LanguageContext';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ size?: string | number; className?: string }>;
}

export const SmartBreadcrumbs = () => {
  const location = useLocation();
  const { performanceConfig, createOptimizedHandler } = usePerformanceOptimizations();
  const { language } = useLanguage();

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: language === 'ar' ? 'الرئيسية' : 'Home',
        path: '/',
        icon: Home
      }
    ];

    // Route mapping for better labels
    const routeLabels: { [key: string]: { en: string; ar: string } } = {
      'dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
      'projects': { en: 'Projects', ar: 'المشاريع' },
      'requests': { en: 'Requests', ar: 'الطلبات' },
      'vendors': { en: 'Vendors', ar: 'الموردون' },
      'messages': { en: 'Messages', ar: 'الرسائل' },
      'orders': { en: 'Orders', ar: 'الطلبات' },
      'settings': { en: 'Settings', ar: 'الإعدادات' },
      'profile': { en: 'Profile', ar: 'الملف الشخصي' },
      'analytics': { en: 'Analytics', ar: 'التحليلات' },
      'support': { en: 'Support', ar: 'الدعم' },
      'admin': { en: 'Admin', ar: 'الإدارة' },
      'users': { en: 'Users', ar: 'المستخدمون' },
      'offers': { en: 'Offers', ar: 'العروض' },
      'create': { en: 'Create', ar: 'إنشاء' },
      'edit': { en: 'Edit', ar: 'تعديل' }
    };

    let currentPath = '';
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;
      
      const routeInfo = routeLabels[pathname];
      const label = routeInfo ? routeInfo[language] : pathname.charAt(0).toUpperCase() + pathname.slice(1);
      
      breadcrumbs.push({
        label,
        path: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home/landing pages
  if (location.pathname === '/' || location.pathname === '/landing' || breadcrumbs.length <= 1) {
    return null;
  }

  const handleClick = createOptimizedHandler((path: string) => {
    // Pre-load route if performance allows
    // This could be enhanced with route preloading
  });

  if (!performanceConfig.enableAnimations) {
    return (
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.path}>
            {index > 0 && <ChevronRight size={14} className="text-muted-foreground/50" />}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground font-medium flex items-center gap-1">
                {breadcrumb.icon && <breadcrumb.icon size={14} />}
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                onClick={() => handleClick(breadcrumb.path)}
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                {breadcrumb.icon && <breadcrumb.icon size={14} />}
                {breadcrumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  return (
    <motion.nav 
      className="flex items-center space-x-2 text-sm text-muted-foreground mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <motion.div
          key={breadcrumb.path}
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.15 }}
        >
          {index > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 + 0.1, duration: 0.1 }}
            >
              <ChevronRight size={14} className="text-muted-foreground/50" />
            </motion.div>
          )}
          
          {index === breadcrumbs.length - 1 ? (
            <motion.span 
              className="text-foreground font-medium flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.15, duration: 0.2 }}
            >
              {breadcrumb.icon && <breadcrumb.icon size={14} />}
              {breadcrumb.label}
            </motion.span>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={breadcrumb.path}
                onClick={() => handleClick(breadcrumb.path)}
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                {breadcrumb.icon && <breadcrumb.icon size={14} />}
                {breadcrumb.label}
              </Link>
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.nav>
  );
};