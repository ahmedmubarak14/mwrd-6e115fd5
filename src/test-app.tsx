import React from 'react';
import { createRoot } from 'react-dom/client';

const TestApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test App is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

// Test if we can render
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<TestApp />);
  console.log('Test app rendered successfully');
} else {
  console.error('Root element not found');
}
