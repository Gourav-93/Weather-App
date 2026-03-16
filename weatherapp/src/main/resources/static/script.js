function getWeather() {
  let city = document.getElementById("city").value.trim();

  if (city === "") {
    document.getElementById("weather").innerHTML = "Please enter a city name";
    return;
  }

  fetch("/weather?city=" + encodeURIComponent(city))
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      let weatherHTML = `
      <h2>${data.name}</h2>
      <div class="temp">${data.main.temp} °C</div>
      <p>Weather : ${data.weather[0].main}</p>
      <p>Humidity : ${data.main.humidity}%</p>
      <p>Wind Speed : ${data.wind.speed} km/h</p>
    `;

      document.getElementById("weather").innerHTML = weatherHTML;
    })
    .catch((error) => {
      console.log(error);

      document.getElementById("weather").innerHTML = "City not found ❌";
    });
}

function handleEnter(event) {
  if (event.key === "Enter") {
    getWeather();
  }

  const card = document.querySelector(".card");

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
