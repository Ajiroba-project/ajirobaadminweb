import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import nigeriaStates from "./nigeria-states.json";

const GeoGraph = ({ setTooltipContent, customerByLocation = [] }) => {
  const [locationData, setLocationData] = useState({});
  const [maxCount, setMaxCount] = useState(0);

  useEffect(() => {
    if (customerByLocation && customerByLocation.length > 0) {
      // Create a map of state names to counts
      const dataMap = {};
      let highestCount = 0;

      customerByLocation
        .filter(item => item.state && item.state.trim() !== "") // Filter out empty state names
        .forEach(item => {
          if (item.state) {
            // Remove "State" suffix and trim whitespace
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
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [8, 9]
        }}
      >
        <ZoomableGroup>
          <Geographies geography={nigeriaStates}>
            {({ geographies }) => {
              // console.log("Geographies:", geographies);
              return geographies.map((geo) => {
                const stateName = geo.properties.name;
                const count = locationData[stateName] || 0;

                // console.log(`Rendering state: ${stateName}, Count: ${count}`);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
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
    </div>
  );
};

export default memo(GeoGraph);
