import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="mx-10 my-10 border">
      <div className="mx-10 my-10">
        <div className="text-lg font-bold underline">
          GPT Sandbox
        </div>
        <div className="mb-6 mt-6">
          <label htmlFor="prompt-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prompt:</label>
          <input type="text" id="prompt-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <div className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">Response:</div>
        </div>
      </div>
    </div>
  );
}

export default App;
