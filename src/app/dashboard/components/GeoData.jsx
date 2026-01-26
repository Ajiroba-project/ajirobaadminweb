import React, { memo, useEffect, useState, useMemo } from "react";
import Image from "next/image";

const GeoGraph = ({ setTooltipContent, customerByLocation = [] }) => {
  const [locationData, setLocationData] = useState({});
  const [maxCount, setMaxCount] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [hoveredState, setHoveredState] = useState(null);

  useEffect(() => {
    if (customerByLocation && customerByLocation.length > 0) {
      const dataMap = {};
      let highestCount = 0;
      let total = 0;

      customerByLocation
        .filter(item => item.state && item.state.trim() !== "")
        .forEach(item => {
          if (item.state) {
            let stateName = item.state.trim();
            
            // Remove " State" suffix
            stateName = stateName.replace(/ State$/i, "").trim();
            
            // Handle FCT variations
            if (stateName === "FCT" || stateName === "Federal Capital Territory") {
              stateName = "Abuja";
            } else if (stateName.startsWith("FCT")) {
              // Handle "FCT - Abuja" or "FCT - something" format
              // Extract the part after "FCT - " if it exists
              const parts = stateName.split(" - ");
              if (parts.length > 1) {
                stateName = parts[1].trim();
              } else {
                stateName = "Abuja";
              }
            }
            
            if (dataMap[stateName]) {
              dataMap[stateName] += item.count;
            } else {
              dataMap[stateName] = item.count;
            }

            total += item.count;

            if (dataMap[stateName] > highestCount) {
              highestCount = dataMap[stateName];
            }
          }
        });

      setLocationData(dataMap);
      setMaxCount(highestCount);
      setTotalCustomers(total);
    } else {
      // Reset when no data
      setLocationData({});
      setMaxCount(0);
      setTotalCustomers(0);
    }
  }, [customerByLocation]);

  // Get top 5 locations sorted by count
  const top5Locations = useMemo(() => {
    return Object.entries(locationData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([state, count], index) => ({
        state,
        count,
        index,
      }));
  }, [locationData]);

  // Position coordinates for top 5 markers (based on image layout)
  const markerPositions = [
    { x: 200, y: 80 },   // Top-left (near Greenland)
    { x: 750, y: 100 },  // Top-right (over Russia)
    { x: 465, y: 220 },  // Center (Africa/Nigeria region)
    { x: 420, y: 320 },  // Bottom-left (southern Africa)
    { x: 800, y: 380 },  // Bottom-right (Indian Ocean area)
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* <h2 className="text-xl font-bold mb-4 text-gray-800">Customer by Location</h2> */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Top 5 Customer Location</h2>
      
      {/* World Map with Background Image */}
      <div className="relative w-full bg-white rounded-lg overflow-hidden border border-gray-200" style={{ aspectRatio: '2/1' }}>
        {/* Background Map Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/asset/image/Customer_by_location_image_bg.png"
            alt="World Map"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
        
        {/* SVG Overlay for Markers */}
        <svg 
          viewBox="0 0 1000 500" 
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Top 5 Location Markers */}
          {top5Locations.map(({ state, count, index }) => {
            const position = markerPositions[index] || { x: 500, y: 250 };
            const isHovered = hoveredState === state;
            const isTopLocation = index === 0; // Highest count location
            
            // Size multipliers: top location is bigger
            const circleSizeMultiplier = isTopLocation ? 1.4 : 1.0;
            const textSizeMultiplier = isTopLocation ? 1.3 : 1.0;
            
            // Base sizes
            const baseCircleRadius = 35;
            const baseNumberFontSize = 20;
            const baseLabelFontSize = 18;
            
            // Calculate sizes
            const circleRadius = isHovered 
              ? (baseCircleRadius * circleSizeMultiplier) + 5 
              : baseCircleRadius * circleSizeMultiplier;
            const numberFontSize = isHovered 
              ? (baseNumberFontSize * textSizeMultiplier) + 2 
              : baseNumberFontSize * textSizeMultiplier;
            const labelFontSize = isHovered 
              ? (baseLabelFontSize * textSizeMultiplier) + 2 
              : baseLabelFontSize * textSizeMultiplier;
            const labelY = isHovered 
              ? (circleRadius + 25) 
              : (circleRadius + 20);
            
            return (
              <g
                key={state}
                transform={`translate(${position.x}, ${position.y})`}
                style={{ pointerEvents: 'all' }}
                onMouseEnter={() => {
                  setHoveredState(state);
                  setTooltipContent(`${state}: ${count} customer${count !== 1 ? 's' : ''}`);
                }}
                onMouseLeave={() => {
                  setHoveredState(null);
                  setTooltipContent("");
                }}
                className="cursor-pointer"
              >
                {/* Red Circle with Number */}
                <circle
                  cx={0}
                  cy={0}
                  r={circleRadius}
                  fill="#DC2626"
                  stroke="white"
                  strokeWidth={isTopLocation ? 3 : 2}
                  style={{ transition: 'r 0.2s ease' }}
                />
                
                {/* Number in Circle */}
                <text
                  x={0}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={numberFontSize}
                  fontWeight="700"
                  style={{ pointerEvents: 'none' }}
                >
                  {count}
                </text>
                
                {/* Name Below Circle - with stroke for visibility on any background */}
                <text
                  x={0}
                  y={labelY}
                  textAnchor="middle"
                  fill="#000000"
                  fontSize={labelFontSize}
                  fontWeight="700"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  paintOrder="stroke fill"
                  style={{ pointerEvents: 'none' }}
                >
                  {state}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default memo(GeoGraph);