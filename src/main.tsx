import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import App from './App.tsx'
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

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ErrorBoundary>
);

console.log('Main: Full app restored and rendered successfully');
