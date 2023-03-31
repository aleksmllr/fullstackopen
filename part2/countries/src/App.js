import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Countries from './components/Countries'
import WeatherData from './components/WeatherData'

const api_key = process.env.REACT_APP_API_KEY

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    
    if (selectedCountry === true) {
      axios
      .get(`http://api.openweathermap.org/geo/1.0/direct?q=${filteredCountries[0].capital}&limit=1&appid=${api_key}`)
      .then(response => {
        const lat = response.data[0].lat
        const lon = response.data[0].lon
        axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`)
        .then(response => {
          const data = response.data
          setWeatherData(data)
          console.log('weather: ', data)
        })
      })
    }

    else {
      //console.log('fetching exchange country data...')
      axios
        .get(`https://restcountries.com/v3.1/all/`)
        .then(response => {
          setCountries(response.data)
          setFilteredCountries(response.data)
        })
    }
    
  }, [selectedCountry])

  if (!countries) { 
    return null 
  }

  const handleChange = (event) => {
    const newFilter = event.target.value
    setFilter(newFilter)
    const filtered = countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))
    setFilteredCountries(filtered)
    setSelectedCountry(filtered.length === 1)
  }

  const handleClick = (countries) => {
    setFilteredCountries(countries)
    setSelectedCountry(true)
  }

  console.log('selectedCountry: ', selectedCountry)

  return (
    <div>
      <Filter value={filter} onChange={handleChange} />
      <Countries countries={filteredCountries} setFilteredCountries={handleClick}/>
      {selectedCountry ? <WeatherData weatherData={weatherData} capital={filteredCountries[0].capital}/> : null}
    </div>
  )
}

export default App;
