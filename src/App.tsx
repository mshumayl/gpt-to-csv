import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';


function AIResponse() {
  const [data, setData] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);


  useEffect(() => {
    async function fetchData() {

      const { Configuration, OpenAIApi } = require("openai");

      const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      });

      const prompt = "A two-column spreadsheet of top science fiction movies and the year of release:\n\nTitle |  Year of release"

      const openai = new OpenAIApi(configuration);
      
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const json = await response.data;
      const text = json.choices[0].text;
      setData(text);
    }

    if (buttonClicked) {
      fetchData();
    }
  }, [buttonClicked]);

  function handleButtonClick() {
    setButtonClicked(true);
  }

  return (
    <div>
      <label htmlFor="prompt-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prompt:
        <input type="text" id="prompt-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </label>
      <button onClick={handleButtonClick} className="btn btn-primary">Submit</button>
      <div className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">Response:</div>
      <div>
        {!buttonClicked && data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          'Loading...'
        )}
      </div>
    </div>
  );
}


function App() {
  return (
    <div className="mx-10 my-10 border">
      <div className="mx-10 my-10">
        <div className="text-lg font-bold underline">
          GPT Sandbox
        </div>
        <div className="mb-6 mt-6">
          <AIResponse />
        </div>
      </div>
    </div>
  );
}

export default App;
