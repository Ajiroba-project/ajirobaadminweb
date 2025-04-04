// import React, { memo } from "react";
// import {
//   ZoomableGroup,
//   ComposableMap,
//   Geographies,
//   Geography
// } from "react-simple-maps";

// const GeoGrapgh = ({ setTooltipContent }) => {
//   return (
//     <div data-tip="" className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">Customer by Location</h2>
//       <ComposableMap>
//         <ZoomableGroup>
//           <Geographies geography="/features.json">
//             {({ geographies }) =>
//               geographies.map((geo) => (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   onMouseEnter={() => {
//                     setTooltipContent(`${geo.properties.name}`);
//                   }}
//                   onMouseLeave={() => {
//                     setTooltipContent("");
//                   }}
//                   style={{
//                     default: {
//                       fill: "#D6D6DA",
//                       outline: "none"
//                     },
//                     hover: {
//                       fill: "#F53",
//                       outline: "none"
//                     },
//                     pressed: {
//                       fill: "#E42",
//                       outline: "none"
//                     }
//                   }}
//                 />
//               ))
//             }
//           </Geographies>
//         </ZoomableGroup>
//       </ComposableMap>
//     </div>
//   );
// };

// export default memo(GeoGrapgh);






// import React, { memo, useEffect, useState } from "react";
// import {
//   ZoomableGroup,
//   ComposableMap,
//   Geographies,
//   Geography
// } from "react-simple-maps";
// import { scaleQuantize } from "d3-scale";

// const GeoGraph = ({ setTooltipContent, customerByLocation = [] }) => {
//   const [locationData, setLocationData] = useState({});
//   const [maxCount, setMaxCount] = useState(0);

//   // Process customer data on component mount or when it changes
//   useEffect(() => {
//     if (customerByLocation && customerByLocation.length > 0) {
//       // Create a map of state names to counts
//       const dataMap = {};
//       let highestCount = 0;

//       customerByLocation.forEach(item => {
//         if (item.state) {
//           // Standardize state names if needed
//           const stateName = item.state.replace(" State", "").trim();
//           dataMap[stateName] = item.count;

//           // Track highest count for scale
//           if (item.count > highestCount) {
//             highestCount = item.count;
//           }
//         }
//       });

//       setLocationData(dataMap);
//       setMaxCount(highestCount);
//     }
//   }, [customerByLocation]);

//   // Create a color scale based on the data
//   const colorScale = scaleQuantize()
//     .domain([0, maxCount || 13])
//     .range([
//       "#E5F5F9",
//       "#C7EAFD",
//       "#9ED0F5",
//       "#81B5E9",
//       "#6099DB",
//       "#3D7CC9",
//       "#1D5CB3",
//       "#0E3D91"
//     ]);

//   return (
//     <div data-tip="" className="bg-white p-6 rounded-lg shadow-lg">
//       <h2 className="text-lg font-semibold mb-4">Customer by Location</h2>
//       <ComposableMap projection="geoMercator" projectionConfig={{ scale: 800, center: [8, 9] }}>
//         <ZoomableGroup>
//           <Geographies geography="/features.json">
//             {({ geographies }) =>
//               geographies.map((geo) => {
//                 // Get the state name from geography properties
//                 const stateName = geo.properties.name;
//                 // Get the count for this state, default to 0
//                 const count = locationData[stateName] || 0;

//                 return (
//                   <Geography
//                     key={geo.rsmKey}
//                     geography={geo}
//                     onMouseEnter={() => {
//                       setTooltipContent(`${stateName}: ${count} customer${count !== 1 ? 's' : ''}`);
//                     }}
//                     onMouseLeave={() => {
//                       setTooltipContent("");
//                     }}
//                     style={{
//                       default: {
//                         fill: count > 0 ? colorScale(count) : "#D6D6DA",
//                         outline: "none"
//                       },
//                       hover: {
//                         fill: "#F53",
//                         outline: "none"
//                       },
//                       pressed: {
//                         fill: "#E42",
//                         outline: "none"
//                       }
//                     }}
//                   />
//                 );
//               })
//             }
//           </Geographies>
//         </ZoomableGroup>
//       </ComposableMap>
//       <div className="mt-4 flex justify-between text-xs">
//         <div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-gray-300 mr-1"></div>
//             <span>No Data</span>
//           </div>
//         </div>
//         <div className="flex">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="flex items-center ml-2">
//               <div
//                 className="w-3 h-3 mr-1"
//                 style={{ backgroundColor: colorScale((i + 1) * (maxCount / 4)) }}
//               ></div>
//               <span>{i === 0 ? 'Low' : i === 3 ? 'High' : ''}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default memo(GeoGraph);



// import React, { memo, useEffect, useState } from "react";
// import {
//   ZoomableGroup,
//   ComposableMap,
//   Geographies,
//   Geography
// } from "react-simple-maps";
// import { scaleQuantize } from "d3-scale";

// const GeoGraph = ({ setTooltipContent, customerByLocation = [] }) => {
//   const [locationData, setLocationData] = useState({});
//   const [maxCount, setMaxCount] = useState(0);

//   // Process customer data on component mount or when it changes
//   useEffect(() => {
//     if (customerByLocation && customerByLocation.length > 0) {
//       // Create a map of state names to counts
//       const dataMap = {};
//       let highestCount = 0;

//       customerByLocation.forEach(item => {
//         if (item.state) {
//           // Standardize state names if needed
//           const stateName = item.state.replace(" State", "").trim();
//           dataMap[stateName] = item.count;

