// src/components/TimelineSlider.jsx

export default function TimelineSlider({ year, setYear, startYear, endYear }) {
  const handleChange = (e) => {
    setYear(Number(e.target.value));
  };

  const handleRelease = () => {
    if (year >= endYear) {
      setYear(startYear);
    }
  };

  return (
    <div style={{ 
      marginBottom: '1rem',
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '1rem 1.25rem',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)'
    }}>
      <label style={{ color: 'white', fontSize: '1.1rem' }}>
        <strong>Year:</strong> {year}
      </label>
      <input
        type="range"
        min={startYear}
        max={endYear}
        value={year}
        onChange={handleChange}
        onMouseUp={handleRelease}
        onTouchEnd={handleRelease}
        onKeyUp={handleRelease}
        style={{
          width: '100%',
          height: '12px',
          borderRadius: '6px',
          background: '#4b5563',
          outline: 'none',
          marginTop: '10px',
          WebkitAppearance: 'none',
          appearance: 'none'
        }}
      />
      {/* Dense year ticks */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${endYear - startYear + 1}, 1fr)`, gap: '0px', alignItems: 'start', marginTop: '6px' }}>
        {Array.from({ length: endYear - startYear + 1 }).map((_, idx) => {
          const y = startYear + idx;
         // const showLabel = (y === startYear) || (y === endYear) || (y % 1 === 0);
          return (
            <div key={y} style={{ textAlign: 'center' }}>
              <div style={{ height: '6px', width: '1px', background: '#9ca3af', margin: '0 auto' }} />
              {/* {showLabel && (
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px', transform: 'rotate(0deg)' }}>
                  {y}
                </div>
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
}