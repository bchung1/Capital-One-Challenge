var ID = "YOUR_ID"; 
var key = "YOUR-KEY";
/***************************************************************************
*******************       SUMMARY CONTROLLER        ************************
****************************************************************************/

var myApp = angular.module('SummarizerExtension', ['ngRoute']);
myApp.controller("PopupListController", function ($scope) {
  var pasted_text; 
  var summary_type; 
  var URL;
  var textapi; 
  var title; 
  var font_size_idx = 1; 
  var font_sizes = ['small', 'medium', 'large', 'x-large'];

  // when the popup is opened a default summary of 
  // 10 sentences is displayed 
  $( document ).ready(function() {
    //initialize summary has 10 sentences
    initialize(); 
    summary_type = 'URL';
  });

  // increases the summary font size
  $('#incr_font').click(function (){
    if(font_size_idx != 3){
      $('#summary_container').css('font-size', font_sizes[font_size_idx + 1]);
      font_size_idx++; 
    }
  }); 

  // decreases the summary font size
  $('#decr_font').click(function (){
    if(font_size_idx != 0){
      $('#summary_container').css('font-size', font_sizes[font_size_idx - 1]);
      font_size_idx--; 
    }
  });

  // copies the summary to the clipboard
  $('#copy_button').click(function(){ 
    var summaryList = document.querySelector('#list');  
    var range = document.createRange();  
    range.selectNode(summaryList);  
    window.getSelection().addRange(range);  

    try {  
    // Now that we've selected the anchor text, execute the copy command  
    var successful = document.execCommand('copy');  
    var msg = successful ? 'successful' : 'unsuccessful';  
    console.log('Copy email command was ' + msg);  
  } catch(err) {  
    console.log('Oops, unable to copy');  
  }  

  // Remove the selections - NOTE: Should use
  // removeRange(range) when it is supported  
  window.getSelection().removeAllRanges();  
}); 

  // resets the summary to the default summary 
  // which is a summary of 10 sentences of the 
  // current webpage 
  $('#reset').click(function(){
    $('#temp').empty(); 
    $('#list').css('display', 'block');
    initialize(); 
  }); 

  // summarizes the pasted text into 10 sentences
  $( '#text_submit' ).click(function() {
    title = $('#article_title').val(); 
    $('#article_title').val(''); 
    pasted_text = $('#pasted_text').val();
    $('#pasted_text').val('');
    summarizeSentencesText(textapi,pasted_text,10);
  });

// Grab input value when enter key is pressed 
$('#insert_num_sentences').keypress(function (e) {
  if (e.which == 13) {
    var num_sentences = $(this).val();
    if(summary_type == 'URL'){
      summarizeSentencesURL(textapi,URL,num_sentences); 
    }else if(summary_type == 'text'){
      summarizeSentencesText(textapi,pasted_text,num_sentences);
    }
    $(this).val('');
    return false;   
  }
});

// increment number of sentences when plus button clicked 
$("#plus_button").click(function(event) {
  var length = $('#list>li').length;
  if(summary_type == 'URL'){
    summarizeSentencesURL(textapi,URL,length + 1); 
  }else if(summary_type == 'text'){ 
    summarizeSentencesText(textapi,pasted_text,length + 1); 
  }
});

// decrement number of sentences when minus button clicked 
$("#minus_button").click(function(event) {
  var length = $('#list>li').length;
  if(summary_type == 'URL'){
    summarizeSentencesURL(textapi,URL,length - 1); 
  }else if(summary_type == 'text'){ 
    summarizeSentencesText(textapi,pasted_text,length - 1); 
  }
});

// This function handles all the calls for a new summary 
function initialize(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {'command': 'getURL'}, function(response) {
      textapi = getTextApiObject(); 
      URL = response;
      summarizeSentencesURL(textapi, URL, 10);
    });
  });
}

// return textapi object
function getTextApiObject(){
  var AYLIENTextAPI = require('aylien_textapi');
  textapi = new AYLIENTextAPI({
    application_id: ID, 
    application_key: key
  });
  return textapi; 
}