//           // Track highest count for scale
//           if (item.count > highestCount) {
//             highestCount = item.count;
//           }
//         }
//       });

//       console.log("Processed location data:", dataMap);
//       setLocationData(dataMap);
//       setMaxCount(highestCount);
//     }
//   }, [customerByLocation]);

//   // Create a color scale based on the data
//   const colorScale = scaleQuantize()
//     .domain([0, maxCount || 13])
//     .range([
//       "#E5F5F9",
//       "#C7EAFD",
//       "#9ED0F5",
//       "#81B5E9",
//       "#6099DB",
//       "#3D7CC9",
//       "#1D5CB3",
//       "#0E3D91"
//     ]);

//   return (
//     <div data-tip="" className="bg-white p-6 rounded-lg shadow-lg">
//       <h2 className="text-lg font-semibold mb-4">Customer by Location</h2>
//       <ComposableMap projection="geoMercator" projectionConfig={{ scale: 800, center: [8, 9] }}>
//         <ZoomableGroup>
//           <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/countries/nigeria/nigeria-states.json">
//             {({ geographies }) => {
//               console.log("Loaded geographies:", geographies.map(geo => geo.properties.name));
//               return geographies.map((geo) => {
//                 // Get the state name from geography properties
//                 const stateName = geo.properties.name;
//                 // Get the count for this state, default to 0
//                 const count = locationData[stateName] || 0;

//                 return (
//                   <Geography
//                     key={geo.rsmKey}
//                     geography={geo}
//                     onMouseEnter={() => {
//                       console.log(`Hovering over: ${stateName}, Count: ${count}`);
//                       setTooltipContent(`${stateName}: ${count} customer${count !== 1 ? 's' : ''}`);
//                     }}
//                     onMouseLeave={() => {
//                       setTooltipContent("");
//                     }}
//                     style={{
//                       default: {
//                         fill: count > 0 ? colorScale(count) : "#D6D6DA",
//                         outline: "none"
//                       },
//                       hover: {
//                         fill: "#F53",
//                         outline: "none"
//                       },
//                       pressed: {
//                         fill: "#E42",
//                         outline: "none"
//                       }
//                     }}
//                   />
//                 );
//               });
//             }}
//           </Geographies>
//         </ZoomableGroup>
//       </ComposableMap>
//       <div className="mt-4 flex justify-between text-xs">
//         <div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-gray-300 mr-1"></div>
//             <span>No Data</span>
//           </div>
//         </div>
//         <div className="flex">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="flex items-center ml-2">
//               <div
//                 className="w-3 h-3 mr-1"
//                 style={{ backgroundColor: colorScale((i + 1) * (maxCount / 4)) }}
//               ></div>
//               <span>{i === 0 ? 'Low' : i === 3 ? 'High' : ''}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default memo(GeoGraph);



import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { scaleQuantize } from "d3-scale";

const GeoGraph = ({ setTooltipContent, customerByLocation = [] }) => {
  const [locationData, setLocationData] = useState({});
  const [maxCount, setMaxCount] = useState(0);

  // Process customer data on component mount or when it changes
  useEffect(() => {
    if (customerByLocation && customerByLocation.length > 0) {
      // Create a map of state names to counts
      const dataMap = {};
      let highestCount = 0;

      customerByLocation
        .filter(item => item.state.trim() !== "") // Filter out empty state names
        .forEach(item => {
          if (item.state) {
            const stateName = item.state.replace(" State", "").trim();
            dataMap[stateName] = item.count;

            // Track highest count for scale
            if (item.count > highestCount) {
              highestCount = item.count;
            }
          }
        });

      console.log("Processed location data:", dataMap);
      setLocationData(dataMap);
      setMaxCount(highestCount);
    }
  }, [customerByLocation]);

  // Create a color scale based on the data
  const colorScale = scaleQuantize()
    .domain([0, maxCount || 13])
    .range([
      "#E5F5F9",
      "#C7EAFD",
      "#9ED0F5",
      "#81B5E9",
      "#6099DB",
      "#3D7CC9",
      "#1D5CB3",
      "#0E3D91"
    ]);

  return (
    <div data-tip="" className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Customer by Location</h2>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 800, center: [8, 9] }}>
        <ZoomableGroup>
          <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/countries/nigeria/nigeria-states.json">
            {({ geographies }) => {
              console.log("Loaded geographies:", geographies.map(geo => geo.properties.name));
              return geographies.map((geo) => {
                const stateName = geo.properties.name;
                const count = locationData[stateName] || 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      console.log(`Hovering over: ${stateName}, Count: ${count}`);
                      setTooltipContent(`${stateName}: ${count} customer${count !== 1 ? 's' : ''}`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    style={{
                      default: {
                        fill: count > 0 ? colorScale(count) : "#D6D6DA",
                        outline: "none"
                      },
                      hover: {
                        fill: "#F53",
                        outline: "none"
                      },
                      pressed: {
                        fill: "#E42",
                        outline: "none"
                      }
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {/* <div className="mt-4 flex justify-between text-xs">
        <div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 mr-1"></div>
            <span>No Data</span>
          </div>
        </div>
        <div className="flex">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center ml-2">
              <div
                className="w-3 h-3 mr-1"
                style={{ backgroundColor: colorScale((i + 1) * (maxCount / 4)) }}
              ></div>
              <span>{i === 0 ? 'Low' : i === 3 ? 'High' : ''}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default memo(GeoGraph);
