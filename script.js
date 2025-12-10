const btn = document.querySelector("button");
const input = document.querySelector("#cityInput");
const gpsDiv = document.querySelector("#gps");
const cityTitle = document.querySelector("#city");
const temperatureDiv = document.querySelector("#temperature");


async function fetchCoordinates(cityName) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${cityName}&format=json&limit=1`);
        const data = await response.json();
        if (!data || data.length === 0) return null;
        const { lat, lon, display_name } = data[0];
        if (!lat || !lon) return null;
        return { lat: parseFloat(lat), lon: parseFloat(lon), name: display_name.split(",")[0].trim() };
    } catch (error) {
        console.error("Erreur fetchCoordinates:", error);
        return null;
    }
}

async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        if (!data.current_weather || data.current_weather.temperature === undefined) return null;
        return data.current_weather.temperature;
    } catch (error) {
        console.error("Erreur fetchWeather:", error);
        return null;
    }
}


btn.addEventListener("click", async () => {
    const cityName = input.value.trim();
    if (!cityName) return;

    cityTitle.textContent = "Chargement...";
    gpsDiv.textContent = "";
    temperatureDiv.textContent = "-°C";

    const coords = await fetchCoordinates(cityName);
    if (!coords) {
        cityTitle.textContent = "Ville introuvable";
        gpsDiv.textContent = "";
        temperatureDiv.textContent = "-°C";
        return;
    }

    cityTitle.textContent = coords.name;
    gpsDiv.textContent = `Coordonnées GPS : ${coords.lat}, ${coords.lon}`;

    const temp = await fetchWeather(coords.lat, coords.lon);
    if (temp !== null) {
        temperatureDiv.textContent = `${temp}°C`;

    } else {
        temperatureDiv.textContent = `Température non disponible`;
    }
});