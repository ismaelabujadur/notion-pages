import React from 'react';

function fetchData() {
  fetch("http://localhost:8000/")
    .then((response) => response.json())
    .then((payload) => {
      console.log(payload);
    });
};

function App() {
  return (
    <div className="App">
      <div>
        <button
          type="button"
          onClick={fetchData}>
          Fetch data
        </button>
      </div>
    </div>
  );
};

export default App;
