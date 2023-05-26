import React, { useState } from 'react';
import './App.css';
import axios from "axios";


// Regular Expressions
var filterVTTLink = /(https:?:[a-zA-Z0-9._/-]*\.vtt)/; // Removes the link to the VTT file from the pubmedialinks api response
var filterFormatting1 = /WEBVTT/g; // Removes WEBVTT off from the VTT Data
var filterFormatting2 = /\d+:\d+:\d+.\d+\s-->\s\d+:\d+:\d+.\d+\s\S*\s\S*\s*align:center/gm; // Removes time codes and some formatting
var filterFormatting3 = /\\r\\n\\r\\n \\r\\n/g; // Removes the final carriage returns and new lines
var filterFormatting4 = /\\r\\n/g; // Removes the final carriage returns and new lines
// var filterPub = /pub=([a-zA-Z]*).*[^track].*/gm;
// var filterPubTrack = /pub=(.*)&track=(\d+)/gm;
// var filterDocID = /docid=(\d+)/gm;
// var filterJWB = /(pub[a-zA-Z0-9-_]*)/gm;
// var filterPubMediaLinks = /GETPUBMEDIALINKS/g;
// var filterMediator = /mediator/g;
var filterRemoveLank = /lank=(.*)&/;
// var testDocID = /docid/gm;
// var testURL = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/g;

function App({initialValue}) {
  const [VTTLink, setVTTLink] = useState(false);
  const [videoTitle, setvideoTitle] = useState(false);
  const [VTTData, setVTTData] = useState(false);
  const [inputURL, setinputURL] = useState('');
  const [error, setError] = useState('');
  // const [pubMediaLinksData , setPubMediaLinksData] = useState('');

  function filterPubFromLink(inputURL){
    let groups = inputURL.match(filterRemoveLank);
    if(groups){
      let downloadURL = "https://b.jw-cdn.org/apis/mediator/v1/media-items/E/" + groups[1] + "?clientType=json";
      getURL(downloadURL);
    }
    else {
      setError('The link you provided does not belong to a video file. Please try again.')
    }
    
  }

  function getURL(inputURL) {
    axios
      .get(inputURL)
      .then((response) => {
        let stringifiedResponse = JSON.stringify(response.data);
        filterVTTLinkFromMediatorResponse(stringifiedResponse);
      })
      .catch(error => {
      setError(error.message);
    });
  }

  function filterVTTLinkFromMediatorResponse(json){
    let filteredResults = filterVTTLink.exec(json);
    if(filteredResults){
      getVTTFileFromJWServer(filteredResults[0]);      
    }
    else{
      setError('Your link does not seem to be working');
    }
  }

  function getVTTFileFromJWServer(link){
    axios
      .get(link)
      .then((response) => {
        let stringifiedResponse = JSON.stringify(response.data);
        filterFormattingFromVTTFile(stringifiedResponse);
      })
      .catch(error => {
      setError(error.message);
    });
  }

  function filterFormattingFromVTTFile(VTTData){
    let nothing = ' ';
    let filteredResults = VTTData.replace(filterFormatting1,nothing);               //removing the WEBVTT at the front of the paragraph
    let secondFilteredResults = filteredResults.replace(filterFormatting2,nothing); // removing the timecodes
    let thirdFilteredResults = secondFilteredResults.replace(filterFormatting3, '\r'); // remove the \r and \n
    let fourthFilteredResults = thirdFilteredResults.replace(filterFormatting4, nothing) 
    let final = fourthFilteredResults.substring(1,fourthFilteredResults.length-1);
    setVTTData(final.trim());
  }

  // handleSubmit function
  const handleSubmit = event => {
    setError('');
    setVTTData('');
    setVTTLink('');
    setvideoTitle('');
    event.preventDefault();
    // check that it is in fact a url then below
    filterPubFromLink(inputURL);
  }


  return(
    <div className="wrapper">
      <h1>JW.Org Video Captions Extractor</h1>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            <p>Right Click a video on JW.ORG-> LFF and paste the link here to get captions</p>
            <input type="text" size="70" value={inputURL} onChange={e=>setinputURL(e.target.value)}/>
          </label>
        </fieldset>
        <button type="submit">Begin Extraction</button>
      </form>

      <div className="error">{error}</div>
      <br/>      
      <div className="videoTitle">{videoTitle}</div>
      <br/>
      <div className="VTTLink">{VTTLink}</div>
      <br/>
      <div className="VTTData">{VTTData && <textarea rows="30" cols="100" value={VTTData}/>}
      </div>
       
    </div>
    )
}

export default App;