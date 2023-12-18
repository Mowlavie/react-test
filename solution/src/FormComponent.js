import React, { useState, useEffect } from 'react';
import './FormComponent.css'; // Importing the CSS styles
import { getLocations } from './mock-api/apis'; // Importing the API function to fetch locations

const FormComponent = () => {
  // State variables to manage form inputs and data
  const [name, setName] = useState(''); // Stores the name entered by the user
  const [selectedLocation, setSelectedLocation] = useState(''); // Stores the selected location
  const [isNameTaken, setIsNameTaken] = useState(false); // Tracks if the entered name is already taken
  const [entries, setEntries] = useState([]); // Stores the list of entries
  const [locations, setLocations] = useState([]); // Stores the list of locations fetched from the API

  // Fetch locations from the API when the component mounts
  useEffect(() => {
    async function getLocationsFromAPI() {
      try {
        const data = await getLocations();
        setLocations(data); // Update the locations state with data from the API
        setSelectedLocation(data[0] || ''); // Set the selected location to the first location fetched
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }

    getLocationsFromAPI();
  }, []);

  // Event handler for name input changes
  const handleNameChange = (e) => {
    setName(e.target.value); // Update the name state with the user's input
    setIsNameTaken(false); // Reset the name taken flag
  };

  // Event handler for location dropdown changes
  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value); // Update the selected location state
  };

  // Event handler for adding a new entry
  const handleAdd = () => {
    const trimmedName = name.trim(); // Remove leading and trailing spaces from the name
    const nameExists = entries.some(entry => 
      entry.name.toLowerCase() === trimmedName.toLowerCase() &&
      entry.location === selectedLocation
    ); // Check if the entered name already exists in the entries list

    if (trimmedName && !nameExists) {
      // If the name is valid and not taken, add it to the entries list
      setEntries(prevEntries => [...prevEntries, { name: trimmedName, location: selectedLocation }]);
      setName(''); // Clear the name input
      setSelectedLocation(locations[0] || ''); // Reset the location dropdown
      setIsNameTaken(false); // Reset the name taken flag
    } else {
      setIsNameTaken(true); // Set the name taken flag to display an error message
    }
  };

  // Event handler for clearing the form
  const handleClear = () => {
    setName(''); // Clear the name input
    setSelectedLocation(locations[0] || ''); // Reset the location dropdown to the first location fetched from the API
    setIsNameTaken(false); // Reset the name taken flag
  };

  // Render the form component with input fields, buttons, and a table
  return (
    <div className="form-container">
      <div className="input-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter name"
          className={isNameTaken ? 'error-input' : ''}
        />
        {isNameTaken && <div className="error-message">This name has already been taken</div>}
      </div>
      
      <div className="input-group">
        <label htmlFor="location">Location</label>
        <div className="select-container">
          <select
            id="location"
            value={selectedLocation}
            onChange={handleLocationChange}
          >
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="buttons">
        <button onClick={handleClear} className="clear-button">Clear</button>
        <button onClick={handleAdd} className="add-button">Add</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.name}</td>
              <td>{entry.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormComponent; // Export the FormComponent for use in other parts of your application.
