import React, { useState } from 'react';
import './App.css';
import axios from "axios";

// layout import 
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';


// Regular Expressions
var filterVTTLink = /(https:?:[a-zA-Z0-9._/-]*\.vtt)/; // Removes the link to the VTT file from the pubmedialinks api response
var filterFormatting1 = /"WEBVTT/g; // Removes WEBVTT off from the VTT Data
var filterFormatting2 = /([\d]+:[\d]+){1,}(\.[\d]+)/g;
var filterFormatting3 = /(\s-->\s)|(line[.:,0-9%\sa-z]+)|(\\r\\n‎)/g;
var filterFormatting4 = /(\\r\\n){1,}|(\\r\\n)\s{1,}|(\\n){1,}/g;
var filterFormatting5 = /\n\s{2,}/g;
var filterFormatting6 = /<[/a-zA-z]+>|[\s]{2,}/g;
var filterRemoveLank = /lank=(.*)&/;

function App({initialValue}) {
  const [VTTLink, setVTTLink] = useState(false);
  const [videoTitle, setVideoTitle] = useState(false);
  const [VTTData, setVTTData] = useState(false);
  const [inputURL, setinputURL] = useState('');
  const [error, setError] = useState('');

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
      let parsedJson = JSON.parse(json);
      setVideoTitle(parsedJson.media[0].title);
      getVTTFileFromJWServer(filteredResults[0]);     
      // console.log(json); 
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
        // setVTTData(stringifiedResponse);
        filterFormattingFromVTTFile(stringifiedResponse);
      })
      .catch(error => {
      setError(error.message);
    });
  }

  function filterFormattingFromVTTFile(VTTData){
    let nothing = ' ';
    let filteredResults = VTTData.replace(filterFormatting1,nothing);               //removing the "WEBVTT at the front of the paragraph
    let secondFilteredResults = filteredResults.replace(filterFormatting2,nothing); // removing the timecodes
    let thirdFilteredResults = secondFilteredResults.replace(filterFormatting3,nothing); // remove the \r and \n
    let fourthFilteredResults = thirdFilteredResults.replace(filterFormatting4, '\n'); 
    let fifthFilteredResults = fourthFilteredResults.replace(filterFormatting5,'\n');
    let sixthFilteredResults = fifthFilteredResults.replace(filterFormatting6,nothing);
    setVTTData(sixthFilteredResults);
  }

  // handleSubmit function
  const handleSubmit = event => {
    setError('');
    setVTTData('');
    setVTTLink('');
    setVideoTitle('');
    event.preventDefault();
    // check that it is in fact a url then below
    filterPubFromLink(inputURL);
  }


  return(

    <Container className="p-3">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <h1 className="d-flex justify-content-center">JW.Org Video Captions Extractor</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label>
                <p className="d-flex justify-content-center">Right Click a video on JW.ORG-> LFF and paste the link here to get captions</p>
                <input type="text" size="70" value={inputURL} onChange={e=>setinputURL(e.target.value)} className="d-flex justify-content-center"/>
              </label>
            </fieldset>
            <Button className="d-flex justify-content-center" type="submit">Begin Extraction</Button>
            <hr/>
          </form>

          <div className="error">{error}</div>
          <br/>
          <div className="videoTitle"><h3>Title:</h3> {videoTitle}</div>
          <br/>
          <div className="VTTData"><h3>Video Closed Captions:</h3>{VTTData && <textarea className="maxWidth maxHeight" defaultValue={VTTData}/>}
          <br/>
          <div className="VTTLink">{VTTLink}</div>
          </div>
          <br/>
          <div className="information"><h3> Check out some of the already prepared publications we use normally</h3></div>
          <div className="links">
            <ul>
              <li><a href="">LFF - Live Forever Book - Normal Print</a></li>
              <li><a href="">LFF - Live Forever Book - Large Print</a></li>
              <li><a href="">LFF - Live Forever Book - Largre Print - Main Point Highlighted</a></li>
            </ul>
        </div>
      </div>  
      </Container>
    </Container>
    )
}

export default App;