# JwOrgVideoCaptionsExtractor

This React project was conceived because currently there is not a way to extract captions from the videos provided on the website. The videos have audio which is helpful for the blind but there is a subset of individuals with no access. There are some deaf and blind individuals that do not use braille that have no access to the videos and their content. Extracting the captions is an option for some of these users.

## Overview

The JW.ORG has a public API that it uses to serve up media. The API responds with links to the video file and the Closed Caption VTT file. Downloading this file we can remove formatting and reformat the scripted content into a desirable paragraph there in making the content available to users.

## Process

1. The user will enter the link to any video on JW.ORG and submit the form
2. The app will request the media links and extract the following from the response
  * Title
  * VTT file link
3. The app will download the VTT file and use REGEX to strip unnecessary formatting contained in the file. 
4. A paragraph with the video script will be displayed for the app use to copy and format as needed for his/her use. 

## Testing

You can clone this project to a local computer for testing.

### 'npm start'

Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### 'npm run build'

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
