import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const App = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [error, setError] = useState('');

    const options = [
        { value: 'alphabets', label: 'Alphabets' },
        { value: 'numbers', label: 'Numbers' },
        { value: 'highest_alphabet', label: 'Highest Alphabet' }
    ];

    const validateJSON = (input) => {
        try {
            const parsed = JSON.parse(input);
            // Check if parsed value is an array of strings
            return Array.isArray(parsed) && parsed.every(item => typeof item === 'string');
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate and parse JSON input
        const isValid = validateJSON(jsonInput);
        if (!isValid) {
            setError('Invalid JSON format. Please enter a valid JSON array of strings.');
            return;
        }

        const validData = JSON.parse(jsonInput);

        try {
            const res = await axios.post('https://bajajbackend-d3d430e98905.herokuapp.com/bfhl', { data: validData });
            setResponse(res.data);
        } catch (error) {
            setError('Failed to fetch data. Please try again.');
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
    };

    const handleSelectChange = (selected) => {
        setSelectedOptions(selected);
    };

    const renderResponse = () => {
        if (!response) return null;

        const filteredResponse = {};
        selectedOptions.forEach(option => {
            filteredResponse[option.value] = response[option.value];
        });

        return (
            <div className="response">
                <h3>Response:</h3>
                <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
            </div>
        );
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Bajaj Fullstack Challenge</h1>
            </header>
            <main>
                <form onSubmit={handleSubmit} className="form">
                    <textarea
                        rows="10"
                        cols="50"
                        value={jsonInput}
                        onChange={handleInputChange}
                        placeholder='Enter JSON array here (e.g., ["A", "C", "z"])'
                        className={`textarea ${error ? 'invalid' : ''}`}
                    />
                    <button type="submit" className="submit-button">Submit</button>
                </form>
                {error && <div className="error">{error}</div>}
                {response && (
                    <div className="results">
                        <Select
                            isMulti
                            options={options}
                            onChange={handleSelectChange}
                            className="select"
                        />
                        {renderResponse()}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
