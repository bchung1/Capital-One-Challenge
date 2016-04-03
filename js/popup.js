var ID = "YOUR-ID"; 
var key = "YOUR-KEY";
/***************************************************************************
*******************       SUMMARY CONTROLLER        ************************
****************************************************************************/

var myApp = angular.module('SummarizerExtension', ['ngRoute']);
myApp.controller("PopupListController", function ($scope) {

  var summary_type = URL; 
  var URL;
  var textapi;
  var title; 
  var text; 
  var summary; 
  var font_size_idx = 1; 
  var font_sizes = ['small', 'medium', 'large', 'x-large'];
  var resize = 'grow'; 

  // when the popup is opened a default summary of 
  // 10 sentences is displayed 
  $( document ).ready(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {'command': 'getURL'}, function(response) {
        getTextApiObject(); 
        URL = response;
        initialize(URL);
      });
    });
  });

  function initialize(URL){
   textapi.extract({
    url: URL
  }, function(error, response) {
    if (error === null) {
      initializeSummary(response.title, response.article, function(){ 
       summarizeSentencesText(10);
     }); 
    };
  });
 }


 function initializeSummary(param_title, param_text, callback){
  title = param_title;
  text = param_text;
  callback();
}

// saves summary to chrome storage for offline reading
$('#save').click(function(){ 
  var json = {}; 
  json[title] = {'URL':URL,'text':text,'summary':summary};
  chrome.storage.largeSync.set(json, function(){ 
  });

}); 

// Resizes browser body so user can read original article and summary 
// at the same time. 
$('#resize').click(function(){ 
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {'command': 'resize'});
  });
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

  // summarizes the pasted text into 10 sentences
  $( '#text_submit' ).click(function() {
    title = $('#article_title').val(); 
    $('#article_title').val(''); 
    text = $('#pasted_text').val();
    $('#pasted_text').val('');
    summarizeSentencesText(10);
  });

// Grab input value when enter key is pressed 
$('#insert_num_sentences').keypress(function (e) {
  if (e.which == 13) {
    var num_sentences = $(this).val();
    summarizeSentencesText(num_sentences);
    $(this).val('');
    return false;   
  }
});

// return textapi object
function getTextApiObject(){
  var AYLIENTextAPI = require('aylien_textapi');
  textapi = new AYLIENTextAPI({
    application_id: ID, 
    application_key: key
  });
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
      $('#alt_smmry_container').show(); 
      $('#sentences_bar').hide(); 
      summary_type = 'URL';
    }
  });
}

// Data bind the array of setences returned by the textapi object's call
// to the method .summarize() to the {{sentence}} expression with text. 
function summarizeSentencesText(num_sentences){
 if(text == ''){
  $('#summary_container').hide(); 
  $('#alt_smmry_container').show(); 
  $('#sentences_bar').hide();
}else{
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
      $('#pasted_text').val('Text too short to summarize');
    }else{
     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {'command': 'highlight', 'text':response.sentences});
    });
     $('#alt_smmry_container').hide(); 
     $('#sentences_bar').show(); 
     $('#summary_container').show(); 
     summary = response.sentences; 
     $scope.sentences = response.sentences; 
     $scope.$apply(); 
     summary_type = 'text';
   }
 }
});
}
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

  var text; 
  var textapi; 

  $( document ).ready(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {'command': 'getURL'}, function(response) {
        getTextApiObject(); 
        initialize(textapi, response);
      });
    });
  });

// summarizes the pasted text into 10 sentences
$( '#keywords_submit' ).click(function() {
  title = $('#article_title').val(); 
  $('#article_title').val(''); 
  text = $('#pasted_text').val();
  $('#pasted_text').val('');
  getKeywords(textapi,text);
});

// return textapi object
function getTextApiObject(){
  var AYLIENTextAPI = require('aylien_textapi');
  textapi = new AYLIENTextAPI({
    application_id: ID, 
    application_key: key
  });
}

function initialize(textapi, URL){
 textapi.extract({
  url: URL
}, function(error, response) {
  if (error === null) {
    getArticleInfo(response.article, function(){ 
      getKeywords(textapi,text);
    }); 
  };
});
}


function getArticleInfo(param_text, callback){
  text = param_text;
  callback();
}

  // extracts the keywords from the article
  function getKeywords(textapi,text){
    if(text == ''){
      $('#keywords_container').hide(); 
      $('#alt_keywords_container').show(); 
    }
    textapi.entities({
      text: text
    }, function(error, response) {
      if (error === null) {
        if(response.entities.length != 0){
          $('#alt_keywords_container').hide();
          $('#keywords_container').show(); 
          $scope.organizations = response.entities.organization; 
          $scope.persons = response.entities.person; 
          $scope.keywords = response.entities.keyword;
          $scope.locations = response.entities.location;
          $scope.wikiLink = 'https://www.wikipedia.org/wiki/';
          $scope.$apply(); 
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
           var person =  response.entities.person; 
           var keywords =  response.entities.keyword; 
           var organizations =  response.entities.organization; 
           var locations = response.entities.location; 
           var bundle = person.concat(keywords).concat(organizations).concat(locations);
           chrome.tabs.sendMessage(tabs[0].id, {'command': 'highlight', 'text':bundle});
         });
        }
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
      if(response.author == ''){ 
        author = "Failed to extract author"
      }else{
        author = response.author; 
      }
      if(response.publishDate == ''){ 
        date = "Failed to extract publish date"
      }else{
        date = parseDate(response.publishDate);
      }
      $scope.author = author;  
      $scope.pub_date = date; 
      $scope.show = true; 
      $scope.$apply(); 
    }
  });
}

// extracts only the date portion of string
function parseDate(date){
  return date.slice(0,10);
}
});

/***************************************************************************
************************* HISTORY CONTROLLER *******************************
****************************************************************************/

var myApp = angular.module('HistoryPage', ['ui.bootstrap']);
myApp.controller("HistoryController", function ($scope) {
  $( document ).ready(function() {
    chrome.storage.largeSync.get(null, function(items){
      printSummaryHistory(items);
    });
  });

  function printSummaryHistory(items){
    if(jQuery.isEmptyObject(items)){
      $('#clear_history_btn').hide(); 
      $('#no_history_msg').show(); 
    }else{
     $('#clear_history_btn').show(); 
     $('#no_history_msg').hide(); 
   }
   $scope.articles = items;
   $scope.$apply(); 
 }

 $scope.showSummary = function(){ 
  $('.saved_article').hide();
  $('.saved_summary').show(); 
}

$scope.showArticle = function(){ 
  $('.saved_summary').hide(); 
  $('.saved_article').show();  
}

$scope.removeArticle = function(key){
  chrome.storage.largeSync.remove([key],function(){ 
   chrome.storage.largeSync.get(null, function(items){
    printSummaryHistory(items);
  });
 });
}

$scope.clearHistory = function(){ 
  chrome.storage.largeSync.clear(function(){ 
   chrome.storage.largeSync.get(null, function(items){
    printSummaryHistory(items);
  });
 });
}

});
