// src/components/TimelineSlider.jsx
import { useState } from 'react';

export default function TimelineSlider({ year, setYear }) {
  const minYear = 2001;
  const maxYear = 2024;

  return (
    <div style={{ 
      marginBottom: '1.5rem',
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '1rem',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)'
    }}>
      <label style={{ color: 'white', fontSize: '1rem' }}>
        <strong>Year:</strong> {year}
      </label>
      <input
        type="range"
        min={minYear}
        max={maxYear}
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          background: '#4b5563',
          outline: 'none',
          marginTop: '8px',
          WebkitAppearance: 'none',
          appearance: 'none'
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.5rem' }}>
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
    </div>
  );
}