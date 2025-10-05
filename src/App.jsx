import { useState } from 'react';
import EarthGlobe from './components/EarthGlobe';
import TimelineSlider from './components/TimelineSlider';
import InfoPanel from './components/InfoPanel';
import './App.css';

const START_YEAR = 2001;
const END_YEAR = 2024; 

export default function App() {
  const [currentYear, setCurrentYear] = useState(START_YEAR);
  const [selectedDataType, setSelectedDataType] = useState('earth'); // 'land', 'bump', 'atmosphere'
  const [showLegend, setShowLegend] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(null); 

  // Function to handle data type change and set the message
  const handleDataTypeChange = (dataType, message) => {
    setSelectedDataType(dataType);
    setDisplayMessage(message);
    
    // Clear the message after a short duration (e.g., 2 seconds)
    setTimeout(() => {
      setDisplayMessage(null);
    }, 2000); 
  };

  // Handle orbit completion - advance year when Earth completes one orbit
  const handleOrbitComplete = (orbitCount) => {
    setCurrentYear(prevYear => {
      const nextYear = prevYear + 1;
      if (nextYear > END_YEAR) {
        return START_YEAR; // Reset to start when reaching end
      }
      return nextYear;
    });
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: '#0f172a',
      color: 'white',
      fontFamily: 'sans-serif',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Full window Solar System panel */}
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        zIndex: 1
      }}> 
        <EarthGlobe 
          currentYear={currentYear} 
          dataType={selectedDataType}
          onOrbitComplete={handleOrbitComplete}
          overlayMessage={displayMessage}
        />
      </div>

      {/* Title Header at Top */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: '0.5rem',
        background: 'rgba(0,0,0,0.8)',
        zIndex: 10
      }}>
        <h2 style={{ margin: '0.25rem 0', fontSize: '1.2rem' }}>🛰️ Terra Land Cover Through Time ({START_YEAR} - {END_YEAR})</h2> 
        <p style={{ margin: '0.25rem 0', fontSize: '0.8rem' }}><i>An interactive 3D visualization using NASA Terra satellite data</i></p>
      </header>

      {/* Compact Controls Footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'transparent',
        padding: '0.75rem',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Left: Data Type Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap',order:1 }}>
           <button
            onClick={() => handleDataTypeChange('earth', '🌍 COMBINED EARTH VIEW')}           title="Default View: Shows Land Cover, Cloud Texture, and Atmosphere layers together." // 👈 Added Tooltip
           style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: selectedDataType === 'earth' ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)',
              color: 'white',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
          >
            🌍 Earth
          </button>
          <button
          onClick={() => handleDataTypeChange('land', '⛰️ LAND COVER (COLOURFUL)')} 
            title="Land Cover: View the colorful MODIS vegetation and surface types only (no elevation)." // 👈 Added Tooltip
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: selectedDataType === 'land' ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)',
              color: 'white',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
          >
            ⛰️ Land
          </button>
          <button
onClick={() => handleDataTypeChange('bump', '🏔️ SURFACE BUMP (BLACK & WHITE)')}            title="Atmosphere: View the transparent layer showing air quality, cloud, or ozone data." // 👈 Added Tooltip
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: selectedDataType === 'bump' ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)',
              color: 'white',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
          >
            🏔️ Bump
          </button>
          <button
            onClick={() => handleDataTypeChange('atmosphere', '🌫️ ATMOSPHERE (TRANSPARENT LAYER)')}             title="Show/Hide the detailed data legend for the selected type." // 👈 Added Tooltip
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: selectedDataType === 'atmosphere' ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)',
              color: 'white',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
          >
            🌫️ Atmosphere
          </button>
          <button
            onClick={() => setShowLegend(!showLegend)}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: showLegend ? '#10b981' : 'rgba(16, 185, 129, 0.3)',
              color: 'white',
              border: '1px solid #10b981',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}
          >
            📊 Legend
          </button>
        </div>

        {/* Center: Year Slider */}
          <div style={{ order: 2, flex: '1 1 100%', maxWidth: '500px', minWidth: '300px', margin: '0 auto' }}>
          <TimelineSlider 
            year={currentYear} 
            setYear={setCurrentYear} 
            startYear={START_YEAR} 
            endYear={END_YEAR}     
          />
        </div>

        {/* Right: Compact Info Panel */}
        <div style={{ minWidth: '300px', maxWidth: '400px', flex: '1' ,order: 3}}>
          <InfoPanel 
            year={currentYear} 
            dataType={selectedDataType} 
            showLegend={showLegend}
          />
        </div>
      </div>
    </div>
  );
}
