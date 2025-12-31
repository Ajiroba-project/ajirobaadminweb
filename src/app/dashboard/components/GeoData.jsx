import React, { memo, useEffect, useState } from "react";

const GeoGraph = ({ setTooltipContent, customerByLocation = [] }) => {
  const [locationData, setLocationData] = useState({});
  const [maxCount, setMaxCount] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [topState, setTopState] = useState({ name: "", count: 0 });
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

      // Find top state
      let topStateName = "";
      let topStateCount = 0;
      Object.entries(dataMap).forEach(([state, count]) => {
        if (count > topStateCount) {
          topStateCount = count;
          topStateName = state;
        }
      });

      setLocationData(dataMap);
      setMaxCount(highestCount);
      setTotalCustomers(total);
      setTopState({ name: topStateName, count: topStateCount });
    } else {
      // Reset when no data
      setLocationData({});
      setMaxCount(0);
      setTotalCustomers(0);
      setTopState({ name: "", count: 0 });
    }
  }, [customerByLocation]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Customer by Location</h2>
      
      {/* World Map SVG */}
      <div className="relative w-full bg-white rounded-lg overflow-hidden border border-gray-200">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          {/* Background - white */}
          <rect width="1000" height="500" fill="#FFFFFF" />
          
          {/* Other continents in light blue/white */}
          {/* North America - United States in gray */}
          <path d="M50 80 Q80 60 120 70 Q180 65 200 90 Q220 85 240 95 Q280 90 300 110 Q320 105 340 120 L340 180 Q320 200 280 190 Q240 195 200 185 Q160 190 120 180 Q80 185 50 175 Z" fill="#9CA3AF" />
          
          {/* Canada */}
          <path d="M50 30 Q80 25 120 35 Q150 30 180 40 Q200 45 220 50 L220 80 Q200 75 180 70 Q150 75 120 65 Q80 70 50 60 Z" fill="#E0F2FE" />
          
          {/* South America */}
          <path d="M180 220 Q200 210 230 215 Q260 210 280 230 Q290 250 285 280 Q280 310 270 340 Q260 370 250 390 Q240 400 220 395 Q200 390 190 370 Q185 340 180 310 Q175 280 175 250 Q175 230 180 220 Z" fill="#E0F2FE" />
          
          {/* Europe */}
          <path d="M420 60 Q450 55 480 65 Q510 60 530 75 Q550 70 570 85 L570 140 Q550 155 520 150 Q490 155 460 145 Q430 150 420 135 Z" fill="#E0F2FE" />
          
          {/* Asia - Russia in black */}
          <path d="M550 70 Q600 65 650 75 Q700 70 750 80 Q800 75 850 90 Q900 85 950 100 L950 200 Q920 220 870 210 Q820 215 770 205 Q720 210 670 200 Q620 205 570 195 Q550 200 550 180 Z" fill="#000000" />
          
          {/* Rest of Asia */}
          <path d="M750 200 Q800 195 850 205 Q870 220 860 240 Q850 260 830 250 Q800 255 770 245 Q750 230 750 200 Z" fill="#E0F2FE" />
          
          {/* Australia */}
          <path d="M750 350 Q780 345 810 355 Q840 350 860 365 Q870 375 865 390 Q860 400 840 395 Q810 400 780 390 Q750 395 730 380 Q725 370 730 360 Q735 350 750 350 Z" fill="#E0F2FE" />
          
          {/* Africa */}
          <path d="M420 150 Q450 145 480 155 Q510 150 530 165 Q540 180 535 200 Q530 220 525 240 Q520 260 515 280 Q510 300 500 320 Q490 340 475 360 Q460 380 440 390 Q420 400 400 395 Q380 390 365 375 Q350 360 345 340 Q340 320 345 300 Q350 280 355 260 Q360 240 365 220 Q370 200 375 180 Q380 160 390 150 Q405 145 420 150 Z" fill="#E0F2FE" />
          
          {/* Nigeria region - highlighted with data */}
          <path 
            d="M445 200 Q465 195 485 205 Q495 215 490 230 Q485 240 475 235 Q465 240 455 235 Q445 230 440 220 Q440 210 445 200 Z" 
            fill={totalCustomers > 0 ? "#FB923C" : "#E0F2FE"}
            className="cursor-pointer"
            onMouseEnter={() => {
              if (totalCustomers > 0) {
                const stateCount = Object.keys(locationData).length;
                setTooltipContent(`Nigeria: ${totalCustomers} customers across ${stateCount} states`);
              } else {
                setTooltipContent("Nigeria: No data");
              }
            }}
            onMouseLeave={() => setTooltipContent("")}
          />
          
          {/* Greenland - Orange with label showing top state */}
          <path 
            d="M320 20 Q350 15 380 25 Q390 35 385 50 Q380 60 360 55 Q340 60 320 50 Q315 40 315 30 Q315 20 320 20 Z" 
            fill="#FB923C"
            className="cursor-pointer"
            onMouseEnter={() => {
              if (topState.name) {
                setTooltipContent(`${topState.name}: ${topState.count} customers`);
              } else {
                setTooltipContent("Ikeja");
              }
            }}
            onMouseLeave={() => setTooltipContent("")}
          />
          <text 
            x="350" 
            y="40" 
            textAnchor="middle" 
            className="text-sm font-semibold"
            fill="#6B7280"
          >
            {topState.name || "Ikeja"}
          </text>
          
          {/* Display all states with their counts on the map */}
          {/* Render non-hovered states first */}
          {Object.entries(locationData)
            .filter(([state]) => hoveredState !== state)
            .map(([state, count], index) => {
              const originalIndex = Object.keys(locationData).indexOf(state);
              return { state, count, index: originalIndex };
            })
            .map(({ state, count, index: originalIndex }) => {
            // Position states around the Nigeria region and other areas
            const positions = [
              // Around Nigeria region
              { x: 440, y: 210, region: "nigeria" },
              { x: 460, y: 200, region: "nigeria" },
              { x: 480, y: 210, region: "nigeria" },
              { x: 470, y: 225, region: "nigeria" },
              { x: 450, y: 225, region: "nigeria" },
              { x: 430, y: 215, region: "nigeria" },
              // Around other regions for overflow
              { x: 100, y: 100, region: "other" },
              { x: 150, y: 120, region: "other" },
              { x: 200, y: 140, region: "other" },
              { x: 250, y: 160, region: "other" },
              { x: 300, y: 180, region: "other" },
              { x: 600, y: 150, region: "other" },
              { x: 650, y: 170, region: "other" },
              { x: 700, y: 190, region: "other" },
            ];
            
            const position = positions[originalIndex] || { x: 100 + (originalIndex * 50), y: 100 + (originalIndex % 5) * 30, region: "other" };
            const isNigeriaRegion = position.region === "nigeria";
            const isHovered = hoveredState === state;
            const baseRadius = isNigeriaRegion ? 40 : 35;
            const hoverRadius = baseRadius * 1.8;
            const currentRadius = isHovered ? hoverRadius : baseRadius;
            const percentage = maxCount > 0 ? ((count / maxCount) * 100).toFixed(1) : 0;
            
            const scale = isHovered ? 1.8 : 1;
            
            return (
              <g 
                key={state}
                transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
                className="cursor-pointer state-marker"
                onMouseEnter={() => {
                  setHoveredState(state);
                  setTooltipContent(`${state}: ${count} customer${count !== 1 ? 's' : ''} (${percentage}% of max)`);
                }}
                onMouseLeave={() => {
                  setHoveredState(null);
                  setTooltipContent("");
                }}
              >
                {/* Large invisible hit area - makes hovering easier even when behind other markers */}
                <circle
                  cx={0}
                  cy={0}
                  r={baseRadius * 2.5}
                  fill="transparent"
                  stroke="none"
                  pointerEvents="all"
                />
                
                {/* Outer glow effect on hover */}
                {isHovered && (
                  <circle
                    cx={0}
                    cy={0}
                    r={baseRadius + 8}
                    fill="#FB923C"
                    fillOpacity="0.15"
                    pointerEvents="none"
                  />
                )}
                
                {/* Background circle */}
                <circle
                  cx={0}
                  cy={0}
                  r={baseRadius}
                  fill="white"
                  fillOpacity="0.95"
                  stroke="#FB923C"
                  strokeWidth={isHovered ? 4 : 3}
                  pointerEvents="none"
                />
                
                {/* Inner colored circle based on count */}
                <circle
                  cx={0}
                  cy={0}
                  r={baseRadius * 0.7}
                  fill="#FB923C"
                  fillOpacity="0.25"
                  pointerEvents="none"
                />
                
                {/* State name */}
                <text
                  x={0}
                  y={-baseRadius * 0.35}
                  textAnchor="middle"
                  className="text-xs font-bold"
                  fill="#1F2937"
                  fontSize={isHovered ? "14" : "12"}
                  pointerEvents="none"
                >
                  {state}
                </text>
                
                {/* Count */}
                <text
                  x={0}
                  y={baseRadius * 0.25}
                  textAnchor="middle"
                  className="font-bold"
                  fill="#FB923C"
                  fontSize={isHovered ? "20" : "16"}
                  pointerEvents="none"
                >
                  {count}
                </text>
                
                {/* Additional details on hover */}
                {/* {isHovered && (
                  <>
                    <text
                      x={0}
                      y={baseRadius * 0.5}
                      textAnchor="middle"
                      className="text-xs font-medium"
                      fill="#6B7280"
                      fontSize="11"
                    >
                      customers
                    </text>
                    <text
                      x={0}
                      y={baseRadius * 0.7}
                      textAnchor="middle"
                      className="text-xs font-medium"
                      fill="#9CA3AF"
                      fontSize="10"
                    >
                      {percentage}% of max
                    </text>
                  </>
                )} */}
              </g>
            );
          })}
          
          {/* Render hovered state last (on top) */}
          {hoveredState && locationData[hoveredState] && (() => {
            const state = hoveredState;
            const count = locationData[state];
            const originalIndex = Object.keys(locationData).indexOf(state);
            const positions = [
              { x: 440, y: 210, region: "nigeria" },
              { x: 460, y: 200, region: "nigeria" },
              { x: 480, y: 210, region: "nigeria" },
              { x: 470, y: 225, region: "nigeria" },
              { x: 450, y: 225, region: "nigeria" },
              { x: 430, y: 215, region: "nigeria" },
              { x: 100, y: 100, region: "other" },
              { x: 150, y: 120, region: "other" },
              { x: 200, y: 140, region: "other" },
              { x: 250, y: 160, region: "other" },
              { x: 300, y: 180, region: "other" },
              { x: 600, y: 150, region: "other" },
              { x: 650, y: 170, region: "other" },
              { x: 700, y: 190, region: "other" },
            ];
            const position = positions[originalIndex] || { x: 100 + (originalIndex * 50), y: 100 + (originalIndex % 5) * 30, region: "other" };
            const isNigeriaRegion = position.region === "nigeria";
            const baseRadius = isNigeriaRegion ? 40 : 35;
            const scale = 1.8;
            const percentage = maxCount > 0 ? ((count / maxCount) * 100).toFixed(1) : 0;
            
            return (
              <g 
                key={`${state}-hovered`}
                transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
                className="cursor-pointer state-marker"
                onMouseEnter={() => {
                  setHoveredState(state);
                  setTooltipContent(`${state}: ${count} customer${count !== 1 ? 's' : ''} (${percentage}% of max)`);
                }}
                onMouseLeave={() => {
                  setHoveredState(null);
                  setTooltipContent("");
                }}
              >
                {/* Large invisible hit area */}
                <circle
                  cx={0}
                  cy={0}
                  r={baseRadius * 2.5}
                  fill="transparent"
                  stroke="none"
                  pointerEvents="all"
                />
                
                {/* Outer glow effect */}
                <circle
                  cx={0}
                  cy={0}
                  r={baseRadius + 8}
                  fill="#FB923C"
                  fillOpacity="0.15"
                  pointerEvents="none"
                />
                
                {/* Background circle */}
                <circle
                  cx={0}
                  cy={0}
                  r={baseRadius}
                  fill="white"
                  fillOpacity="0.95"
                  stroke="#FB923C"
                  strokeWidth={4}
                  pointerEvents="none"
                />
                
                {/* Inner colored circle */}
                <circle
                  cx={0}
                  cy={0}
                  r={baseRadius * 0.7}
                  fill="#FB923C"
                  fillOpacity="0.25"
                  pointerEvents="none"
                />
                
                {/* State name */}
                <text
                  x={0}
                  y={-baseRadius * 0.35}
                  textAnchor="middle"
                  className="text-xs font-bold"
                  fill="#1F2937"
                  fontSize="14"
                  pointerEvents="none"
                >
                  {state}
                </text>
                
                {/* Count */}
                <text
                  x={0}
                  y={baseRadius * 0.25}
                  textAnchor="middle"
                  className="font-bold"
                  fill="#FB923C"
                  fontSize="20"
                  pointerEvents="none"
                >
                  {count}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

export default memo(GeoGraph);