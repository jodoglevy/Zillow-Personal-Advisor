function startZillow() {
    
  setInterval(function() {
    chrome.runtime.sendMessage({"shouldReload": true}, function(shouldReload) {
      if(shouldReload) {
        window.location.reload();
      }
    });
  }, 100);

  setTimeout(function() {
    globalStorage.getItem("abc", function(value) {
      console.log("from zillow:" + value);
      globalStorage.setItem("abc", "zillow");
    });
  }, 5000);
}