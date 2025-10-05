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
    earth: {
        title: "🌍 Combined Earth View",
        description: "Land Cover, Bump, and Atmosphere combined.",
        details: "The full planet view, showcasing all three datasets simultaneously."
    },
    land: {
        title: "🌍 Land Cover Data (Colourful)", // 👈 Added 'Colourful' cue
        description: "MODIS MCD12Q1 Land Cover Type",
        details: "Shows vegetation types, urban areas, water bodies, and barren land."
    },
    bump: {
        title: "🏔️ Surface Bump Data (Black/White)", // 👈 Added 'Black/White' cue
        description: "Topographic Surface Elevation",
        details: "Displays terrain elevation and surface roughness."
    },
    atmosphere: {
        title: "🌫️ Atmosphere Data (Transparent/White)", // 👈 Added 'Transparent/White' cue
        description: "NASA Atmosphere Composition",
        details: "Shows atmospheric conditions and composition over time."
    }
};

  const legends = {
        land: {
            title: "Land Cover Legend (MODIS MCD12Q1)",
            items: [
                { color: "#4575b4", label: "Water" },                          // (69, 117, 180) - Slate Blue
                { color: "#006400", label: "Evergreen Needleleaf/Broadleaf" }, // (0, 100, 0) - Dark Green
                { color: "#228B22", label: "Deciduous Needleleaf/Broadleaf" }, // (34, 139, 34) - Forest Green
                { color: "#00CD00", label: "Mixed Forests" },                  // (0, 205, 0) - Lime Green
                { color: "#8B4513", label: "Closed Shrublands" },              // (139, 69, 19) - Brown
                { color: "#CD853F", label: "Open Shrublands" },                // (205, 133, 63) - Peru
                { color: "#FFA500", label: "Woody Savannas" },                 // (255, 165, 0) - Orange
                { color: "#FFD700", label: "Savannas" },                       // (255, 215, 0) - Gold
                { color: "#FFFF00", label: "Grasslands" },                     // (255, 255, 0) - Yellow
                { color: "#6495ED", label: "Permanent Wetlands" },             // (100, 149, 237) - Cornflower Blue
                { color: "#FF69B4", label: "Croplands" },                      // (255, 105, 180) - Hot Pink
                { color: "#CD5C5C", label: "Urban and Built-up" },             // (205, 92, 92) - Indian Red
                { color: "#FFC0CB", label: "Crop/Natural Veg. Mosaics" },      // (255, 192, 203) - Pink
                { color: "#F0F8FF", label: "Permanent Snow and Ice" },         // (240, 248, 255) - Ghost White
                { color: "#A0522D", label: "Barren Land" }                     // (160, 82, 45) - Sienna
            ]
        },
        bump: {
            title: "Surface Elevation Legend (Relative Intensity)",
            items: [
                { color: "#000000", label: "Black (Ocean/Missing Data)" },
                { color: "#444444", label: "Dark Gray (Low Elevation/Intensity)" },
                { color: "#888888", label: "Medium Gray (Moderate Elevation/Intensity)" },
                { color: "#CCCCCC", label: "Light Gray (High Elevation/Intensity)" },
                { color: "#FFFFFF", label: "White (Highest Elevation/Intensity)" },
            ]
        },
        atmosphere: {
            title: "Atmosphere Legend (Aerosol/Cloud/Ozone)",
            items: [
                { color: "#0000FF", label: "Dark Blue (Very Low Values)" },
                { color: "#0080FF", label: "Light Blue (Low Values)" },
                { color: "#00FFFF", label: "Cyan (Below Average)" },
                { color: "#00FF00", label: "Green (Average Values)" },
                { color: "#80FF00", label: "Yellow-Green (Above Average)" },
                { color: "#FFFF00", label: "Yellow (High Values)" },
                { color: "#FF8000", label: "Orange (Very High Values)" },
                { color: "#FF0000", label: "Red (Highest Values)" },
            ]
        }
    };
    
  
    return (
      <div style={{
        background: 'transparent',
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