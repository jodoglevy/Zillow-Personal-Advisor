function startZillow() {
    
  setInterval(function() {
    chrome.runtime.sendMessage({"shouldReload": true}, function(shouldReload) {
      if(shouldReload) {
        window.location.reload();
      }
    });
  }, 100);
}