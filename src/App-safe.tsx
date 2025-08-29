import React from 'react';

// Ultra-minimal safe app for testing React initialization
const SafeApp: React.FC = () => {
  console.log('SafeApp: Starting with no hooks');
  
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
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 1rem 0', color: '#333' }}>
          🔧 System Check
        </h1>
        <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
          React is initializing safely...
        </p>
        <div style={{
          width: '200px',
          height: '4px',
          backgroundColor: '#e0e0e0',
          borderRadius: '2px',
          overflow: 'hidden',
          margin: '0 auto'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#4f46e5',
            animation: 'pulse 2s ease-in-out infinite'
          }}></div>
        </div>
        <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', color: '#999' }}>
          Preparing full application...
        </p>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default SafeApp;