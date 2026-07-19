import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#232019',
              color: '#F7F3E9',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '15px',
              borderRadius: '12px',
              padding: '12px 18px',
            },
          }}
        />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
