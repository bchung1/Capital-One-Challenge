# Capital One Article Summarization Challenge
This project is a google chrome extension that summarizes online articles.
This extension uses Aylien Text API to summarize online articles and extract key information from the article. 

#Install
Enter this into the command line: 

$ git -clone https://github.com/bchung1/Capital-One-Challenge.git
$ npm install


#Usage
In order to use this extension all you need is your own ID and key from Aylien Text API. 
Steps: 

1) Sign up here https://developer.aylien.com/signup and get 1,000 calls a day for free. 
2) Open the repository and open popup.js which is in the js folder. At the very top there are two variables ID and key. Assign to those variables your key and ID. 
3) Now we have to update the bundle.js file using browserify.js which is a tool for compiling node-flavored commons modules for the browser.
4) To update bundle.js with the new key and ID, enter: 

$ browserify popup.js -o bundle.js 
