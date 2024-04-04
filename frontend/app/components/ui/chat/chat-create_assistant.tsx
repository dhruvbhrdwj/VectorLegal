import React, { useState } from 'react';

function ChatCreateAssistant() {
  // State to manage button text and color
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  function createAssistant() {
    setIsCreating(true); // Indicate the process has started
    fetch('https://vectorlegal.onrender.com/trigger-processing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include other headers as needed
      },
      body: JSON.stringify({
        // Your request body content
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setIsCreating(false);
      setIsCreated(true); // Indicate the process has finished
    })
    .catch(error => {
      console.error('Error:', error);
      setIsCreating(false); // Reset creating state in case of error
    });
  }

  return (
    <button
      className='p-4 text-white rounded-xl shadow-xl'
      style={{ 
        backgroundColor: isCreated ? 'green' : '#ff6a43', // Change color based on state
      }}
      onClick={createAssistant}
      disabled={isCreating} // Disable button while creating
    >
      {isCreating ? 'Creating your Assistant...' : isCreated ? 'Assistant Created!' : 'Create Assistant'}
    </button>
  );
}

export default ChatCreateAssistant;
