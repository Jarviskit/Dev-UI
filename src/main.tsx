import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AgUiApp from './jarviskit/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AgUiApp />
  </StrictMode>,
)