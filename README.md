# Capital One Article Summarization Challenge
This project is a google chrome extension that summarizes online articles.
This extension uses Aylien Text API to summarize online articles and extract key information from the article. 

#Install
In order to use this exension you need to first install node.js https://nodejs.org/en/download/ <br>
After installing node.js enter these into the command line: <br>
1) Get repository: <br>

$ git -clone https://github.com/bchung1/Capital-One-Challenge.git <br>

2) Open the folder "Capital-One-Challenge" and install local dependencies: aylien_textapi <br>

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

$ sudo browserify popup.js -o bundle.js <br>

5) Finally, load the extension into chrome. <br>


#Extension Features

![alt text](screenshots/home.png "This is the default layout which summarizes the current page in 10 sentences") <br>
This is the default layout which summarizes the current page in 10 sentences <br> <br>

![alt text](screenshots/keywords.png "This page provides a table of keywords and phrases categorized by keywords, people, organizations, and locations") <br>
This page provides a table of keywords and phrases categorized by keywords, people, organizations, and locations <br><br>

![alt text](screenshots/article_info.png "This page attempts to extract the authors name and publication date of the article") <br>
This page attempts to extract the authors name and publication date of the article <br><br>

![alt text](screenshots/instructions.png "This page lists the methods of summarization") <br> 
This page lists the methods of summarization <br><br>

![alt text](screenshots/buttons.png "This is the default layout which summarizes the current page in 10 sentences") <br>
1) This button resets the page to the default setting which is a summary of 10 sentences. <br>
2) This input field is for the title of the pasted text article. <br>
3) This text area is for the pasted text to summarize. Entering a title in addition to the text helps summarize the text, but is optional. <br>
4) This button decrements the number of sentences displayed by 1 sentence. <br>
5) This button increments the number of sentences displayed by 1 sentence. <br>
6) This button decreases the font size of the summary. <br>
7) This button increases the font size of the summary. <br> 
8) This button copies the displayed summary onto the clipboard. <br>
9) This is input for the number of sentences to display for the summary. <br><br>

![alt text](screenshots/highlight.png "This is the default layout which summarizes the current page in 10 sentences") <br>

This is the bonus objective I added which highlights the summary sentences in the current browser page. I hoped that this feature would help readers easily identify where the summary sentences and its context in the article as whole. <br> <br>





