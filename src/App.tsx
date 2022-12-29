import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import './App.css';


function AIResponse() {
  const [data, setData] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [request, setRequest] = useState('');
  const [columns, setColumns] = useState('');

  useEffect(() => {
    async function fetchData() {

      const { Configuration, OpenAIApi } = require("openai");

      const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      });

      const prompt = `Give me an accurate data of ${request} with the following columns: ${columns}. Please return only the top 2 items, and make sure the data in the form of array of arrays. Make the first element the columns. Most importantly, make sure it is a valid JSON string.`

      const openai = new OpenAIApi(configuration);
      
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const json = await response.data;
      const text = json.choices[0].text.replace(/[\n\r]/g, '');

      console.log(text)

      const parsedText = JSON.parse(text)
      
      setData(parsedText);
    }

    if (buttonClicked) {
      fetchData();
    }

  }, [buttonClicked]);

  function handleButtonClick() {
    const reqElement = document.getElementById('user-request') as HTMLInputElement;
    const colsElement = document.getElementById('user-columns') as HTMLInputElement;

    const reqValue = reqElement?.value;
    const colsValue = colsElement?.value;

    setRequest(reqValue);
    setColumns(colsValue);

    setButtonClicked(true);
  }

  return (
    <div>
      <label htmlFor="user-request" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">What data do you need? (e.g. countries with top GDP)
        <input type="text" id="user-request" defaultValue={request} className="block w-full mt-2 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </label>
      <label htmlFor="user-columns" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Specify your columns, comma-separated (e.g. country, GDP, top export).
        <input type="text" id="user-columns" defaultValue={columns} className="block w-full mt-2 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </label>
      <button onClick={handleButtonClick} className="btn btn-primary">Submit</button>
      <div className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">Response:</div>
      <div className="border">
        <div className="m-2">
          {data ? (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          ) : (
            buttonClicked ? (
              "Loading..."
            ) : (
              ""
            )
          )}
          
        </div>
        <div>
          {data ? (
            <CSVLink data={data}>Download</CSVLink>
          ) : (
            ""
          )}
        </div>
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
