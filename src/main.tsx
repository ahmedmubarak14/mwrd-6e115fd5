import { createRoot } from 'react-dom/client'
import './index.css'

console.log('Main: Starting with minimal working app');

// Ultra-minimal working React app
const MinimalApp = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <h1 style={{ margin: '0 0 1rem 0', color: '#333' }}>
          🚀 MWRD Platform
        </h1>
        <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
          System is initializing...
        </p>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
          margin: '1rem 0'
        }}>
          <div style={{
            width: '60%',
            height: '100%',
            backgroundColor: '#4f46e5',
            borderRadius: '4px'
          }}></div>
        </div>
        <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', color: '#999' }}>
          React is working correctly!
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Continue to Full App
        </button>
      </div>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<MinimalApp />);
