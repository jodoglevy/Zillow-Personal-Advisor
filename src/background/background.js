// rewrite zillow getResults responses to contain the data we want to display
var responseRewriter = {};
var shouldReload = false;

// implement a storage layer that can be used for content scripts on different
// domains to communicate, using background thread
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.get) {
      sendResponse(localStorage.getItem(request.get));
    }
    else if(request.set) {
      if(request.set.value) {
        localStorage.setItem(request.set.key, request.set.value);
      } else {
        localStorage.removeItem(request.set.key);
      }
      sendResponse();
    }
    else if(request.shouldReload) {
      sendResponse(shouldReload);
      shouldReload = false;
    }
  }
);


chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    
    if(details.url.indexOf("allowThroughRewriter") === -1) {
      console.log("transforming response for");
      console.log(details.url);

      // by default, repeat the request so we can modify it next time around
      var redirectUrl = details.url + "&forceRepeat";

      if(!responseRewriter[details.url]) {
        // call the request ourselves so we can modify it next time
        // its requested

        if(details.url.indexOf("forceRepeat") !== -1) {
          console.log("tried repeating the request, still not ready. reloading map");
          shouldReload = true;
        }
        else {
           console.log("not ready to return transformed response, repeating request");
        
          $.ajax({
            url: details.url + "&allowThroughRewriter",
          })
          .done(function(response) {
            // transform response
            rewriteZillowGetResultsResponse(response, function(transformedData) {
              responseRewriter[details.url] = transformedData;
            })  
          });
        }

      }
      else {
        console.log("transformed response is ready, rewriting response");

        var forcedResponse = responseRewriter[details.url];
        redirectUrl = "data:text/json;," + JSON.stringify(forcedResponse);
      }

      return {
        redirectUrl: redirectUrl
      };
    }
  },
  {
      urls: ["*://*.zillow.com/search/GetResults.htm*"]
  },
  ["blocking"]
);