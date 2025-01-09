import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

const CustomerByLocation = () => {
  const highlightedLocations = ['Nigeria', 'United States', 'Russia'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Customer by Location</h2>
      <div className="h-64">
        <ComposableMap projection="geoMercator" className="w-full h-full">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHighlighted = highlightedLocations.includes(
                  geo.properties.name
                );
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHighlighted ? '#F25E26' : '#E5E5E5'}
                    stroke="#FFFFFF"
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};

const GeoGrapgh = () => {
  return (
    <div className="p-8 bg-[#F6F6F6] flex flex-col items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        <CustomerByLocation />
      </div>
    </div>
  );
};

export default GeoGrapgh;
