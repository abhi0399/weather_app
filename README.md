# Weather WebApp

A responsive weather application that displays current weather data for any city.

## Features

- Search weather by city name
- Display current temperature, humidity, and weather conditions
- Toggle between Celsius and Fahrenheit
- Geolocation support
- Responsive design
- Error handling

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- An API key from OpenWeatherMap (or your chosen weather API provider)

## Setup & Running

1. Clone this repository or download the files:
   ```bash
   git clone <repository-url>
   ```

2. Get your API key:
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Copy your API key

3. Configure the API key:
   - Open `js/app.js`
   - Replace `YOUR_API_KEY` with your actual API key

4. Run the application:
   - Option 1: Double click the `index.html` file to open it in your default browser
   - Option 2: Use a local development server:
     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Python 2
     python -m SimpleHTTPServer 8000

     # Using Node.js's http-server (needs to be installed first)
     npx http-server
     ```

5. Access the application:
   - If using Option 1: The app will open automatically in your browser
   - If using Option 2: Open your browser and navigate to `http://localhost:8000`

## Project Structure

- `index.html`: The main HTML file for the application
- `js/app.js`: The JavaScript file for handling API calls and updating the UI
- `css/styles.css`: The CSS file for styling the application

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenWeatherMap API
- XMLHttpRequest for API calls

## Project Structure 

## Implementation Details

- Used semantic HTML for better accessibility
- Implemented responsive design using media queries
- Handled errors gracefully with user-friendly messages
- Used Promise-based asynchronous operations
- Implemented geolocation for automatic weather detection

## Challenges & Solutions

- Challenge: Cross-browser geolocation support
  Solution: Implemented robust error handling for different browsers
- Challenge: API rate limiting
  Solution: Added error handling for API limits 