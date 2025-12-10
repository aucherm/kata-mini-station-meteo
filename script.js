const btn = document.querySelector("button");
const input = document.querySelector("#cityInput");
const gpsDiv = document.querySelector("#gps");
const cityTitle = document.querySelector("#city");

btn.addEventListener("click", async () => {

    const cityName = input.value.trim();
    if (cityName === "") return;

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${cityName}&format=json&limit=1`);

        const data = await response.json();

        if (data.length === 0) {
            cityTitle.textContent = "Erreur";
            gpsDiv.textContent = "Impossible de trouver la ville";
            return;
        }

        const { lat, lon, display_name } = data[0];

        const cityShortName = display_name.split(",")[0].trim();
        cityTitle.textContent = `${cityShortName} - Coordonnées GPS : ${lat}, ${lon}`;
        gpsDiv.textContent = "";

    } catch (error) {
        console.error(error);
        gpsDiv.textContent = "Erreur serveur";
    }


});