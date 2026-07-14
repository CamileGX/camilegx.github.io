const weatherCodes = {0:"Clear sky",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Foggy",51:"Light drizzle",61:"Light rain",63:"Rain",71:"Snow",80:"Rain showers",95:"Thunderstorm"};
export async function getWeather() {
  if (!navigator.geolocation) throw new Error("Geolocation is not available in this browser.");
  const position = await new Promise((resolve,reject) => navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout:10000,maximumAge:600000}));
  const { latitude, longitude } = position.coords;
  const [weather, place] = await Promise.all([
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`).then(r=>r.json()),
    fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1`).then(r=>r.json())
  ]);
  return { city:place.results?.[0]?.name || "Your location", temperature:Math.round(weather.current.temperature_2m), condition:weatherCodes[weather.current.weather_code] || "Current conditions", timezone:weather.timezone };
}
