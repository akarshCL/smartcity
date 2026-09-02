// All mock data lives here so every module renders from the same shape
// instead of hardcoding numbers inline.

export function makeRoads() {
  return [
    { id: 'A12', label: 'Road A12', path: 'M40,120 L760,120', level: 'high', pct: 92, speed: 22, vph: 1842 },
    { id: 'B08', label: 'Road B08', path: 'M40,220 L760,220', level: 'moderate', pct: 61, speed: 38, vph: 1120 },
    { id: 'C21', label: 'Road C21', path: 'M40,320 L760,320', level: 'normal', pct: 34, speed: 52, vph: 640 },
    { id: 'D17', label: 'Road D17', path: 'M150,40 L150,420', level: 'high', pct: 72, speed: 26, vph: 1500 },
    { id: 'E05', label: 'Road E05', path: 'M400,40 L400,420', level: 'moderate', pct: 55, speed: 40, vph: 980 },
    { id: 'F09', label: 'Road F09', path: 'M650,40 L650,420', level: 'normal', pct: 28, speed: 48, vph: 520 },
  ];
}

export function makeFacilities() {
  return [
    { id: 'hospital', type: 'hospital', name: 'City Hospital', x: 150, y: 120,
      info: { 'Emergency Capacity': '78%', 'Available Beds': '42', 'Ambulances': '5', 'Status': 'OPERATIONAL' } },
    { id: 'police', type: 'police', name: 'Central Police HQ', x: 400, y: 220,
      info: { 'Units on Duty': '12', 'Avg Response': '4 min', 'Open Cases': '7', 'Status': 'OPERATIONAL' } },
    { id: 'fire', type: 'fire', name: 'Fire Station 07', x: 650, y: 120,
      info: { 'Trucks Ready': '6', 'Crew on Shift': '24', 'Calls Today': '3', 'Status': 'OPERATIONAL' } },
    { id: 'power', type: 'power', name: 'Nova Power Station', x: 150, y: 320,
      info: { 'Output': '2.4 MW', 'Grid Load': '77%', 'Reserve': 'Stable', 'Status': 'OPERATIONAL' } },
    { id: 'water', type: 'water', name: 'Water Treatment Plant', x: 650, y: 320,
      info: { 'Output': '420 MLD', 'Reserves': '87%', 'Quality Index': 'A', 'Status': 'OPERATIONAL' } },
    { id: 'bus1', type: 'bus', name: 'Central Bus Terminal', x: 400, y: 80,
      info: { 'Active Buses': '44', 'Platforms': '12', 'On-time Rate': '94%', 'Status': 'OPERATIONAL' } },
    { id: 'bus2', type: 'bus', name: 'Airport Transit Hub', x: 400, y: 360,
      info: { 'Active Buses': '31', 'Platforms': '8', 'On-time Rate': '91%', 'Status': 'OPERATIONAL' } },
  ];
}

export function makeSignals() {
  return [
    { id: 'SIG-1', x: 150, y: 120, level: 'high' },
    { id: 'SIG-2', x: 400, y: 220, level: 'moderate' },
    { id: 'SIG-3', x: 650, y: 120, level: 'normal' },
    { id: 'SIG-4', x: 150, y: 320, level: 'normal' },
  ];
}

export function makeEmergencies() {
  const now = Date.now();
  return [
    { id: 2048, type: 'Fire', icon: '🔥', location: 'Central District', x: 600, y: 200,
      time: now - 2 * 60000, severity: 'Critical', unit: 'Fire Unit 07', eta: '03:42', status: 'Responding' },
    { id: 2049, type: 'Medical', icon: '🚑', location: 'North Avenue', x: 250, y: 60,
      time: now - 6 * 60000, severity: 'High', unit: 'Ambulance 12', eta: '05:10', status: 'Responding' },
    { id: 2050, type: 'Accident', icon: '🚔', location: 'Airport Road', x: 500, y: 380,
      time: now - 11 * 60000, severity: 'Medium', unit: 'Patrol 04', eta: '02:15', status: 'Dispatched' },
  ];
}

export function makeTransport() {
  return [
    { id: 'BUS-102', mode: 'Bus', route: 'Central → Airport', status: 'ontime', statusText: 'On Time' },
    { id: 'BUS-208', mode: 'Bus', route: 'North → Downtown', status: 'delayed', statusText: 'Delayed 8 min' },
    { id: 'METRO-M2', mode: 'Metro', route: 'East → West', status: 'ontime', statusText: 'On Time' },
    { id: 'BUS-315', mode: 'Bus', route: 'Riverside → Central', status: 'ontime', statusText: 'On Time' },
    { id: 'METRO-M1', mode: 'Metro', route: 'North Loop', status: 'delayed', statusText: 'Delayed 4 min' },
    { id: 'BUS-047', mode: 'Bus', route: 'Airport → Suburbs', status: 'ontime', statusText: 'On Time' },
  ];
}

