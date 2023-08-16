import React, { useState, useEffect } from 'react';
import './App.css';
import Joke from './Joke';

function App() {
  const [jokes, setJokes] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('');
  const [newSetup, setNewSetup] = useState('');
  const [newPunchline, setNewPunchline] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3002/get-data');
      const data = await response.json();
      setJokes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFromAPI = async () => {
    try {
      const response = await fetch('http://localhost:3002/fetch-data');
      const message = await response.text();
      setFetchStatus(message);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddJoke = async () => {
    try {
      const newJoke = {
        data: {
          setup: newSetup,
          punchline: newPunchline,
        },
      };

      await fetch('http://localhost:3002/add-joke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJoke),
      });

      fetchData();
      setNewSetup('');
      setNewPunchline('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id, updatedJoke) => {
    try {
      await fetch(`http://localhost:3002/update-joke/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedJoke),
      });

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3002/delete-joke/${id}`, {
        method: 'DELETE',
      });

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="container">
      <h1>API Data</h1>
      <button onClick={fetchFromAPI}>Joke from API</button>
      <div>
        <input
          type="text"
          placeholder="Setup"
          value={newSetup}
          onChange={(e) => setNewSetup(e.target.value)}
        />
        <input
          type="text"
          placeholder="Punchline"
          value={newPunchline}
          onChange={(e) => setNewPunchline(e.target.value)}
        />
        <button onClick={handleAddJoke}>Add Joke</button>
      </div>
      <div className="notification">{fetchStatus}</div>
      <div className="dataContainer">
        {jokes.map((joke) => (
          <Joke
            key={joke._id}
            joke={joke}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
        
          />
        ))}
      </div>
    </div>
    
  );
}

export default App;
