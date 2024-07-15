import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'
import { ContextProvider } from './context/AppContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ContextProvider>
    <App />
    <Toaster />
  </ContextProvider>

)
