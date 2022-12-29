import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import './App.css';


function AIResponse() {
  const [data, setData] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [request, setRequest] = useState('');
  const [columns, setColumns] = useState('');

  const [fileName, setFileName] = useState('');


  useEffect(() => {
    async function fetchData() {

      const { Configuration, OpenAIApi } = require("openai");

      const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      });

      const prompt = `Give me an accurate data of ${request} with the following columns: ${columns}. Make sure the data in the form of array of arrays. Make the first element the columns. Most importantly, make sure it is a valid JSON string by always fitting the end of array with the max token.`

      const openai = new OpenAIApi(configuration);
      
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0,
        max_tokens: 1200,
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

    const fName = reqValue.toLowerCase().replace(/\s/g, "-") + ".csv"

    setRequest(reqValue);
    setColumns(colsValue);

    setFileName(fName);

    setButtonClicked(true);
  }

  return (
    <div>
      <label htmlFor="user-request" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">What data do you need? (e.g. "countries with top GDP")
        <input type="text" id="user-request" defaultValue={request} className="block w-full mt-2 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"/>
      </label>
      <label htmlFor="user-columns" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Specify your columns, comma-separated. (e.g. "country, GDP, top export")
        <input type="text" id="user-columns" defaultValue={columns} className="block w-full mt-2 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"/>
      </label>
      <button onClick={handleButtonClick} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 border border-teal-700 rounded">Submit</button>
      <div className="mt-6 border-t-2">
        <div className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Data:</div>
        <div className="border bg-gray-100 rounded">
          <div className="m-2 text-sm text-gray-400">
            {data ? (
              <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
              buttonClicked ? (
                "Loading..."
              ) : (
                "Your data will be rendered here."
              )
            )}
            
          </div>
        </div>
        <div className="mt-5">
            {data ? (
              <CSVLink data={data} filename={fileName} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 border border-teal-700 rounded">Download CSV</CSVLink>
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
        <div className="text-lg font-bold">
          GPT to CSV
        </div>
        <div className="mb-6 mt-6">
          <AIResponse />
        </div>
      </div>
    </div>
  );
}

export default App;
