chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.get) {
      sendResponse(localStorage.getItem(request.get));
    }
    else if(request.set) {
      localStorage.setItem(request.set.key, request.set.value);
    }
});

