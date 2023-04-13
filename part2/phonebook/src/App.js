import { useState, useEffect } from "react";
import personService from "./services/persons";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const found = persons.find((person) => person.name === newName);
    if (found) {
      if (
        window.confirm(
          `${found.name} is already added to the phonebook, replace the old number with a new number?`
        )
      ) {
        const updatedPerson = { ...found, number: newNumber };
        personService
          .update(found.id, updatedPerson)
          .then((returnedPerson) => {
            const notification = {
              message: `${returnedPerson.name} number has been updated to ${returnedPerson.number}`,
              color: "green",
            };
            setNotification(notification);
            setTimeout(() => {
              setNotification(null);
            }, 5000);
            setPersons(
              persons.map((person) =>
                person.id !== found.id ? person : updatedPerson
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            const notification = {
              message: `Information of ${found.name} has already been removed from server`,
              color: "red",
            };
            setNotification(notification);
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(personObject)
      .then((returnedPerson) => {
        const notification = {
          message: `Added ${returnedPerson.name}`,
          color: "green",
        };
        setNotification(notification);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        const notification = {
          message: error.response.data.error,
          color: "red",
        };
        setNotification(notification);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);

    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          const notification = {
            message: `${person.name} has been removed from the phonebook.`,
            color: "green",
          };
          setNotification(notification);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
          const updatedPersons = persons.filter((person) => person.id !== id);
          setPersons(updatedPersons);
        })
        .catch((error) => {
          const notification = {
            message: `There was a problem trying to remove ${person.name} from the phonebook`,
            color: "red",
          };
          setNotification(notification);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    }
  };

  const handlePersonChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const useFilter = newFilter !== "";

  const personsToShow = !useFilter
    ? persons
    : persons.filter((person) =>
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
