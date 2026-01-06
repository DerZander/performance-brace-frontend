import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'

// Error Handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial; color: #C1272D;">
      <h1>Fehler beim Laden</h1>
      <p>${event.error?.message || 'Unbekannter Fehler'}</p>
      <pre>${event.error?.stack || ''}</pre>
    </div>
  `;
});

// React rendern
try {
    const root = document.getElementById('root');
    if (!root) {
        throw new Error('Root element not found!');
    }

    createRoot(root).render(
        <StrictMode>
            <App/>
        </StrictMode>,
    );
} catch (error) {
    console.error('Failed to render app:', error);
    document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial; color: #C1272D;">
      <h1>Fehler beim Starten</h1>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `;
}

