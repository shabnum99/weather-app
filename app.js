document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "33567c9dc02f46fb690390cc12d5f263"; // Replace with your API key
  const searchInput = document.getElementById("cityInput");

  const searchButton = document.querySelector("button");
  const weatherContainer = document.querySelector(".weather-container");
  const dropdown = document.getElementById("dropdown");
  const cityNameElement = document.getElementById("cityName");

  searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city !== "") {
      getWeatherData(city);
      hideDropdown();
    } else {
      alert("Please enter a city name.");
    }
  });

  searchInput.addEventListener("input", async () => {
    const cityPrefix = searchInput.value.trim();

    if (cityPrefix !== "") {
      const suggestions = await getSuggestions(cityPrefix);
      displayDropdown(suggestions);
    } else {
      hideDropdown();
    }
  });

  const getWeatherData = async () => {
    const city = searchInput.value.trim();
    if (city !== "") {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        if (response.ok) {
          displayWeatherData(data);
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred while fetching weather data.");
      }
    } else {
      alert("Please enter a city name.");
    }
  };

  const getSuggestions = async (prefix) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?q=${prefix}&type=like&sort=population&cnt=5&appid=${apiKey}`
      );
      const data = await response.json();

      return response.ok ? data.list : [];
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      return [];
    }
  };

  const displayWeatherData = (data) => {
    const temperature = document.getElementById("temperature");
    const weatherDescription = document.getElementById("weatherDescription");
    const weatherIcon = document.getElementById("weatherIcon");

    cityNameElement.textContent = data.name;

    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    weatherIcon.src = iconUrl;

    weatherContainer.style.display = "block";
  };

  const displayDropdown = (suggestions) => {
    dropdown.innerHTML = "";

    suggestions.forEach((city) => {
      const option = document.createElement("div");
      option.classList.add("option");

      // Display city, state, and country
      const cityInfo = `${city.name}, ${city.sys.country}${
        city.state ? ", " + city.state : ""
      }`;
      option.textContent = cityInfo;

      option.addEventListener("click", () => {
        searchInput.value = city.name;
        hideDropdown();
      });

      dropdown.appendChild(option);
    });

    dropdown.style.display = "block";
  };

  const hideDropdown = () => {
    dropdown.style.display = "none";
  };
});
