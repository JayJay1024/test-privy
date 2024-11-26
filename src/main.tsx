import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrivyProvider } from '@privy-io/react-auth'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId='cm3sf7rpj003b12btluj2f1kx'
      config={{
        appearance: {
          loginMessage: 'Please login to continue',
          theme: 'dark',
        }
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>,
)