export function makeStreetlights() {
  return [
    { id: 'L101', name: 'Main Street', on: true, wattage: 3.2 },
    { id: 'L102', name: 'Park Avenue', on: true, wattage: 2.8 },
    { id: 'L103', name: 'River Road', on: false, wattage: 3.0 },
    { id: 'L104', name: 'Airport Road', on: true, wattage: 4.1 },
    { id: 'L105', name: 'Sector 12 Loop', on: true, wattage: 2.5 },
    { id: 'L106', name: 'Downtown Plaza', on: false, wattage: 3.6 },
  ];
}

export function makeAlerts() {
  const now = Date.now();
  return [
    { id: 'AL-1', icon: '⚠', text: 'Heavy traffic reported on Airport Road', time: now - 3 * 60000, read: false },
    { id: 'AL-2', icon: '✓', text: 'Water supply restored in Sector 12', time: now - 20 * 60000, read: false },
    { id: 'AL-3', icon: '⚡', text: 'Power consumption increased by 12%', time: now - 34 * 60000, read: true },
    { id: 'AL-4', icon: '🚨', text: 'Emergency unit dispatched to Central District', time: now - 2 * 60000, read: false },
  ];
}

export function makeEnvironment() {
  return {
    pm25: 32, pm10: 58, co2: 412, no2: 21,
    aqi: 74, aqiStatus: 'Moderate',
    greenZones: 24, sensors: 148, healthyZonesPct: 81,
  };
}

function buildSeries(len, base, spread) {
  return Array.from({ length: len }, (_, i) => Math.round(base + Math.sin(i / 2) * spread + Math.random() * spread * 0.4));
}

export function makeEnergy() {
  return {
    current: 1.84, todayMWh: 42.7, solarPct: 34, gridPct: 66,
    history: {
      '24h': buildSeries(24, 55, 30),
      '7d': buildSeries(7, 60, 20),
      '30d': buildSeries(30, 58, 25),
    },
  };
}

export function makeWater() {
  return {
    supplyPct: 87, status: 'Normal',
    zones: [
      { name: 'Sector 4 Reservoir', pct: 92 },
      { name: 'Sector 9 Reservoir', pct: 81 },
      { name: 'Riverside Tank', pct: 74 },
      { name: 'Hillview Tank', pct: 95 },
      { name: 'Downtown Mains', pct: 88 },
    ],
  };
}

// export function makeWeather() {
//   return {
//     temp: 28, feelsLike: 30, condition: 'Partly Cloudy',
//     humidity: 68, wind: 14, visibility: 8,
//     forecast: [
//       { day: 'Thu', icon: '⛅', temp: 29 },
//       { day: 'Fri', icon: '☀️', temp: 31 },
//       { day: 'Sat', icon: '🌦', temp: 27 },
//       { day: 'Sun', icon: '⛅', temp: 28 },
//       { day: 'Mon', icon: '☀️', temp: 30 },
//     ],
//   };
// }
export async function makeWeather(
  latitude = 28.6139,
  longitude = 77.2090
) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility` +
    `&daily=temperature_2m_max,weather_code` +
    `&timezone=auto` +
    `&forecast_days=5`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  return {
    temp: Math.round(data.current.temperature_2m),

    feelsLike: Math.round(data.current.apparent_temperature),

    condition: getWeatherCondition(data.current.weather_code),

    humidity: data.current.relative_humidity_2m,

    wind: Math.round(data.current.wind_speed_10m),

    visibility: Math.round(data.current.visibility / 1000),

    forecast: data.daily.time.map((date, index) => ({
      day: new Date(date).toLocaleDateString("en-US", {
        weekday: "short"
      }),

      icon: getWeatherIcon(data.daily.weather_code[index]),

      temp: Math.round(data.daily.temperature_2m_max[index])
    }))
  };
}

function getWeatherCondition(code) {
  if (code === 0) return "Clear Sky";

  if ([1, 2, 3].includes(code))
    return "Partly Cloudy";

  if ([45, 48].includes(code))
    return "Foggy";

  if ([51, 53, 55, 56, 57].includes(code))
    return "Drizzle";

  if ([61, 63, 65, 66, 67].includes(code))
    return "Rainy";

  if ([71, 73, 75, 77].includes(code))
    return "Snowy";

  if ([80, 81, 82].includes(code))
    return "Rain Showers";

  if ([95, 96, 99].includes(code))
    return "Thunderstorm";

  return "Unknown";
}


function getWeatherIcon(code) {
  if (code === 0)
    return "☀️";

  if ([1, 2, 3].includes(code))
    return "⛅";

  if ([45, 48].includes(code))
    return "🌫️";

  if ([51, 53, 55, 56, 57].includes(code))
    return "🌦️";

  if ([61, 63, 65, 66, 67].includes(code))
    return "🌧️";

  if ([71, 73, 75, 77].includes(code))
    return "❄️";

  if ([80, 81, 82].includes(code))
    return "🌦️";

  if ([95, 96, 99].includes(code))
    return "⛈️";

  return "🌤️";
}