import React, { useState } from 'react';
import './App.css';
import axios from "axios";

//Variables
// const baseURL = "https://cors-anywhere.herokuapp.com/https://jsonplaceholder.typicode.com/posts";
const baseURL = "https://app.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?langwritten=E&fileformat=mp4&pub=lffv&track=31";
var filterVTT = /(https:\/\/\S*\.vtt)/g;


function App({initialValue}) {
  const [testOutput, setTestOutput] = useState(false);

  function getURL() {
    axios
      .get(baseURL)
      .then((response) => {
        let stringifiedResponse = JSON.stringify(response.data);
        setTestOutput(JSON.stringify(response.data));
        getVTTFromPubMediaLinksAPI(stringifiedResponse);
      });
  }

  function getVTTFromPubMediaLinksAPI(json){
    let filteredResults = filterVTT.exec(json);
    console.log(filteredResults[0]);
  }

  

  // handleSubmit function
  const handleSubmit = event => {
    event.preventDefault();

    getURL();

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