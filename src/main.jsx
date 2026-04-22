import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store/index.js';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#292524',
              color: '#fdf8f0',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#d4812a', secondary: '#fdf8f0' },
            },
            error: {
              iconTheme: { primary: '#dc5e38', secondary: '#fdf8f0' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
