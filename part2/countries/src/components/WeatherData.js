const WeatherData = ({ weatherData, capital }) => {
    if (weatherData) {
      return (
        <div>
          <h1>Weather in {capital}</h1>
          <p>temperature {weatherData.main.temp} Celcius</p>
          <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt=''></img>
          <p>wind {weatherData.wind.speed} m/s</p>
        </div>
      )
    }
    return null
  }
  export default WeatherData