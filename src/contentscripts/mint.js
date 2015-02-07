function startMint() {
   
  setTimeout(function() {
    var mintInfo = {};

    // get liquid assets from mint
    var totalLiquidAssetsString = $("#moduleAccounts-bank .balance").first().text();
    
    if(totalLiquidAssetsString !== null && totalLiquidAssetsString !== "") {
      totalLiquidAssetsString = totalLiquidAssetsString.replace(/\$|,/g,"");

      mintInfo.totalLiquidAssets = parseFloat(totalLiquidAssetsString);

      // get credit score from mint
      var creditScoreString = $(".module-credit-score .score-number").first().text();

      if(creditScoreString) {
        mintInfo.creditScore = parseInt(creditScoreString);
      }

      // get marital status from mint
      $.ajax({
        url: "https://wwws.mint.com/htmlFragment.xevent?task=as-nav-content-about&rnd=" + (Math.random() * 100000000000000000)
      })
      .done(function(response) {
        var aboutMeHtml = $(response.xmlContent);
        var maritalStatus = aboutMeHtml.find("#as-nav-content-about-martial option:selected").text();
      
        mintInfo.maritalStatus = maritalStatus;

        console.log(mintInfo);
        globalStorage.setItem("mintInfo", JSON.stringify(mintInfo));

      });

    }
    else {
      startMint();
    }
  }, 10000)


  setTimeout(function() {
    globalStorage.getItem("abc", function(value) {
      console.log("from mint:" + value);
      globalStorage.setItem("abc", "mint");
    });
  }, 5000);
}