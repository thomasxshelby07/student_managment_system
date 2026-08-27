// eslint-disable-next-line no-unused-vars
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// eslint-disable-next-line no-unused-vars
import App from './App.jsx'
import { initCrashReporting } from './reportError.js'

initCrashReporting()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)