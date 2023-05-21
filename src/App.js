import React, { useState } from 'react';
import './App.css';

function App({initialValue}) {
  const [testOutput, setTestOutput] = useState(false);
  const handleSubmit = event => {
    event.preventDefault();

   setTestOutput("Testing the setting of values");
 }

  return(
    <div className="wrapper">
      <h1>JW.Org Video Captions Extractor</h1>

       <div className="testArea">{testOutput}</div>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            <p>Link to video for extraction</p>
            <input name="url" />
          </label>
        </fieldset>
        <button type="submit">Begin Extraction</button>
      </form>
    </div>
  )
}

export default App;