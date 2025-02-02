class WeatherApp {
    constructor() {
        this.API_KEY = 'YOUR_API_KEY';
        this.isMetric = true;

        // Initialize DOM elements
        this.form = document.getElementById('weatherForm');
        this.cityInput = document.getElementById('cityInput');
        this.locationBtn = document.getElementById('locationBtn');
        this.unitToggle = document.getElementById('unitToggle');
        this.weatherInfo = document.getElementById('weatherInfo');
        this.errorMessage = document.getElementById('errorMessage');
        this.unitText = document.getElementById('unitText');

        // Bind events
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.locationBtn.addEventListener('click', () => this.getLocation());
        this.unitToggle.addEventListener('change', () => this.toggleUnit());

        // Initialize with user's location if possible
        this.getLocation();
    }

    async getWeatherData(city) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.API_KEY}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('City not found');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const city = this.cityInput.value.trim();
        await this.fetchAndDisplayWeather(city);
    }

    async fetchAndDisplayWeather(city) {
        try {
            this.showError('');
            const data = await this.getWeatherData(city);
            this.displayWeather(data);
        } catch (error) {
            this.showError(error.message);
        }
    }

    displayWeather(data) {
        const temp = this.isMetric ? data.main.temp : (data.main.temp * 9/5) + 32;
        
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('temperature').textContent = 
            `${Math.round(temp)}°${this.isMetric ? 'C' : 'F'}`;
        document.getElementById('condition').textContent = data.weather[0].main;
        document.getElementById('humidity').textContent = data.main.humidity;
        document.getElementById('weatherIcon').src = 
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        this.weatherInfo.classList.remove('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.toggle('hidden', !message);
        this.weatherInfo.classList.toggle('hidden', !!message);
    }

    toggleUnit() {
        this.isMetric = !this.isMetric;
        this.unitText.textContent = this.isMetric ? '°C' : '°F';
        
        if (!this.weatherInfo.classList.contains('hidden')) {
            const tempElement = document.getElementById('temperature');
            const currentTemp = parseFloat(tempElement.textContent);
            const newTemp = this.isMetric ? 
                (currentTemp - 32) * 5/9 : 
                (currentTemp * 9/5) + 32;
            tempElement.textContent = `${Math.round(newTemp)}°${this.isMetric ? 'C' : 'F'}`;
        }
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const response = await fetch(
                            `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${this.API_KEY}`
                        );
                        if (!response.ok) throw new Error('Error getting weather data');
                        const data = await response.json();
                        this.displayWeather(data);
                    } catch (error) {
                        this.showError('Error getting weather for your location');
                    }
                },
                () => this.showError('Unable to get your location')
            );
        } else {
            this.showError('Geolocation is not supported by your browser');
        }
    }
}

// Initialize the app
const weatherApp = new WeatherApp();