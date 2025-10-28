import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
<<<<<<< HEAD
=======
import { initPerformanceMonitoring } from './utils/performance'

// Initialize performance monitoring
initPerformanceMonitoring();
>>>>>>> origin/feature/WebApp1.0

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
