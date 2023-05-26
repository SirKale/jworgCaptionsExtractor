import React, { useState } from 'react';
import './App.css';
import axios from "axios";

//Variables
// const URL = "https://app.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?langwritten=E&fileformat=mp4&pub=lffv&track=32";
// https://www.jw.org/open?lank=pub-lffv_51_VIDEO&wtlocale=E

// Regular Expressions
var filterVTTLink = /(https:\/\/\S*\.vtt)/g; // Removes the link to the VTT file from the pubmedialinks api response
var filterFormatting1 = /WEBVTT/g; // Removes WEBVTT off from the VTT Data
var filterFormatting2 = /\d+:\d+:\d+.\d+\s-->\s\d+:\d+:\d+.\d+\s\S*\s\S*\s*align:center/gm; // Removes time codes and some formatting
var filterFormatting3 = /\\r\\n/g; // Removes the final carriage returns and new lines
var filterPub = /pub=([a-zA-Z]*).*[^track].*/gm;
var filterPubTrack = /pub=(.*)&track=(\d+)/gm;
var filterDocID = /docid=(\d+)/gm;
var filterJWB = /(pub[a-zA-Z0-9-_]*)/gm;
var filterPubMediaLinks = /GETPUBMEDIALINKS/g;
var filterMediator = /mediator/g;
var filterRemoveLank = /lank=(.*)&/g;
var testDocID = /docid/gm;
var testURL = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/g;

function App({initialValue}) {
  const [VTTLink, setVTTLink] = useState(false);
  const [videoTitle, setvideoTitle] = useState(false);
  const [VTTData, setVTTData] = useState(false);
  const [inputURL, setinputURL] = useState('');
  const [error, setError] = useState('');
  const [pubMediaLinksData , setPubMediaLinksData] = useState('');

function filterDataProvided(str){

  // no need to filter. just execute it and if you get a response run it through otherwise display an error.

  if(filterPubMediaLinks.test(str) || filterMediator.test(str)){
    setPubMediaLinksData(str);
    getURL(str);
  } else if(filterRemoveLank.test(str)){
    console.log('yup');
    // let groups = filterRemoveLank.match(str);
    let groups = str.match(filterRemoveLank);
    // console.log(JSON.stringify(groups)+'123');
    console.log(groups);
  } else {
    setError('We are not sure about this one. Please send us an email to support@thisSite.com about this error. Unknown URL:' + str);
  }

 }

function getURL(inputURL) {
  axios
    .get(inputURL)
    .then((response) => {
      let stringifiedResponse = JSON.stringify(response.data);
      filterVTTLinkFromPubMediaLinksAPI(stringifiedResponse);
    })
    .catch(error => {
    setError(error.message);
  });
}

function filterVTTLinkFromPubMediaLinksAPI(json){
  let filteredResults = filterVTTLink.exec(json);
  setVTTLink(filteredResults[0]);
  getVTTFileFromJWServer(filteredResults[0]);
}

function getVTTFileFromJWServer(link){
  axios
    .get(link)
    .then((response) => {
      let stringifiedResponse = JSON.stringify(response.data);
      filterFormattingFromVTTFile(stringifiedResponse);
    });
}

function filterFormattingFromVTTFile(VTTData){
  let nothing = ' ';
  let filteredResults = VTTData.replace(filterFormatting1,nothing);               //removing the WEBVTT at the front of the paragraph
  let secondFilteredResults = filteredResults.replace(filterFormatting2,nothing); // removing the timecodes
  let thirdFilteredResults = secondFilteredResults.replace(filterFormatting3, nothing); // remove the \r and \n
  setVTTData(thirdFilteredResults);
}

// handleSubmit function
const handleSubmit = event => {
  setError('');
  setVTTData('');
  setVTTLink('');
  setvideoTitle('');
  event.preventDefault();
  // getURL(inputURL);
  filterDataProvided(inputURL);
}


return(
  <div className="wrapper">
    <h1>JW.Org Video Captions Extractor</h1>

    <form onSubmit={handleSubmit}>
      <fieldset>
        <label>
          <p>Paste a link to a video, pubname, docid or jwb number caleb carter</p>
          <input type="text" size="150" value={inputURL} onChange={e=>setinputURL(e.target.value)}/>
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
    <div className="VTTData">{VTTData}</div>
     
  </div>
  )
}

export default App;