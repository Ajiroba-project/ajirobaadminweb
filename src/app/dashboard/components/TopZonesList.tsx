import { fraudData } from "./fraudData";

const TopZonesList = () => {
  return (
    <div className="w-1/3 bg-white shadow-md rounded-md  p-4 shadowCard">
    <div className="text-sm font-semibold leading-5">Top hot zones </div>
    <div className="text-[10px] mb-5 leading-3 text-gray-500">Top Fraudulent Transaction geolocation</div>

      <ul >
        {fraudData.map((zone, index) => (
          <li
            key={index}
            className="flex justify-between py-2 border-b last:border-b-0"
          >
            <span className="">
              {index + 1}. {zone.name || "Unknown"}
            </span>
            <span className="font-medium ">{zone.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopZonesList;