// Data bind the array of setences returned by the textapi object's call
// to the method .summarize() to the {{sentence}} expression with URL. 
function summarizeSentencesURL(textapi, URL, num_sentences){ 
  textapi.summarize({
    url: URL, 
    sentences_number: num_sentences
  }, function(error, response) {
    if (error === null && response.sentences.length != 0) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {'command': 'highlight', 'text':response.sentences});
      });
      $scope.sentences = response.sentences; 
      $scope.$apply(); 
    }else{
      $('.jumbotron').append(
        "<h4>Sorry, couldn't extract summary</h4> <br>"
        );
      $('.jumbotron').css('text-align','center');
      $('.jumbotron').append('<img id="sadFace" src="img/sad_face.png"/>');
    }
    summary_type = 'URL';
  });
}

// Data bind the array of setences returned by the textapi object's call
// to the method .summarize() to the {{sentence}} expression with text. 
function summarizeSentencesText(textapi,text, num_sentences){ 
  if(title == ''){
    title = parseString(text);
  }
  textapi.summarize({
    title: title, 
    text: text,
    sentences_number: num_sentences
  }, function(error, response) {
    if (error === null) {
      if(response.sentences.length == 0){
        if(summary_type != 'text'){
          $('#list').css('display','none');
          $('.jumbotron').append(
            "<strong><h4 id='temp'>Text is too short!</h4></strong>"
            );
          $('#temp').css('text-align','center');
        }
      }else{
        $('#list').css('display','block');
        $('#temp').empty();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {'command': 'unhighlight'});
        });
        $scope.sentences = response.sentences; 
        $scope.$apply(); 
      }
      summary_type = 'text';
    }
  });
}
});

// returns first 50 characters of inputed text
// in case no title is given
function parseString(text){
  return text.slice(0,50); 
}

/***************************************************************************
****************        KEYWORDS CONTROLLER       **************************
****************************************************************************/

var myApp = angular.module('KeywordsPage', ['ngRoute']);
myApp.controller("KeywordsController", function ($scope) {

  $( document ).ready(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {'command': 'getURL'}, function(response) {
        /*getKeywords(response);*/
        var AYLIENTextAPI = require('aylien_textapi');
        textapi = new AYLIENTextAPI({
      application_id: ID, // can get your own id and key at https://developer.aylien.com/signup
      application_key: key
    });
        getKeywords(textapi, response);
        
      });
    });
  });

  // extracts the keywords from the article
  function getKeywords(textapi, url){
    textapi.entities({
      url: url 
    }, function(error, response) {
      if (error === null) {
        $scope.organizations = response.entities.organization; 
        $scope.persons = response.entities.person; 
        $scope.keywords = response.entities.keyword;
        $scope.locations = response.entities.location;
        $scope.wikiLink = 'https://www.wikipedia.org/wiki/';
        $scope.$apply(); 
      }
    });

  }

});

/***************************************************************************
******************** ARTICLE INFO CONTROLLER *******************************
****************************************************************************/

var myApp = angular.module('ArticleInfo', ['ngRoute']);
myApp.controller("info", function ($scope) {

 $( document ).ready(function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {'command': 'getURL'}, function(response) {
      /*getKeywords(response);*/
      var AYLIENTextAPI = require('aylien_textapi');
      textapi = new AYLIENTextAPI({
        application_id: ID,
        application_key: key
      });
      getInfo(textapi, response);

    });
  });
});
 
 //attempts to extract the author's name and the publication date
 function getInfo(textapi, url){
  textapi.extract({
    url: url
  }, function(error, response) {
    var author; 
    var date; 
    if (error === null) {
      author = response.author; 
      date = response.publishDate; 
      if(response.author == ''){ 
        author = "Couldn't extract author :("
      }
      if(response.publishDate == ''){ 
        date = "Couldn't extract publish date :("
      }
      $scope.author = author;  
      $scope.pub_date = date; 
      $scope.$apply(); 
    }
  });
}




});



