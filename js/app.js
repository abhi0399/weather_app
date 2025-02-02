class WeatherApp {
    constructor() {
        this.API_KEY = '78d2160840bf28242fed84541124c38b'; // Replace with your OpenWeatherMap API key
        this.isMetric = true;

        // DOM Elements
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

        // Test API key on startup
        this.testAPIKey().then(isValid => {
            if (!isValid) {
                this.showError('Invalid API key or API access issue');
            }
        });
    }

    async getWeatherData(city) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.API_KEY}`;
            
            xhr.open('GET', url);
            
            xhr.onload = function() {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error('City not found'));
                }
            };
            
            xhr.onerror = function() {
                reject(new Error('Error fetching weather data'));
            };
            
            xhr.send();
        });
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
            `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        this.weatherInfo.classList.remove('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.toggle('hidden', !message);
        this.weatherInfo.classList.toggle('hidden', !!message);
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${this.API_KEY}`;
                        
                        console.log('Fetching weather from:', url); // Debug log
                        
                        const response = await fetch(url);
                        
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(`Weather API Error: ${errorData.message}`);
                        }
                        
                        const data = await response.json();
                        this.displayWeather(data);
                    } catch (error) {
                        console.error('Detailed error:', error); // Debug log
                        this.showError(`Error: ${error.message}`);
                    }
                },
                (error) => {
                    // More specific geolocation errors
                    let errorMessage;
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "Please allow location access to use this feature.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "Location information unavailable.";
                            break;
                        case error.TIMEOUT:
                            errorMessage = "Location request timed out.";
                            break;
                        default:
                            errorMessage = "Unable to get your location.";
                    }
                    this.showError(errorMessage);
                }
            );
        } else {
            this.showError('Geolocation is not supported by your browser');
        }
    }

    toggleUnit() {
        this.isMetric = !this.isMetric;
        this.unitText.textContent = this.isMetric ? '°C' : '°F';
        
        // Update displayed temperature if weather data is shown
        if (!this.weatherInfo.classList.contains('hidden')) {
            const tempElement = document.getElementById('temperature');
            const currentTemp = parseFloat(tempElement.textContent);
            const newTemp = this.isMetric ? 
                (currentTemp - 32) * 5/9 : 
                (currentTemp * 9/5) + 32;
            tempElement.textContent = `${Math.round(newTemp)}°${this.isMetric ? 'C' : 'F'}`;
        }
    }

    // Test your API key with a simple city query first
    async testAPIKey() {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${this.API_KEY}`
            );
            const data = await response.json();
            console.log('API Test Response:', data);
            return response.ok;
        } catch (error) {
            console.error('API Test Error:', error);
            return false;
        }
    }
}

// Initialize the app
const weatherApp = new WeatherApp(); 