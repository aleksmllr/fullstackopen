const Countries = ({ countries, setFilteredCountries }) => {
    if (countries.length > 10) {
      return (
        <p>Too many matches, specify another filter</p>
      )
    }
    else if (countries.length > 1 && countries.length <= 10) {
      return (
        <ul>
          {countries.map(country => 
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => setFilteredCountries([country])}>show</button>
            </li>)
          }
        </ul>
      )
    }
    else {
      return (
        <>
          <h1>{countries[0].name.common}</h1>
          <p>capital {countries[0].capital}</p>
          <p>area {countries[0].area}</p>
          <b>languages: </b>
          <ul>
            {Object.values(countries[0].languages).map((language, idx) => 
            <li key={idx}>{language}</li>
            )}
          </ul>
          <img src={countries[0].flags.png} alt={`Flag of ${countries[0].name.common}`} />
        </>
      )
    }
  }
  export default Countries