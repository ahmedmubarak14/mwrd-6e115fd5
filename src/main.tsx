import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set the dir attribute based on language preference from localStorage
const savedLanguage = localStorage.getItem('language') || 'en';
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';

createRoot(document.getElementById("root")!).render(<App />);
