// src/components/InfoPanel.jsx
export default function InfoPanel({ year, dataType, showLegend }) {
    const stories = {
      2001: "Terra satellite begins global land cover monitoring.",
      2002: "First comprehensive global vegetation mapping.",
      2003: "European heatwave impacts vegetation patterns.",
      2004: "Asian tsunami affects coastal land cover.",
      2005: "Hurricane Katrina reshapes Gulf Coast.",
      2006: "Amazon deforestation reaches peak levels.",
      2007: "Arctic ice melting accelerates.",
      2008: "Global financial crisis slows urban expansion.",
      2009: "Copenhagen Climate Summit raises awareness.",
      2010: "Rapid urban expansion in Asia and Africa.",
      2011: "Fukushima disaster affects regional land use.",
      2012: "Drought impacts Great Plains agriculture.",
      2013: "California wildfires increase in frequency.",
      2014: "Paris Agreement negotiations begin.",
      2015: "Paris Climate Agreement signed.",
      2016: "El Niño affects global weather patterns.",
      2017: "Hurricane Maria devastates Puerto Rico.",
      2018: "California Camp Fire breaks records.",
      2019: "Australian bushfires reach unprecedented scale.",
      2020: "COVID-19 lockdowns reduce urban pollution.",
      2021: "COP26 Glasgow Climate Summit.",
      2022: "European heatwaves break temperature records.",
      2023: "Global renewable energy adoption accelerates.",
      2024: "Global reforestation efforts show early success."
    };

    const dataTypeInfo = {
      land: {
        title: "🌍 Land Cover Data",
        description: "MODIS MCD12Q1 Land Cover Type",
        details: "Shows vegetation types, urban areas, water bodies, and barren land"
      },
      bump: {
        title: "🏔️ Surface Bump Data", 
        description: "Topographic Surface Elevation",
        details: "Displays terrain elevation and surface roughness"
      },
      atmosphere: {
        title: "🌫️ Atmosphere Data",
        description: "NASA Atmosphere Composition",
        details: "Shows atmospheric conditions and composition over time"
      }
    };

    const legends = {
      land: {
        title: "Land Cover Legend",
        items: [
          { color: "#006400", label: "Evergreen Needleleaf Forest" },
          { color: "#228B22", label: "Evergreen Broadleaf Forest" },
          { color: "#8FBC8F", label: "Deciduous Needleleaf Forest" },
          { color: "#32CD32", label: "Deciduous Broadleaf Forest" },
          { color: "#9ACD32", label: "Mixed Forest" },
          { color: "#FFFF00", label: "Grasslands" },
          { color: "#FFD700", label: "Savannas" },
          { color: "#DAA520", label: "Shrublands" },
          { color: "#8B4513", label: "Woody Savannas" },
          { color: "#A0522D", label: "Croplands" },
          { color: "#FF6347", label: "Urban Areas" },
          { color: "#0000FF", label: "Water Bodies" },
          { color: "#F5F5DC", label: "Barren Land" }
        ]
      },
      bump: {
        title: "Surface Elevation Legend",
        items: [
          { color: "#000080", label: "Deep Ocean (-4000m)" },
          { color: "#0000FF", label: "Ocean (-2000m)" },
          { color: "#00FFFF", label: "Sea Level (0m)" },
          { color: "#00FF00", label: "Lowlands (500m)" },
          { color: "#FFFF00", label: "Hills (1000m)" },
          { color: "#FF8000", label: "Mountains (2000m)" },
          { color: "#FF0000", label: "High Mountains (4000m)" },
          { color: "#800080", label: "Peaks (6000m+)" }
        ]
      },
      atmosphere: {
        title: "Atmosphere Composition Legend",
        items: [
          { color: "#000080", label: "Low Aerosol Density" },
          { color: "#0000FF", label: "Moderate Aerosol" },
          { color: "#00FFFF", label: "Normal Conditions" },
          { color: "#00FF00", label: "Elevated Particles" },
          { color: "#FFFF00", label: "High Aerosol" },
          { color: "#FF8000", label: "Very High Density" },
          { color: "#FF0000", label: "Extreme Conditions" },
          { color: "#800080", label: "Critical Levels" }
        ]
      }
    };
  
    return (
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        padding: '0.5rem',
        borderRadius: '6px',
        color: '#f1f5f9',
        fontSize: '0.75rem',
        lineHeight: '1.3'
      }}>
        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: '#60a5fa' }}>
          {dataTypeInfo[dataType]?.title || "🌍 Earth Data"}
        </h4>
        <p style={{ margin: '0.25rem 0', fontSize: '0.7rem', color: '#e2e8f0' }}>
          {stories[year] || "Explore 25 years of data from NASA Terra."}
        </p>
        <p style={{ margin: '0.25rem 0', fontSize: '0.65rem', color: '#94a3b8' }}>
          {dataTypeInfo[dataType]?.description || "NASA Terra MODIS"}
        </p>

        {/* Compact Legend Display */}
        {showLegend && legends[dataType] && (
          <div style={{ 
            marginTop: '0.5rem', 
            padding: '0.25rem', 
            background: 'rgba(0,0,0,0.4)', 
            borderRadius: '3px',
            maxHeight: '120px',
            overflowY: 'auto'
          }}>
            <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.7rem', color: '#fbbf24' }}>
              {legends[dataType].title}
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.15rem' }}>
              {legends[dataType].items.slice(0, 8).map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6rem' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: item.color, 
                    borderRadius: '1px',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}></div>
                  <span style={{ fontSize: '0.6rem' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }