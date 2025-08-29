import { createRoot } from 'react-dom/client'
import React from 'react'

const SuperMinimalApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Super Minimal Test App</h1>
      <p>Testing if React works at the most basic level</p>
      <button onClick={() => alert('Button clicked!')}>Test Button</button>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <SuperMinimalApp />
);
