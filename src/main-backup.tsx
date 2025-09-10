
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { logger } from './utils/logger'

logger.info('Application starting');

createRoot(document.getElementById("root")!).render(<App />);
