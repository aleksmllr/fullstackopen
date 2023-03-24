import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ value, onChange}) => {
  return (
    <>
      filter shown with <input value={value} onChange={onChange}/>
    </>
  )
}

const PersonForm = ({ addPerson, newName, handlePersonChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({ personsToShow, deletePerson }) => {
  
  return (
    <div>
      {personsToShow.map(person => 
      <div key={person.id}>
        {person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button>
      </div>)
      }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const found = persons.find(person => person.name === newName)
    if (found) {
      if (window.confirm(`${found.name} is already added to the phonebook, replace the old number with a new number?`)) {
        const updatedPerson = { ...found, number: newNumber}
        personService
          .update(found.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id != found.id ? person : updatedPerson))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        console.log('This object is being added to the db: ', returnedPerson)
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
      .deletePerson(id)
      .then(() => {
        const updatedPersons = persons.filter(person => person.id !== id)
        setPersons(updatedPersons)
      })
    }
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const useFilter = newFilter !== ''

  const personsToShow = !useFilter ? persons : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName} handlePersonChange={handlePersonChange} 
        newNumber={newNumber} handleNumberChange={handleNumberChange}
        />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
