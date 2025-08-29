import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import SafeApp from './App-safe.tsx'
import './index.css'

// Set the dir attribute based on language preference from localStorage
try {
  const savedLanguage = localStorage.getItem('language') || 'en';
  document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
} catch (error) {
  console.warn('Failed to access localStorage for initial language setup:', error);
  document.documentElement.dir = 'ltr';
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});

console.log('Main: Starting with SafeApp due to React initialization issues');

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <SafeApp />
    </QueryClientProvider>
  </ErrorBoundary>
);

// After 3 seconds, try to load the full app
setTimeout(() => {
  console.log('Main: Attempting to load full app...');
  
  import('./App.tsx').then((AppModule) => {
    const FullApp = AppModule.default;
    
    createRoot(document.getElementById("root")!).render(
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <FullApp />
        </QueryClientProvider>
      </ErrorBoundary>
    );
    
    console.log('Main: Full app loaded successfully');
  }).catch((error) => {
    console.error('Main: Failed to load full app, staying with SafeApp:', error);
  });
}, 3000);
