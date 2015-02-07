function startZillow() {
    
  setTimeout(function() {
    globalStorage.getItem("abc", function(value) {
      console.log("from zillow:" + value);
      globalStorage.setItem("abc", "zillow");
    });
  }, 5000);
}