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

      // get about me information from mint
      $.ajax({
        url: "https://wwws.mint.com/htmlFragment.xevent?task=as-nav-content-about&rnd=" + (Math.random() * 100000000000000000)
      })
      .done(function(response) {
        var aboutMeHtml = $(response.xmlContent);
        
        var ageRange = aboutMeHtml.find("#as-nav-content-about-age option:selected").text();
        var gender = aboutMeHtml.find("#as-nav-content-about-male").parent().find("input:checked").val();
        var maritalStatus = aboutMeHtml.find("#as-nav-content-about-martial option:selected").text();
        var educationLevel = aboutMeHtml.find("#as-nav-content-about-education option:selected").text();
        var profession = aboutMeHtml.find("#as-nav-content-about-profession option:selected").text();
        var incomeRange = aboutMeHtml.find("#as-nav-content-about-income option:selected").text();
        var residentialStatus = aboutMeHtml.find("#as-nav-content-about-residential option:selected").text();
        var householdSizeAdults = aboutMeHtml.find("#as-nav-content-about-household-adults option:selected").text().split("")[0];
        var householdSizeChildren = aboutMeHtml.find("#as-nav-content-about-household-children option:selected").text().split("")[0];
      
        mintInfo.ageRange = ageRange;
        mintInfo.gender = gender;
        mintInfo.maritalStatus = maritalStatus;
        mintInfo.educationLevel = educationLevel;
        mintInfo.profession = profession;
        mintInfo.incomeRange = incomeRange;
        mintInfo.residentialStatus = residentialStatus;
        mintInfo.householdSizeAdults = householdSizeAdults;
        mintInfo.householdSizeChildren = householdSizeChildren;

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