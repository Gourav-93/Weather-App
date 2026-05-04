document.addEventListener("DOMContentLoaded", () => {
    // Setup event listeners once on load
    const cityInput = document.getElementById("city");
    cityInput.addEventListener("keypress", handleEnter);

    const card = document.querySelector(".card");

    // Adding 3D effect for non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        });

        card.addEventListener("mouseenter", () => {
            card.style.transition = "transform 0.1s ease";
        });
    }
});

function handleEnter(event) {
    if (event.key === "Enter") {
        getWeather();
    }
}

async function getWeather() {
    const cityInput = document.getElementById("city");
    const city = cityInput.value.trim();
    const weatherDiv = document.getElementById("weather");
    const errorDiv = document.getElementById("error-message");
    const searchBtn = document.getElementById("search-btn");
    const btnText = document.getElementById("btn-text");
    const btnLoader = document.getElementById("btn-loader");

    // Reset UI
    errorDiv.classList.add("hidden");
    weatherDiv.classList.add("hidden");
    weatherDiv.classList.remove("fade-in");

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    // Set Loading State
    searchBtn.disabled = true;
    btnText.classList.add("hidden");
    btnLoader.classList.remove("hidden");

    try {
        const response = await fetch("/weather?city=" + encodeURIComponent(city));
        const data = await response.json();

        if (!response.ok) {
            // Check if the API returned an error message
            throw new Error(data.message || data.error || "City not found.");
        }

        renderWeather(data);
    } catch (error) {
        showError(error.message || "Failed to fetch weather data.");
    } finally {
        // Reset Loading State
        searchBtn.disabled = false;
        btnText.classList.remove("hidden");
        btnLoader.classList.add("hidden");
    }
}

function showError(message) {
    const errorDiv = document.getElementById("error-message");
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
    errorDiv.classList.add("fade-in");
}

function renderWeather(data) {
    const weatherDiv = document.getElementById("weather");
    
    // Safely extract data
    const name = data.name;
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const visibilityKm = (data.visibility / 1000).toFixed(1);

    const weatherHTML = `
      <h2 class="city-name">${name}</h2>
      <div class="temp-container">
          <div class="temp">${temp}°C</div>
          <p class="condition">${description}</p>
      </div>
      
      <div class="divider"></div>
      
      <div class="weather-stats">
          <div class="stat-box">
              <div class="stat-label">Feels Like</div>
              <div class="stat-value">${feelsLike}°C</div>
          </div>
          <div class="stat-box">
              <div class="stat-label">Humidity</div>
              <div class="stat-value">${humidity}%</div>
          </div>
      </div>
      
      <div class="weather-stats mt-3">
          <div class="stat-box">
              <div class="stat-label">Wind</div>
              <div class="stat-value">${windSpeed} km/h</div>
          </div>
          <div class="stat-box">
              <div class="stat-label">Visibility</div>
              <div class="stat-value">${visibilityKm} km</div>
          </div>
      </div>
    `;

    weatherDiv.innerHTML = weatherHTML;
    weatherDiv.classList.remove("hidden");
    weatherDiv.classList.add("fade-in");
}
