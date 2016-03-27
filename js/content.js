chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.command == "getURL") {
			var URL = window.location.href; 
		}
		sendResponse(URL);
	});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.command == "highlight") {
			$('body').unhighlight();
			var text = request.text; 
			$('body').highlight(text);
			$(".highlight").css({ backgroundColor: "#FFFF88" });
		}else if(request.command == 'unhighlight'){
			$('body').unhighlight();
		}
	});
