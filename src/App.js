import React, { useState } from 'react';
import './App.css';

function App() {
  const [localizationSignal, setLocalizationSignal] = useState('');
  const [genes, setGenes] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocalizationChange = (e) => {
    setLocalizationSignal(e.target.value);
  };

  const handleGenesChange = (e) => {
    setGenes(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true when the request starts
    const items = genes.split(',').map(item => item.trim());
    const formattedItems = items.filter(item => item !== '');
    console.log(localizationSignal);
    try {
      const response = await fetch('https://gene-localization-backend.onrender.com/process_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ localization_signal: localizationSignal, genes: formattedItems }),
      });
      const data = await response.json();
      const result = data.result;
      console.log(result);
      setListItems(result.filter(item => item.selected)); // assuming backend returns an array of objects with { name: string, selected: boolean }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Set loading state to false when the request completes (whether successfully or with an error)
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>BB411 Assignment2</h1>
      </header>
      <div className="content">
        <div className="form-container">
          <h2>Enter</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="localizationSignal">Localization Signal</label>
              <input
                type="text"
                id="localizationSignal"
                value={localizationSignal}
                onChange={handleLocalizationChange}
                placeholder="Signal (e.g., SKL)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="genes">Genes</label>
              <input
                type="text"
                id="genes"
                value={genes}
                onChange={handleGenesChange}
                placeholder="genes( e.g., gene1, gene2,)"
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="list-table">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Signal found in</th>
                </tr>
              </thead>
              <tbody>
                {listItems.length === 0 ? (
                  <tr>
                    <td colSpan="1">No results found.</td>
                  </tr>
                ) : (
                  listItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <footer className="footer">
        <p>Made with <span role="img" aria-label="heart">❤️</span> by Naman and Utkarsh</p>
      </footer>
    </div>
  );
}

export default App;
