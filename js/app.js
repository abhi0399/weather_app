class WeatherApp {
    constructor() {
        this.API_KEY = '78d2160840bf28242fed84541124c38b';
        this.isMetric = true;

        // Initialize DOM elements
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.unitToggle = document.getElementById('unitToggle');
        this.weatherInfo = document.getElementById('weatherInfo');
        this.errorMessage = document.getElementById('errorMessage');

        // Add event listeners
        this.searchBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission
            this.getWeather();
        });
        
        this.locationBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission
            this.getLocation();
        });
        
        this.unitToggle.addEventListener('change', () => this.toggleUnit());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.getWeather();
            }
        });
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        setTimeout(() => {
            this.errorMessage.classList.remove('show');
        }, 3000); // Hide error after 3 seconds
    }

    makeRequest(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error('City not found'));
                }
            };
            xhr.onerror = () => {
                reject(new Error('Error fetching weather data'));
            };
            xhr.send();
        });
    }

    async getWeather(city = this.cityInput.value.trim()) {
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.API_KEY}`;
            const data = await this.makeRequest(url);
            this.displayWeather(data);
            this.errorMessage.classList.remove('show');
        } catch (error) {
            this.showError(error.message);
            console.error('Error:', error);
        }
    }

    displayWeather(data) {
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('tempValue').textContent = `${Math.round(data.main.temp)}°${this.isMetric ? 'C' : 'F'}`;
        document.getElementById('condition').textContent = data.weather[0].main;
        document.getElementById('humidity').textContent = data.main.humidity;

        this.weatherInfo.style.display = 'block';
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${this.API_KEY}`;
                        const data = await this.makeRequest(url);
                        this.displayWeather(data);
                        this.errorMessage.classList.remove('show');
                    } catch (error) {
                        this.showError('Error getting weather for your location');
                        console.error('Error:', error);
                    }
                },
                () => this.showError('Unable to get your location. Please allow location access.')
            );
        } else {
            this.showError('Geolocation is not supported by your browser');
        }
    }

    toggleUnit() {
        this.isMetric = !this.isMetric;
        const tempElement = document.getElementById('tempValue');
        const currentTemp = parseInt(tempElement.textContent);
        if (this.isMetric) {
            tempElement.textContent = `${Math.round((currentTemp - 32) * 5/9)}°C`;
        } else {
            tempElement.textContent = `${Math.round(currentTemp * 9/5 + 32)}°F`;
        }
    }
}

// Initialize the app
const weatherApp = new WeatherApp();