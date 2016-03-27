# Capital One Article Summarization Challenge
This project is a google chrome extension that summarizes online articles.
This extension uses Aylien Text API to summarize online articles and extract key information from the article. 

#Install
Enter these into the command line: <br>
1) Get repository: <br>

$ git -clone https://github.com/bchung1/Capital-One-Challenge.git <br>

2) Install local dependencies: aylien_textapi <br>

$ npm install <br>

3) Install global dependencies: browserify and watchify <br>

$ npm install -g browserify watchify <br>

#Usage
In order to use this extension all you need is your own ID and key from Aylien Text API. <br>
Steps: <br>

1) Sign up here https://developer.aylien.com/signup and get 1,000 calls a day for free. <br>
2) Open the repository and open popup.js which is in the js folder. At the very top there are two variables ID and key. Assign to those variables your key and ID. <br>
3) Now we have to update the bundle.js file using browserify.js which is a tool for compiling node-flavored commons modules for the browser. <br>
4) To update bundle.js with the new key and ID, enter: <br>

$ browserify popup.js -o bundle.js <br>

5) Finally, load the extension into chrome. <br>
