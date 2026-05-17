import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '40px',
    }}>
      <div>
        <h1 style={{ fontSize: '6rem', fontFamily: 'Playfair Display, serif', margin: 0 }}>404</h1>
        <h2 style={{ marginBottom: '12px' }}>Page not found</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
