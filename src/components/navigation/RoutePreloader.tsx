import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePerformanceOptimizations } from '@/hooks/usePerformanceOptimizations';

interface RoutePreloaderProps {
  routes?: string[];
}

export const RoutePreloader = ({ routes = [] }: RoutePreloaderProps) => {
  const location = useLocation();
  const { navigationConfig, networkSpeed, deviceCapabilities } = usePerformanceOptimizations();

  useEffect(() => {
    if (!navigationConfig.preloadPages || deviceCapabilities.isLowEnd || networkSpeed === 'slow') {
      return;
    }

    // Preload common routes based on current location
    const getPreloadRoutes = (currentPath: string): string[] => {
      const commonPreloads = ['/dashboard', '/profile', '/settings'];
      
      const routeMap: { [key: string]: string[] } = {
        '/': ['/dashboard', '/login', '/register'],
        '/landing': ['/dashboard', '/pricing', '/login'],
        '/dashboard': ['/projects', '/requests', '/messages', '/profile'],
        '/projects': ['/dashboard', '/requests', '/projects/create'],
        '/requests': ['/dashboard', '/vendors', '/requests/create'],
        '/vendors': ['/dashboard', '/requests', '/messages'],
        '/messages': ['/dashboard', '/vendors', '/projects'],
        '/admin': ['/admin/users', '/admin/requests', '/admin/analytics'],
        '/admin/users': ['/admin/requests', '/admin/offers', '/admin/dashboard'],
      };

      const specificRoutes = routeMap[currentPath] || [];
      const userProvidedRoutes = routes || [];
      
      return [...new Set([...commonPreloads, ...specificRoutes, ...userProvidedRoutes])];
    };

    const preloadRoutes = getPreloadRoutes(location.pathname);
    
    // Preload routes with a delay to not interfere with current page load
    const preloadTimeout = setTimeout(() => {
      preloadRoutes.forEach((route, index) => {
        if (route !== location.pathname) {
          setTimeout(() => {
            // Create a link element to trigger preloading
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = route;
            document.head.appendChild(link);
            
            // Clean up after a while to prevent memory leaks
            setTimeout(() => {
              if (document.head.contains(link)) {
                document.head.removeChild(link);
              }
            }, 30000);
          }, index * 100); // Stagger preloads
        }
      });
    }, 1000);

    return () => {
      clearTimeout(preloadTimeout);
    };
  }, [location.pathname, navigationConfig.preloadPages, networkSpeed, deviceCapabilities.isLowEnd, routes]);

  // This component doesn't render anything
  return null;
};

// Hook for manual route preloading
export const useRoutePreloader = () => {
  const { navigationConfig, networkSpeed, deviceCapabilities } = usePerformanceOptimizations();

  const preloadRoute = (route: string) => {
    if (!navigationConfig.preloadPages || deviceCapabilities.isLowEnd || networkSpeed === 'slow') {
      return;
    }

    // Check if already preloaded
    const existingLink = document.querySelector(`link[rel="prefetch"][href="${route}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);

    // Clean up after 30 seconds
    setTimeout(() => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }, 30000);
  };

  const preloadRoutes = (routes: string[]) => {
    routes.forEach((route, index) => {
      setTimeout(() => preloadRoute(route), index * 50);
    });
  };

  return { preloadRoute, preloadRoutes };
};