import React, { memo, useEffect, useState } from "react";

const GeoGraph = ({ setTooltipContent, customerByLocation = [] }) => {
  const [locationData, setLocationData] = useState({});
  const [maxCount, setMaxCount] = useState(0);

  useEffect(() => {
    if (customerByLocation && customerByLocation.length > 0) {
      const dataMap = {};
      let highestCount = 0;

      customerByLocation
        .filter(item => item.state && item.state.trim() !== "")
        .forEach(item => {
          if (item.state) {
            let stateName = item.state.replace(/ State$/i, "").trim();
            
            if (stateName === "FCT") stateName = "Abuja";
            if (stateName === "Federal Capital Territory") stateName = "Abuja";
            
            if (dataMap[stateName]) {
              dataMap[stateName] += item.count;
            } else {
              dataMap[stateName] = item.count;
            }

            if (dataMap[stateName] > highestCount) {
              highestCount = dataMap[stateName];
            }
          }
        });

      // console.log("Processed location data:", dataMap);
      setLocationData(dataMap);
      setMaxCount(highestCount);
    }
  }, [customerByLocation]);

  const getColor = (count) => {
    if (count === 0) return "#E5E7EB";
    if (count <= 2) return "#FED7AA";
    if (count <= 5) return "#FDBA74";
    if (count <= 10) return "#FB923C";
    if (count <= 20) return "#F97316";
    if (count <= 40) return "#EA580C";
    return "#C2410C";
  };

  const getIntensity = (count) => {
    if (count === 0) return 0;
    return Math.min((count / maxCount) * 100, 100);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer by Location</h2>
      
      {/* World Map SVG */}
      <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          {/* Background */}
          <rect width="1000" height="500" fill="#F3F4F6" />
          
          {/* Other continents in light gray */}
          {/* North America */}
          <path d="M50 80 Q80 60 120 70 Q180 65 200 90 Q220 85 240 95 Q280 90 300 110 Q320 105 340 120 L340 180 Q320 200 280 190 Q240 195 200 185 Q160 190 120 180 Q80 185 50 175 Z" fill="#D1D5DB" />
          
          {/* South America */}
          <path d="M180 220 Q200 210 230 215 Q260 210 280 230 Q290 250 285 280 Q280 310 270 340 Q260 370 250 390 Q240 400 220 395 Q200 390 190 370 Q185 340 180 310 Q175 280 175 250 Q175 230 180 220 Z" fill="#D1D5DB" />
          
          {/* Europe */}
          <path d="M420 60 Q450 55 480 65 Q510 60 530 75 Q550 70 570 85 L570 140 Q550 155 520 150 Q490 155 460 145 Q430 150 420 135 Z" fill="#D1D5DB" />
          
          {/* Asia */}
          <path d="M550 70 Q600 65 650 75 Q700 70 750 80 Q800 75 850 90 Q900 85 950 100 L950 200 Q920 220 870 210 Q820 215 770 205 Q720 210 670 200 Q620 205 570 195 Q550 200 550 180 Z" fill="#374151" />
          
          {/* Australia */}
          <path d="M750 350 Q780 345 810 355 Q840 350 860 365 Q870 375 865 390 Q860 400 840 395 Q810 400 780 390 Q750 395 730 380 Q725 370 730 360 Q735 350 750 350 Z" fill="#D1D5DB" />
          
          {/* Africa with Nigeria highlighted */}
          <g>
            {/* Rest of Africa */}
            <path d="M420 150 Q450 145 480 155 Q510 150 530 165 Q540 180 535 200 Q530 220 525 240 Q520 260 515 280 Q510 300 500 320 Q490 340 475 360 Q460 380 440 390 Q420 400 400 395 Q380 390 365 375 Q350 360 345 340 Q340 320 345 300 Q350 280 355 260 Q360 240 365 220 Q370 200 375 180 Q380 160 390 150 Q405 145 420 150 Z" fill="#D1D5DB" />
            
            {/* Nigeria highlighted */}
            <path 
              d="M445 200 Q465 195 485 205 Q495 215 490 230 Q485 240 475 235 Q465 240 455 235 Q445 230 440 220 Q440 210 445 200 Z" 
              fill={getColor(locationData["Lagos"] || 0)}
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onMouseEnter={() => {
                const totalCustomers = Object.values(locationData).reduce((a, b) => a + b, 0);
                setTooltipContent(`Nigeria: ${totalCustomers} customers across ${Object.keys(locationData).length} states`);
              }}
              onMouseLeave={() => setTooltipContent("")}
            />
            
            {/* Nigeria label */}
            <text x="465" y="220" textAnchor="middle" className="text-sm font-semibold fill-white">
              Nigeria
            </text>
          </g>
          
          {/* Greenland */}
          <path d="M320 20 Q350 15 380 25 Q390 35 385 50 Q380 60 360 55 Q340 60 320 50 Q315 40 315 30 Q315 20 320 20 Z" fill="#FB923C" />
          <text x="350" y="40" textAnchor="middle" className="text-xs font-semibold fill-white">
            Ikeja
          </text>
        </svg>
      </div>
      
      {/* Detailed Nigeria Map */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Nigeria - State Distribution</h3>
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Nigeria outline */}
            <path d="M20 100 Q50 80 100 85 Q150 80 200 90 Q250 85 300 95 Q350 90 380 110 Q390 130 385 150 Q380 170 360 175 Q320 180 280 175 Q240 180 200 170 Q160 175 120 165 Q80 170 40 160 Q20 140 20 120 Q15 110 20 100 Z" 
                  fill="#F9FAFB" 
                  stroke="#D1D5DB" 
                  strokeWidth="2"/>
            
            {/* State dots with data */}
            {Object.entries(locationData).map(([state, count], index) => {
              const positions = {
                Lagos: { x: 60, y: 160 },
                Ogun: { x: 80, y: 150 },
                Ondo: { x: 100, y: 150 },
                Edo: { x: 120, y: 140 },
                Osun: { x: 90, y: 140 },
                Ekiti: { x: 110, y: 135 },
                Benue: { x: 180, y: 120 },
                Imo: { x: 160, y: 150 },
                Abia: { x: 180, y: 155 },
                "Akwa Ibom": { x: 200, y: 160 },
                Adamawa: { x: 280, y: 100 },
                Abuja: { x: 150, y: 110 },
                // Add more positions as needed
              };
              
              const position = positions[state] || { x: 50 + (index * 30), y: 130 };
              const radius = Math.max(3, Math.min(15, (count / maxCount) * 15));
              
              return (
                <g key={state}>
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={radius}
                    fill={getColor(count)}
                    className="cursor-pointer transition-all duration-200 hover:scale-110"
                    onMouseEnter={() => setTooltipContent(`${state}: ${count} customer${count !== 1 ? 's' : ''}`)}
                    onMouseLeave={() => setTooltipContent("")}
                  />
                  {count > 5 && (
                    <text
                      x={position.x}
                      y={position.y + 4}
                      textAnchor="middle"
                      className="text-xs font-bold fill-white pointer-events-none"
                    >
                      {count}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">0 customers</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-200 rounded"></div>
          <span className="text-sm text-gray-600">1-5 customers</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-400 rounded"></div>
          <span className="text-sm text-gray-600">6-20 customers</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-600 rounded"></div>
          <span className="text-sm text-gray-600">21-40 customers</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-800 rounded"></div>
          <span className="text-sm text-gray-600">40+ customers</span>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-800">{Object.keys(locationData).length}</div>
          <div className="text-sm text-gray-600">States Active</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-800">{Object.values(locationData).reduce((a, b) => a + b, 0)}</div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-800">{Math.max(...Object.values(locationData), 0)}</div>
          <div className="text-sm text-gray-600">Top State</div>
        </div>
      </div>
    </div>
  );
};

export default memo(GeoGraph);