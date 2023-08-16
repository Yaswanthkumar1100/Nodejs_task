import React, { useState } from 'react';

const Joke = ({ joke, onUpdate, onDelete }) => {
  const [updatedSetup, setUpdatedSetup] = useState('');
  const [updatedPunchline, setUpdatedPunchline] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateSubmit = async () => {
    if (!updatedSetup || !updatedPunchline) {
      return;
    }

    const updatedJoke = {
      data: {
        setup: updatedSetup,
        punchline: updatedPunchline,
      },
    };

    await onUpdate(joke._id, updatedJoke);

    setUpdatedSetup('');
    setUpdatedPunchline('');
    setIsEditing(false);
  };

  return (
    <div className="joke">
      <p className="jokeLabel">SETUP:</p>
      <div className="setup">{joke.data.setup}</div>
      <p className="jokeLabel">PUNCHLINE:</p>
      <div className="punchline">{joke.data.punchline}</div>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={() => onDelete(joke._id)}>Delete</button>
      {isEditing && (
        <div>
          <input
            type="text"
            placeholder="Update setup"
            value={updatedSetup}
            onChange={(e) => setUpdatedSetup(e.target.value)}
          />
          <input
            type="text"
            placeholder="Update punchline"
            value={updatedPunchline}
            onChange={(e) => setUpdatedPunchline(e.target.value)}
          />
          <button onClick={handleUpdateSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Joke;