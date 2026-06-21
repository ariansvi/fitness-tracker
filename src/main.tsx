import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register the offline service worker in production builds only.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // Reload once when a new service worker takes control, so a fresh deploy
  // is shown without the user having to manually clear anything.
  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return
    reloading = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker
      // updateViaCache: 'none' = always re-check sw.js from the network.
      .register(`${import.meta.env.BASE_URL}sw.js`, { updateViaCache: 'none' })
      .then((reg) => reg.update())
      .catch(() => {})
  })
}
