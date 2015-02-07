function startMint() {
    
  setTimeout(function() {
    globalStorage.getItem("abc", function(value) {
      console.log("from mint:" + value);
      globalStorage.setItem("abc", "mint");
    });
  }, 5000);
}